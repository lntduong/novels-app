-- DropIndex
DROP INDEX "chapters_storyId_order_idx";

-- CreateTable
CREATE TABLE "ChapterRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT,
    "anonymousName" TEXT,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "anonymousName" TEXT,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChapterRating_chapterId_idx" ON "ChapterRating"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterRating_userId_chapterId_key" ON "ChapterRating"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "ChapterComment_chapterId_idx" ON "ChapterComment"("chapterId");

-- CreateIndex
CREATE INDEX "ChapterComment_userId_idx" ON "ChapterComment"("userId");

-- CreateIndex
CREATE INDEX "chapters_storyId_idx" ON "chapters"("storyId");

-- CreateIndex
CREATE INDEX "chapters_slug_idx" ON "chapters"("slug");

-- AddForeignKey
ALTER TABLE "ChapterRating" ADD CONSTRAINT "ChapterRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterRating" ADD CONSTRAINT "ChapterRating_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterComment" ADD CONSTRAINT "ChapterComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterComment" ADD CONSTRAINT "ChapterComment_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
