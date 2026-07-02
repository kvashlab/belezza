-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "teamMemberId" TEXT;

-- AlterTable
ALTER TABLE "WorkingHour" ADD COLUMN     "teamMemberId" TEXT;

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkingHour" ADD CONSTRAINT "WorkingHour_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
