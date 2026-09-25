ALTER TABLE "User" ADD COLUMN "resetTokenHash" TEXT, ADD COLUMN "resetExpiresAt" TIMESTAMP(3), ADD COLUMN "resetRequestedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "User_resetTokenHash_key" ON "User"("resetTokenHash");
