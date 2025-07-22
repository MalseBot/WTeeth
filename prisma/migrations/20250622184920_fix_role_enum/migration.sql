-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "gender" SET DEFAULT 'Male';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
