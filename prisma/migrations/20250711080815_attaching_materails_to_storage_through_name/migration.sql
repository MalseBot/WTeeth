/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Storage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Storage_name_key" ON "Storage"("name");

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_name_fkey" FOREIGN KEY ("name") REFERENCES "Storage"("name") ON DELETE CASCADE ON UPDATE CASCADE;
