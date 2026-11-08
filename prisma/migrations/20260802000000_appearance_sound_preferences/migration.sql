ALTER TABLE "UserPreference" ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'system';
ALTER TABLE "UserPreference" ADD COLUMN "soundEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "UserPreference" ADD COLUMN "soundVolume" REAL NOT NULL DEFAULT 0.7;
ALTER TABLE "UserPreference" ADD COLUMN "effectsEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "UserPreference" ADD COLUMN "lessonSoundsEnabled" BOOLEAN NOT NULL DEFAULT true;
