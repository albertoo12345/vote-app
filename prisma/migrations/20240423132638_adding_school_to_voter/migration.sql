-- DropForeignKey
ALTER TABLE `Voter` DROP FOREIGN KEY `Voter_leaderId_fkey`;

-- AlterTable
ALTER TABLE `Voter` MODIFY `leaderId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Voter` ADD CONSTRAINT `Voter_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `Leader`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
