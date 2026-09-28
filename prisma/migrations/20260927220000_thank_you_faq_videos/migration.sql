-- AlterTable
ALTER TABLE "SiteContent" ADD COLUMN IF NOT EXISTS "thankYouFaqVideos" JSONB NOT NULL DEFAULT '[]';
