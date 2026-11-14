/*
  Warnings:

  - You are about to drop the column `image_url` on the `AvailableAction` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `AvailableTrigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AvailableAction" DROP COLUMN "image_url";

-- AlterTable
ALTER TABLE "AvailableTrigger" DROP COLUMN "image_url";
