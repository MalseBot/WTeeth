/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientName` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropIndex
DROP INDEX "Appointment_patientId_idx";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "patientName" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_patientId_patientName_idx" ON "Appointment"("patientId", "patientName");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_name_key" ON "Patient"("id", "name");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_patientName_fkey" FOREIGN KEY ("patientId", "patientName") REFERENCES "Patient"("id", "name") ON DELETE CASCADE ON UPDATE CASCADE;
