-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('PENDING', 'ACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'PENDING';
