import { Prisma } from "@/generated/prisma/client";
import {
  COUNTDOWN_MS, GAME_TTL_MS, canAnswerAt, generatePin, isQuizStatus, normalizePin, parseOptions, parseQuestions, phaseOf,
  questionClosesAt, questionExpired, scoreAnswer, withPlaces, type QuizPhase, type QuizQuestionData, type QuizStatus,
} from "@/src/lib/quiz/logic";
import { prisma } from "@/src/server/db";
import { quizAnswerSchema, quizHostActionSchema, quizJoinSchema } from "@/src/server/validation/schemas";
import { buildReadyQuiz } from "./quiz-service";

// A live game. There is no socket: the teacher's screen and every phone ask for
// the state about once a second. The server is the only clock and the only
// judge; phones never receive the right answer before the question is closed.
// Every state change is a conditional update (`where: { status … }`), so two
// requests arriving together cannot move the game twice.

const PLAYER_TOP = 5;

type GameRow = NonNullable<Awaited<ReturnType<typeof prisma.quizGame.findUnique>>>;

function statusOf(game: GameRow): QuizStatus {
  return isQuizStatus(game.status) ? game.status : "FINISHED";
}

function opensAtOf(game: GameRow) {
  return game.questionStartedAt ? game.questionStartedAt.getTime() : null;
}

/** Closes a question whose time is over. Any poll may do it; only the first one changes the row. */
async function settle(game: GameRow, questions: QuizQuestionData[]): Promise<GameRow> {
  const question = questions[game.currentIndex];
  if (!question || !questionExpired(statusOf(game), opensAtOf(game), question.timeLimitSec, Date.now())) return game;
  await prisma.quizGame.updateMany({ where: { id: game.id, status: "QUESTION", currentIndex: game.currentIndex }, data: { status: "REVEAL" } });
  return { ...game, status: "REVEAL" };
}

function timing(game: GameRow, question: QuizQuestionData | undefined) {
  const opensAt = opensAtOf(game);
  return { opensAt, closesAt: opensAt !== null && question ? questionClosesAt(opensAt, question.timeLimitSec) : null };
}

// ── Teacher ─────────────────────────────────────────────────────────────────

export async function createGame(hostId: string, quizId: string) {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ownerId: hostId }, include: { questions: { orderBy: { order: "asc" } } } });
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");
  if (!quiz.questions.length) throw new Error("QUIZ_HAS_NO_QUESTIONS");
  const questions: QuizQuestionData[] = quiz.questions.map((question) => ({
    text: question.text, options: parseOptions(question.options),
    correctIndex: question.correctIndex, timeLimitSec: question.timeLimitSec,
  }));
  return openGame(hostId, quiz.title, questions, quizId);
}

/** A game from the ready quiz of a course unit: no quiz of the teacher's own is needed. */
export async function createReadyGame(hostId: string, moduleId: string) {
  const ready = await buildReadyQuiz(moduleId);
  return openGame(hostId, ready.title, ready.questions, null);
}

async function openGame(hostId: string, title: string, questions: QuizQuestionData[], quizId: string | null) {
  const cutoff = new Date(Date.now() - GAME_TTL_MS);
  // The teacher's earlier games that were never finished would keep their PINs busy.
  await prisma.quizGame.updateMany({ where: { hostId, status: { not: "FINISHED" } }, data: { status: "FINISHED", finishedAt: new Date() } });
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const pin = generatePin();
    const busy = await prisma.quizGame.findFirst({ where: { pin, status: { not: "FINISHED" }, createdAt: { gt: cutoff } }, select: { id: true } });
    if (busy) continue;
    const game = await prisma.quizGame.create({ data: { quizId, hostId, pin, title, questions: JSON.stringify(questions) } });
    return { id: game.id, pin: game.pin };
  }
  throw new Error("PIN_UNAVAILABLE");
}

async function loadHostGame(hostId: string, gameId: string) {
  const game = await prisma.quizGame.findFirst({ where: { id: gameId, hostId } });
  if (!game) throw new Error("GAME_NOT_FOUND");
  const questions = parseQuestions(game.questions);
  return { game: await settle(game, questions), questions };
}

