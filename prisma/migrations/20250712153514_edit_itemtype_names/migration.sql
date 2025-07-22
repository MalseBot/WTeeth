/*
  Warnings:

  - The values [kg,ml] on the enum `ItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemType_new" AS ENUM ('Unit', 'Gram', 'Milliliter');
ALTER TABLE "Materials" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Storage" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Materials" ALTER COLUMN "type" TYPE "ItemType_new" USING ("type"::text::"ItemType_new");
ALTER TABLE "Storage" ALTER COLUMN "type" TYPE "ItemType_new" USING ("type"::text::"ItemType_new");
ALTER TYPE "ItemType" RENAME TO "ItemType_old";
ALTER TYPE "ItemType_new" RENAME TO "ItemType";
DROP TYPE "ItemType_old";
ALTER TABLE "Materials" ALTER COLUMN "type" SET DEFAULT 'Unit';
ALTER TABLE "Storage" ALTER COLUMN "type" SET DEFAULT 'Unit';
COMMIT;
