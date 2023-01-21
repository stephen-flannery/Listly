/*
  Warnings:

  - You are about to drop the column `projectId` on the `form` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `page` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `page` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `user` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "form" DROP CONSTRAINT "form_projectId_fkey";

-- DropForeignKey
ALTER TABLE "page" DROP CONSTRAINT "page_projectId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_projectId_fkey";

-- AlterTable
ALTER TABLE "form" DROP COLUMN "projectId",
ADD COLUMN     "project_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "page" DROP COLUMN "author",
DROP COLUMN "projectId",
ADD COLUMN     "author_id" UUID NOT NULL,
ADD COLUMN     "project_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "projectId",
ADD COLUMN     "project_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
