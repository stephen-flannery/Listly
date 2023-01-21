-- CreateTable
CREATE TABLE "page" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "author" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "author" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "author" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form" ADD CONSTRAINT "form_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
