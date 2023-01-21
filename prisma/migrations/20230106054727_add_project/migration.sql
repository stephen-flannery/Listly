/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "owner" UUID NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);
