CREATE TYPE "BlogStatus" AS ENUM ('DRAFT','PUBLISHED');
CREATE TABLE "Blog" ("id" UUID NOT NULL,"title" TEXT NOT NULL,"slug" TEXT NOT NULL,"excerpt" TEXT NOT NULL,"content" TEXT NOT NULL,"coverImage" TEXT NOT NULL DEFAULT '',"category" TEXT NOT NULL,"tags" TEXT[] NOT NULL,"status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',"publishedAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Blog_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");
CREATE INDEX "Blog_status_publishedAt_idx" ON "Blog"("status","publishedAt");
