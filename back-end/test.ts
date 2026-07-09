import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.professionalProfile.findMany();
  console.log('Profiles in DB:', profiles.map(p => ({ id: p.id, username: p.username })));
}
main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
