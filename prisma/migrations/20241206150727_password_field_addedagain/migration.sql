/*
  Warnings:

  - Added the required column `password` to the `alumno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alumno` ADD COLUMN `password` VARCHAR(191) NOT NULL;
