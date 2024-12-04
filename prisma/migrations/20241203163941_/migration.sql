/*
  Warnings:

  - The values [Monthly,Yearly] on the enum `Interval` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Interval_new" AS ENUM ('Mensal', 'Anual');
ALTER TABLE "Plan" ALTER COLUMN "interval" TYPE "Interval_new" USING ("interval"::text::"Interval_new");
ALTER TYPE "Interval" RENAME TO "Interval_old";
ALTER TYPE "Interval_new" RENAME TO "Interval";
DROP TYPE "Interval_old";
COMMIT;
