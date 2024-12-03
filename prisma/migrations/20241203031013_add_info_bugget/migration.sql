-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "budgetValidityDays" INTEGER,
ADD COLUMN     "deliveryTimeDays" INTEGER,
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "paymentMethod" TEXT;
