/*
  Warnings:

  - Added the required column `desk` to the `Voter` table without a default value. This is not possible if the table is not empty.
  - Made the column `leaderId` on table `Voter` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Voter` DROP FOREIGN KEY `Voter_leaderId_fkey`;

-- AlterTable
ALTER TABLE `Voter` ADD COLUMN `desk` VARCHAR(191) NOT NULL,
    ADD COLUMN `voted` BOOLEAN NULL,
    MODIFY `leaderId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Voter` ADD CONSTRAINT `Voter_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `Leader`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