export async function getHostState(hostId: string, gameId: string) {
  const { game, questions } = await loadHostGame(hostId, gameId);
  const now = Date.now();
  const status = statusOf(game);
  const phase = phaseOf(status, opensAtOf(game), now);
  const question = questions[game.currentIndex];
  const players = await prisma.quizPlayer.findMany({ where: { gameId }, orderBy: [{ score: "desc" }, { joinedAt: "asc" }], select: { id: true, nickname: true, score: true } });
  const answers = question && (phase === "QUESTION" || phase === "REVEAL")
    ? await prisma.quizAnswer.groupBy({ by: ["optionIndex"], where: { gameId, questionIndex: game.currentIndex }, _count: { _all: true } })
    : [];
  const distribution = question ? question.options.map((_, index) => answers.find((item) => item.optionIndex === index)?._count._all ?? 0) : [];
  return {
    id: game.id, pin: game.pin, title: game.title, phase, now,
    questionIndex: game.currentIndex, total: questions.length,
    ...timing(game, question),
    // The teacher's screen is shown to the class: the right answer is sent only after the question closes.
    question: question && phase !== "LOBBY" && phase !== "FINISHED"
      ? { text: question.text, options: question.options, timeLimitSec: question.timeLimitSec, correctIndex: phase === "REVEAL" ? question.correctIndex : null }
      : null,
    players: withPlaces(players),
    answeredCount: distribution.reduce((sum, count) => sum + count, 0),
    distribution: phase === "REVEAL" ? distribution : null,
  };
}

export type HostGameState = Awaited<ReturnType<typeof getHostState>>;

export async function hostAction(hostId: string, gameId: string, input: unknown) {
  const { action } = quizHostActionSchema.parse(input);
  const { game, questions } = await loadHostGame(hostId, gameId);
  const status = statusOf(game);
  const opensNext = new Date(Date.now() + COUNTDOWN_MS);
  if (action === "start") {
    if (status !== "LOBBY") return;
    if (!(await prisma.quizPlayer.count({ where: { gameId } }))) throw new Error("NO_PLAYERS");
    await prisma.quizGame.updateMany({ where: { id: gameId, status: "LOBBY" }, data: { status: "QUESTION", currentIndex: 0, questionStartedAt: opensNext } });
  } else if (action === "reveal") {
    // Closing early is allowed only once the question is on the phones.
    if (status !== "QUESTION" || phaseOf(status, opensAtOf(game), Date.now()) !== "QUESTION") return;
    await prisma.quizGame.updateMany({ where: { id: gameId, status: "QUESTION", currentIndex: game.currentIndex }, data: { status: "REVEAL" } });
  } else if (action === "next") {
    if (status !== "REVEAL") return;
    const last = game.currentIndex >= questions.length - 1;
    await prisma.quizGame.updateMany({
      where: { id: gameId, status: "REVEAL", currentIndex: game.currentIndex },
      data: last ? { status: "FINISHED", finishedAt: new Date() } : { status: "QUESTION", currentIndex: game.currentIndex + 1, questionStartedAt: opensNext },
    });
  } else if (status !== "FINISHED") {
    await prisma.quizGame.updateMany({ where: { id: gameId, status: { not: "FINISHED" } }, data: { status: "FINISHED", finishedAt: new Date() } });
  }
}

/** The teacher's finished and running games, newest first. */
export async function listHostGames(hostId: string, take = 10) {
  const games = await prisma.quizGame.findMany({
    where: { hostId }, orderBy: { createdAt: "desc" }, take,
    select: { id: true, title: true, status: true, pin: true, createdAt: true, _count: { select: { players: true } } },
  });
  return games.map((game) => ({ id: game.id, title: game.title, status: game.status, pin: game.pin, createdAt: game.createdAt.toISOString(), playerCount: game._count.players }));
}

export type HostGameListItem = Awaited<ReturnType<typeof listHostGames>>[number];

// ── Learner ─────────────────────────────────────────────────────────────────

/** The newest game with this PIN. Finished games stay reachable for a while so players can see the results. */
async function findGameByPin(rawPin: string) {
  const pin = normalizePin(rawPin);
  if (pin.length !== 6) throw new Error("GAME_NOT_FOUND");
  const game = await prisma.quizGame.findFirst({ where: { pin, createdAt: { gt: new Date(Date.now() - GAME_TTL_MS) } }, orderBy: { createdAt: "desc" } });
  if (!game) throw new Error("GAME_NOT_FOUND");
  return game;
}

export async function joinGame(userId: string, input: unknown) {
  const data = quizJoinSchema.parse(input);
  const game = await findGameByPin(data.pin);
  if (statusOf(game) === "FINISHED") throw new Error("GAME_FINISHED");
  // Joining again (another tab, a reload) keeps the score and only updates the name.
  await prisma.quizPlayer.upsert({
    where: { gameId_userId: { gameId: game.id, userId } },
    update: { nickname: data.nickname },
    create: { gameId: game.id, userId, nickname: data.nickname },
  });
  return { pin: game.pin };
}

