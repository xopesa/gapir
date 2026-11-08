PRAGMA foreign_keys=ON;

CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'USER', "locale" TEXT NOT NULL DEFAULT 'ru',
  "xp" INTEGER NOT NULL DEFAULT 0, "streak" INTEGER NOT NULL DEFAULT 0, "longestStreak" INTEGER NOT NULL DEFAULT 0,
  "lastActivityDate" DATETIME, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "UserPreference" (
  "userId" TEXT NOT NULL PRIMARY KEY, "sourceLanguage" TEXT NOT NULL DEFAULT 'ru', "targetLanguage" TEXT NOT NULL DEFAULT 'uz',
  "dailyGoalMinutes" INTEGER NOT NULL DEFAULT 10, "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Tashkent',
  CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL PRIMARY KEY, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL,
  "expiresAt" DATETIME NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Course" (
  "id" TEXT NOT NULL PRIMARY KEY, "slug" TEXT NOT NULL, "sourceLanguage" TEXT NOT NULL, "targetLanguage" TEXT NOT NULL,
  "level" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'DRAFT', "coverImageUrl" TEXT, "order" INTEGER NOT NULL DEFAULT 0,
  "isPremium" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "CourseTranslation" (
  "courseId" TEXT NOT NULL, "locale" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL,
  PRIMARY KEY ("courseId", "locale"),
  CONSTRAINT "CourseTranslation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Module" (
  "id" TEXT NOT NULL PRIMARY KEY, "courseId" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "ModuleTranslation" (
  "moduleId" TEXT NOT NULL, "locale" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL DEFAULT '',
  PRIMARY KEY ("moduleId", "locale"),
  CONSTRAINT "ModuleTranslation_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Lesson" (
  "id" TEXT NOT NULL PRIMARY KEY, "moduleId" TEXT NOT NULL, "type" TEXT NOT NULL DEFAULT 'VOCABULARY', "order" INTEGER NOT NULL DEFAULT 0,
  "xpReward" INTEGER NOT NULL DEFAULT 20, "estimatedMinutes" INTEGER NOT NULL DEFAULT 5, "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "videoUrl" TEXT, "audioUrl" TEXT, "thumbnailUrl" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "LessonTranslation" (
  "lessonId" TEXT NOT NULL, "locale" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL DEFAULT '', "theory" TEXT NOT NULL DEFAULT '',
  PRIMARY KEY ("lessonId", "locale"),
  CONSTRAINT "LessonTranslation_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Exercise" (
  "id" TEXT NOT NULL PRIMARY KEY, "lessonId" TEXT NOT NULL, "type" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0,
  "xpReward" INTEGER NOT NULL DEFAULT 5, "payload" TEXT NOT NULL DEFAULT '{}', "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Exercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "ExerciseTranslation" (
  "exerciseId" TEXT NOT NULL, "locale" TEXT NOT NULL, "instruction" TEXT NOT NULL, "question" TEXT NOT NULL DEFAULT '', "explanation" TEXT NOT NULL DEFAULT '',
  PRIMARY KEY ("exerciseId", "locale"),
  CONSTRAINT "ExerciseTranslation_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "ExerciseOption" (
  "id" TEXT NOT NULL PRIMARY KEY, "exerciseId" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, "isCorrect" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "ExerciseOption_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "ExerciseOptionTranslation" (
  "optionId" TEXT NOT NULL, "locale" TEXT NOT NULL, "text" TEXT NOT NULL, PRIMARY KEY ("optionId", "locale"),
  CONSTRAINT "ExerciseOptionTranslation_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ExerciseOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "UserCourse" (
  "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "UserLessonProgress" (
  "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "lessonId" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "completedExercises" INTEGER NOT NULL DEFAULT 0, "correctAnswers" INTEGER NOT NULL DEFAULT 0, "attempts" INTEGER NOT NULL DEFAULT 0,
  "startedAt" DATETIME, "completedAt" DATETIME, "earnedXp" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "UserExerciseAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "exerciseId" TEXT NOT NULL, "lessonProgressId" TEXT NOT NULL,
  "submittedAnswer" TEXT NOT NULL, "isCorrect" BOOLEAN NOT NULL, "xpEarned" INTEGER NOT NULL DEFAULT 0, "attemptedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserExerciseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserExerciseAttempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserExerciseAttempt_lessonProgressId_fkey" FOREIGN KEY ("lessonProgressId") REFERENCES "UserLessonProgress" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE INDEX "Course_status_sourceLanguage_targetLanguage_idx" ON "Course"("status", "sourceLanguage", "targetLanguage");
CREATE INDEX "Course_order_idx" ON "Course"("order");
CREATE INDEX "CourseTranslation_locale_idx" ON "CourseTranslation"("locale");
CREATE INDEX "Module_courseId_status_idx" ON "Module"("courseId", "status");
CREATE UNIQUE INDEX "Module_courseId_order_key" ON "Module"("courseId", "order");
CREATE INDEX "ModuleTranslation_locale_idx" ON "ModuleTranslation"("locale");
CREATE INDEX "Lesson_moduleId_status_idx" ON "Lesson"("moduleId", "status");
CREATE INDEX "Lesson_updatedAt_idx" ON "Lesson"("updatedAt");
CREATE UNIQUE INDEX "Lesson_moduleId_order_key" ON "Lesson"("moduleId", "order");
CREATE INDEX "LessonTranslation_locale_idx" ON "LessonTranslation"("locale");
CREATE INDEX "Exercise_lessonId_status_idx" ON "Exercise"("lessonId", "status");
CREATE UNIQUE INDEX "Exercise_lessonId_order_key" ON "Exercise"("lessonId", "order");
CREATE INDEX "ExerciseTranslation_locale_idx" ON "ExerciseTranslation"("locale");
CREATE INDEX "ExerciseOption_exerciseId_idx" ON "ExerciseOption"("exerciseId");
CREATE UNIQUE INDEX "ExerciseOption_exerciseId_order_key" ON "ExerciseOption"("exerciseId", "order");
CREATE INDEX "ExerciseOptionTranslation_locale_idx" ON "ExerciseOptionTranslation"("locale");
CREATE INDEX "UserCourse_courseId_idx" ON "UserCourse"("courseId");
CREATE UNIQUE INDEX "UserCourse_userId_courseId_key" ON "UserCourse"("userId", "courseId");
CREATE INDEX "UserLessonProgress_userId_status_idx" ON "UserLessonProgress"("userId", "status");
CREATE INDEX "UserLessonProgress_lessonId_idx" ON "UserLessonProgress"("lessonId");
CREATE UNIQUE INDEX "UserLessonProgress_userId_lessonId_key" ON "UserLessonProgress"("userId", "lessonId");
CREATE INDEX "UserExerciseAttempt_userId_exerciseId_idx" ON "UserExerciseAttempt"("userId", "exerciseId");
CREATE INDEX "UserExerciseAttempt_lessonProgressId_idx" ON "UserExerciseAttempt"("lessonProgressId");
