/*
  Warnings:

  - The values [PROCESSING] on the enum `ExecutionSTATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExecutionSTATUS_new" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');
ALTER TABLE "public"."Execution" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Execution" ALTER COLUMN "status" TYPE "ExecutionSTATUS_new" USING ("status"::text::"ExecutionSTATUS_new");
ALTER TYPE "ExecutionSTATUS" RENAME TO "ExecutionSTATUS_old";
ALTER TYPE "ExecutionSTATUS_new" RENAME TO "ExecutionSTATUS";
DROP TYPE "public"."ExecutionSTATUS_old";
ALTER TABLE "Execution" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
