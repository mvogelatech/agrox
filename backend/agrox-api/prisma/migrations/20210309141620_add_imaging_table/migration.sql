-- CreateTable
CREATE TABLE "imaging" (
    "id" SERIAL NOT NULL,
    "directory" TEXT NOT NULL,
    "processing_timestamp" TIMESTAMP(3) NOT NULL,
    "imaging_date" DATE NOT NULL,
    "farm_id" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imaging" ADD FOREIGN KEY ("farm_id") REFERENCES "farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