export async function getPlayerState(userId: string, rawPin: string) {
  const found = await findGameByPin(rawPin);
  const questions = parseQuestions(found.questions);
  const game = await settle(found, questions);
  const now = Date.now();
  const phase: QuizPhase = phaseOf(statusOf(game), opensAtOf(game), now);
  const base = { pin: game.pin, title: game.title, phase, now, questionIndex: game.currentIndex, total: questions.length };
  const player = await prisma.quizPlayer.findUnique({ where: { gameId_userId: { gameId: game.id, userId } }, select: { id: true, nickname: true, score: true } });
  if (!player) return { ...base, joined: false as const };

  const question = questions[game.currentIndex];
  const showQuestion = Boolean(question) && (phase === "QUESTION" || phase === "REVEAL");
  const answer = showQuestion
    ? await prisma.quizAnswer.findUnique({ where: { playerId_questionIndex: { playerId: player.id, questionIndex: game.currentIndex } }, select: { optionIndex: true, correct: true, points: true } })
    : null;
  const showResults = phase === "REVEAL" || phase === "FINISHED";
  const [top, ahead] = showResults
    ? await Promise.all([
        prisma.quizPlayer.findMany({ where: { gameId: game.id }, orderBy: [{ score: "desc" }, { joinedAt: "asc" }], take: PLAYER_TOP, select: { id: true, nickname: true, score: true } }),
        prisma.quizPlayer.count({ where: { gameId: game.id, score: { gt: player.score } } }),
      ])
    : [[], 0];
  // Points for the open question are added at once but shown only when it closes:
  // a growing score would tell the player the answer was right.
  const hiddenPoints = phase === "QUESTION" && answer ? answer.points : 0;
  return {
    ...base,
    joined: true as const,
    ...timing(game, question),
    playerCount: phase === "LOBBY" ? await prisma.quizPlayer.count({ where: { gameId: game.id } }) : null,
    question: showQuestion && question ? { text: question.text, options: question.options, timeLimitSec: question.timeLimitSec } : null,
    correctIndex: phase === "REVEAL" && question ? question.correctIndex : null,
    // Whether the answer was right stays hidden until the question closes for everyone.
    answer: answer ? { optionIndex: answer.optionIndex, correct: phase === "REVEAL" ? answer.correct : null, points: phase === "REVEAL" ? answer.points : null } : null,
    me: { nickname: player.nickname, score: player.score - hiddenPoints, place: showResults ? ahead + 1 : null },
    top: withPlaces(top).map((item) => ({ nickname: item.nickname, score: item.score, place: item.place, me: item.id === player.id })),
  };
}

export type PlayerGameState = Awaited<ReturnType<typeof getPlayerState>>;

export async function submitAnswer(userId: string, rawPin: string, input: unknown) {
  const data = quizAnswerSchema.parse(input);
  const game = await findGameByPin(rawPin);
  const questions = parseQuestions(game.questions);
  const question = questions[game.currentIndex];
  const opensAt = opensAtOf(game);
  const now = Date.now();
  if (statusOf(game) !== "QUESTION" || !question || opensAt === null || data.questionIndex !== game.currentIndex || !canAnswerAt(opensAt, question.timeLimitSec, now)) throw new Error("QUESTION_CLOSED");
  if (data.optionIndex >= question.options.length) throw new Error("VALIDATION_ERROR");
  const player = await prisma.quizPlayer.findUnique({ where: { gameId_userId: { gameId: game.id, userId } }, select: { id: true } });
  if (!player) throw new Error("PLAYER_NOT_FOUND");

  const correct = data.optionIndex === question.correctIndex;
  const points = scoreAnswer(correct, now - opensAt, question.timeLimitSec * 1000);
  try {
    // One batch: the unique (player, question) index rejects a second answer and with it the second score.
    await prisma.$transaction([
      prisma.quizAnswer.create({ data: { gameId: game.id, playerId: player.id, questionIndex: game.currentIndex, optionIndex: data.optionIndex, correct, points } }),
      prisma.quizPlayer.update({ where: { id: player.id }, data: { score: { increment: points } } }),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") throw new Error("ALREADY_ANSWERED");
    throw error;
  }
  // Everybody has answered: no reason to keep the class waiting for the timer.
  const [answered, players] = await Promise.all([
    prisma.quizAnswer.count({ where: { gameId: game.id, questionIndex: game.currentIndex } }),
    prisma.quizPlayer.count({ where: { gameId: game.id } }),
  ]);
  if (answered >= players) await prisma.quizGame.updateMany({ where: { id: game.id, status: "QUESTION", currentIndex: game.currentIndex }, data: { status: "REVEAL" } });
  return { accepted: true };
}
