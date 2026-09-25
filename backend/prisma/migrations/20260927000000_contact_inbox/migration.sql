CREATE TYPE "MessageStatus" AS ENUM ('UNREAD','READ');
CREATE TABLE "Message" ("id" UUID NOT NULL,"name" TEXT NOT NULL,"email" TEXT NOT NULL,"subject" TEXT NOT NULL,"message" TEXT NOT NULL,"status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Message_pkey" PRIMARY KEY ("id"));
CREATE INDEX "Message_status_createdAt_idx" ON "Message"("status","createdAt");
