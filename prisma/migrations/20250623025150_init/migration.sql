/*
  Warnings:

  - You are about to drop the `realtime_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "realtime_data" DROP CONSTRAINT "realtime_data_destination_id_fkey";

-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "iata_code" TEXT;

-- DropTable
DROP TABLE "realtime_data";

-- CreateTable
CREATE TABLE "historical_weather" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "avg_temp" DOUBLE PRECISION,
    "summary" TEXT,
    "icon" TEXT,
    "last_scraped_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historical_weather_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "historical_weather_destination_id_month_key" ON "historical_weather"("destination_id", "month");

-- AddForeignKey
ALTER TABLE "historical_weather" ADD CONSTRAINT "historical_weather_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
