PRAGMA foreign_keys=ON;

CREATE TABLE "AiAssistantSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "feature" TEXT NOT NULL DEFAULT 'tutor',
  "direction" TEXT NOT NULL,
  "nativeLanguage" TEXT NOT NULL,
  "targetLanguage" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "AiAssistantSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AiAssistantMessage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "clientMessageId" TEXT,
  "role" TEXT NOT NULL,
  "recognizedText" TEXT,
  "correctedText" TEXT,
  "translation" TEXT,
  "grammarExplanation" TEXT,
  "teacherReply" TEXT,
  "nextQuestion" TEXT,
  "score" INTEGER,
  "xp" INTEGER NOT NULL DEFAULT 0,
  "coins" INTEGER NOT NULL DEFAULT 0,
  "audioUrl" TEXT,
  "responseJson" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiAssistantMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AiAssistantSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AiTutorMemory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "nativeLanguage" TEXT NOT NULL,
  "targetLanguage" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "summary" TEXT NOT NULL DEFAULT '',
  "weakTopicsJson" TEXT NOT NULL DEFAULT '[]',
  "frequentMistakesJson" TEXT NOT NULL DEFAULT '[]',
  "recentTopicsJson" TEXT NOT NULL DEFAULT '[]',
  "coins" INTEGER NOT NULL DEFAULT 0,
  "lastSessionId" TEXT,
  "lastLessonAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "AiTutorMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AiLearnedWord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "memoryId" TEXT NOT NULL,
  "word" TEXT NOT NULL,
  "normalizedWord" TEXT NOT NULL,
  "translation" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "timesSeen" INTEGER NOT NULL DEFAULT 1,
  "mastery" INTEGER NOT NULL DEFAULT 0,
  "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "AiLearnedWord_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "AiTutorMemory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AiProviderLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "providerType" TEXT NOT NULL,
  "providerName" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "success" BOOLEAN NOT NULL,
  "latencyMs" INTEGER NOT NULL,
  "errorCode" TEXT,
  "requestId" TEXT NOT NULL,
  "sessionId" TEXT,
  "userId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiProviderLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AiAssistantSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AiProviderLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AiUsageCost" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "sessionId" TEXT,
  "providerType" TEXT NOT NULL,
  "providerName" TEXT NOT NULL,
  "model" TEXT NOT NULL,
  "inputUnits" INTEGER,
  "outputUnits" INTEGER,
  "estimatedCost" REAL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "requestId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AiUsageCost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AiUsageCost_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AiAssistantSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "AiAssistantSession_userId_createdAt_idx" ON "AiAssistantSession"("userId", "createdAt");
CREATE INDEX "AiAssistantSession_userId_status_idx" ON "AiAssistantSession"("userId", "status");
CREATE UNIQUE INDEX "AiAssistantMessage_sessionId_clientMessageId_key" ON "AiAssistantMessage"("sessionId", "clientMessageId");
CREATE INDEX "AiAssistantMessage_sessionId_createdAt_idx" ON "AiAssistantMessage"("sessionId", "createdAt");
CREATE UNIQUE INDEX "AiTutorMemory_userId_direction_key" ON "AiTutorMemory"("userId", "direction");
CREATE INDEX "AiTutorMemory_userId_updatedAt_idx" ON "AiTutorMemory"("userId", "updatedAt");
CREATE UNIQUE INDEX "AiLearnedWord_memoryId_language_normalizedWord_key" ON "AiLearnedWord"("memoryId", "language", "normalizedWord");
CREATE INDEX "AiLearnedWord_memoryId_lastSeenAt_idx" ON "AiLearnedWord"("memoryId", "lastSeenAt");
CREATE INDEX "AiProviderLog_sessionId_createdAt_idx" ON "AiProviderLog"("sessionId", "createdAt");
CREATE INDEX "AiProviderLog_userId_createdAt_idx" ON "AiProviderLog"("userId", "createdAt");
CREATE INDEX "AiProviderLog_providerType_providerName_createdAt_idx" ON "AiProviderLog"("providerType", "providerName", "createdAt");
CREATE INDEX "AiProviderLog_requestId_idx" ON "AiProviderLog"("requestId");
CREATE INDEX "AiUsageCost_userId_createdAt_idx" ON "AiUsageCost"("userId", "createdAt");
CREATE INDEX "AiUsageCost_sessionId_createdAt_idx" ON "AiUsageCost"("sessionId", "createdAt");
CREATE INDEX "AiUsageCost_providerType_providerName_model_idx" ON "AiUsageCost"("providerType", "providerName", "model");
CREATE INDEX "AiUsageCost_requestId_idx" ON "AiUsageCost"("requestId");

PRAGMA optimize;
