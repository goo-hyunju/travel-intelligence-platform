-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "summary" TEXT,
    "flight_time" TEXT,
    "fixed_scores" JSONB,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realtime_data" (
    "id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "current_flight_cost" INTEGER,
    "current_lodging_cost" INTEGER,
    "current_total_expenses" INTEGER,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "realtime_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lodging_options" (
    "id" SERIAL NOT NULL,
    "destination_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_range" TEXT,
    "rating" DOUBLE PRECISION,
    "image_url" TEXT,

    CONSTRAINT "lodging_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "destination_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "realtime_data_destination_id_key" ON "realtime_data"("destination_id");

-- AddForeignKey
ALTER TABLE "realtime_data" ADD CONSTRAINT "realtime_data_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lodging_options" ADD CONSTRAINT "lodging_options_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
