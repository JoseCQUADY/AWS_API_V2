/*
  Warnings:

  - Added the required column `fotoPerfilUrl` to the `alumno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alumno` ADD COLUMN `fotoPerfilUrl` VARCHAR(191) NOT NULL;
