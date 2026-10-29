/*
  Warnings:

  - You are about to drop the column `published_at` on the `ExecutionOutbox` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExecutionOutbox" DROP COLUMN "published_at";
