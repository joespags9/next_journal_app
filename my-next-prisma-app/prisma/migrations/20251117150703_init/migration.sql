-- CreateTable
CREATE TABLE "journals" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "author" VARCHAR(255),
    "date" DATE DEFAULT CURRENT_DATE,
    "caption" VARCHAR(255),
    "image" TEXT,
    "text" TEXT,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);
