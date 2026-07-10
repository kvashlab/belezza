import { PrismaClient } from '@prisma/client';
import { VALID_CATEGORIES } from '../constants/categories';

const prisma = new PrismaClient();

async function run() {
  console.log('Iniciando migração de categorias...');

  // 1. Migrating ProfessionalProfile categories
  const profiles = await prisma.professionalProfile.findMany();
  let profilesUpdated = 0;

  for (const p of profiles) {
    if (!p.categories) continue;
    let cats: string[] = [];
    try {
      cats = JSON.parse(p.categories);
    } catch {
      cats = p.categories.split(',').map(c => c.trim());
    }

    const mappedCats = cats.map(c => {
      const match = VALID_CATEGORIES.find(vc => vc.toLowerCase() === c.toLowerCase());
      if (match) return match;
      if (c.toLowerCase().includes('cabel')) return 'Cabelo';
      if (c.toLowerCase().includes('unha') || c.toLowerCase().includes('manicure')) return 'Unhas';
      if (c.toLowerCase().includes('makeup') || c.toLowerCase().includes('maqui')) return 'Maquiagem';
      if (c.toLowerCase().includes('estética') || c.toLowerCase().includes('estetica')) return 'Estética Facial';
      if (c.toLowerCase().includes('barba')) return 'Barba';
      if (c.toLowerCase().includes('sobrancelha')) return 'Sobrancelhas';
      if (c.toLowerCase().includes('cilio') || c.toLowerCase().includes('cílio')) return 'Cílios';
      return 'Outros';
    });

    const uniqueCats = Array.from(new Set(mappedCats));
    
    // Convert back to string
    const newCategoriesStr = uniqueCats.join(',');

    if (newCategoriesStr !== p.categories) {
      await prisma.professionalProfile.update({
        where: { id: p.id },
        data: { categories: newCategoriesStr }
      });
      profilesUpdated++;
    }
  }

  // 2. Migrating Services category
  const services = await prisma.service.findMany();
  let servicesUpdated = 0;

  for (const s of services) {
    if (!s.category) continue;
    
    const match = VALID_CATEGORIES.find(vc => vc.toLowerCase() === s.category.toLowerCase());
    let newCat = match;
    
    if (!newCat) {
      const c = s.category;
      if (c.toLowerCase().includes('cabel')) newCat = 'Cabelo';
      else if (c.toLowerCase().includes('unha') || c.toLowerCase().includes('manicure')) newCat = 'Unhas';
      else if (c.toLowerCase().includes('makeup') || c.toLowerCase().includes('maqui')) newCat = 'Maquiagem';
      else if (c.toLowerCase().includes('estética') || c.toLowerCase().includes('estetica')) newCat = 'Estética Facial';
      else if (c.toLowerCase().includes('barba')) newCat = 'Barba';
      else if (c.toLowerCase().includes('sobrancelha')) newCat = 'Sobrancelhas';
      else if (c.toLowerCase().includes('cilio') || c.toLowerCase().includes('cílio')) newCat = 'Cílios';
      else newCat = 'Outros';
    }

    if (newCat !== s.category) {
      await prisma.service.update({
        where: { id: s.id },
        data: { category: newCat }
      });
      servicesUpdated++;
    }
  }

  console.log(`Migração concluída!`);
  console.log(`- Perfis atualizados: ${profilesUpdated}`);
  console.log(`- Serviços atualizados: ${servicesUpdated}`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
