/*
  Warnings:

  - You are about to alter the column `numeroEmpleado` on the `profesor` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `profesor` MODIFY `numeroEmpleado` INTEGER NOT NULL;
