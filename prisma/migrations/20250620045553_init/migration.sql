/*
  Warnings:

  - You are about to drop the column `fixed_scores` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lodging_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `realtime_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "lodging_options" DROP CONSTRAINT "lodging_options_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "realtime_data" DROP CONSTRAINT "realtime_data_destination_id_fkey";

-- AlterTable
ALTER TABLE "destinations" DROP COLUMN "fixed_scores",
ADD COLUMN     "accommodations" TEXT[],
ADD COLUMN     "activities" TEXT[],
ADD COLUMN     "expenses" JSONB,
ADD COLUMN     "flight" JSONB,
ADD COLUMN     "recommendation" TEXT,
ADD COLUMN     "scores" JSONB,
ADD COLUMN     "weather" JSONB;

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "lodging_options";

-- DropTable
DROP TABLE "realtime_data";
