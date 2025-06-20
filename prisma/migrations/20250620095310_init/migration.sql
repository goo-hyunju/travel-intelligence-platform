-- CreateTable
CREATE TABLE "realtime_data" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "current_flight_price" INTEGER,
    "current_flight_time" TEXT,
    "last_scraped_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "realtime_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "realtime_data_destination_id_key" ON "realtime_data"("destination_id");

-- AddForeignKey
ALTER TABLE "realtime_data" ADD CONSTRAINT "realtime_data_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
