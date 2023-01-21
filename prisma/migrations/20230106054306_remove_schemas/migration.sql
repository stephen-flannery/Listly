/*
  Warnings:

  - You are about to drop the column `bio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "bio",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
ALTER COLUMN "id" DROP DEFAULT;

-- DropTable
DROP TABLE "User";
