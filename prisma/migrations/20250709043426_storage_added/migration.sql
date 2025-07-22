/*
  Warnings:

  - You are about to drop the column `materials` on the `Appointment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Unit', 'kg', 'ml');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "materials";

-- CreateTable
CREATE TABLE "Materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItemType" NOT NULL DEFAULT 'Unit',
    "quantity" INTEGER NOT NULL,
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ItemType" NOT NULL DEFAULT 'Unit',
    "quantity" INTEGER NOT NULL,
    "buyDate" TIMESTAMP(3) NOT NULL,
    "shortageLimit" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "seller" TEXT NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
