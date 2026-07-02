const fs = require('fs');
const path = require('path');

const MOCKS_DIR = path.join(__dirname, 'src', 'mocks');
if (!fs.existsSync(MOCKS_DIR)) {
  fs.mkdirSync(MOCKS_DIR, { recursive: true });
}

// Helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = () => Math.random().toString(36).substring(2, 9);

const categories = ['manicure', 'pedicure', 'nail_designer', 'cabeleireira', 'maquiagem', 'sobrancelhas', 'lash_designer', 'micropigmentacao', 'esteticista', 'depilacao', 'podologa', 'massoterapia'];
const names = ['Ana', 'Beatriz', 'Camila', 'Daniela', 'Eduarda', 'Fernanda', 'Gabriela', 'Helena', 'Isabela', 'Juliana', 'Karina', 'Larissa', 'Mariana', 'Natalia', 'Olivia', 'Paula', 'Quintina', 'Rafaela', 'Sabrina', 'Tatiana', 'Ursula', 'Vitoria', 'Yasmin', 'Zelia'];
const lastnames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'];
const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];

// 1. Professionals
const professionals = [];
for (let i = 0; i < 20; i++) {
  const name = `${randomItem(names)} ${randomItem(lastnames)}`;
  const username = name.toLowerCase().replace(/ /g, '') + randomInt(1, 99);
  const catCount = randomInt(1, 3);
  const cats = [];
  for (let c = 0; c < catCount; c++) {
    const cat = randomItem(categories);
    if (!cats.includes(cat)) cats.push(cat);
  }
  
  professionals.push({
    id: `prof_${i+1}`,
    username,
    name,
    businessName: `${name} Beauty`,
    avatar: `https://i.pravatar.cc/150?u=${username}`,
    coverImage: `https://picsum.photos/seed/${username}/800/400`,
    bio: `Especialista em ${cats.join(' e ')}. Apaixonada por realçar a sua beleza natural.`,
    categories: cats,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
    reviewsCount: randomInt(10, 150),
    address: {
      city: randomItem(cities),
      state: 'SP',
      neighborhood: 'Centro',
      lat: -23.5505 + (Math.random() * 0.1 - 0.05),
      lng: -46.6333 + (Math.random() * 0.1 - 0.05),
    },
    serviceLocation: randomItem(['no_local', 'domicilio', 'ambos']),
    verified: Math.random() > 0.3,
    socialLinks: { instagram: `@${username}` },
    workingHours: [1, 2, 3, 4, 5, 6].map(day => ({
      dayOfWeek: day,
      startTime: '09:00',
      endTime: '19:00',
      isOpen: true,
    })),
    createdAt: new Date(Date.now() - randomInt(100, 1000) * 86400000).toISOString(),
  });
}

// 2. Services (60 services)
const services = [];
const serviceNames = {
  'manicure': ['Manicure Clássica', 'Esmaltação em Gel', 'Spa das Mãos'],
  'pedicure': ['Pedicure Clássica', 'Spa dos Pés', 'Plástica dos Pés'],
  'nail_designer': ['Alongamento em Fibra', 'Manutenção de Fibra', 'Banho de Gel'],
  'cabeleireira': ['Corte Feminino', 'Escova Modeladora', 'Luzes/Mechas', 'Cronograma Capilar'],
  'maquiagem': ['Maquiagem Social', 'Maquiagem para Noivas', 'Maquiagem Artística'],
  'sobrancelhas': ['Design de Sobrancelhas', 'Henna', 'Brow Lamination'],
  'lash_designer': ['Extensão Volume Russo', 'Extensão Fio a Fio', 'Lash Lifting'],
  'micropigmentacao': ['Microblading Fio a Fio', 'Micropigmentação Labial'],
  'esteticista': ['Limpeza de Pele', 'Peeling', 'Drenagem Linfática'],
  'depilacao': ['Depilação a Cera Completa', 'Depilação a Laser (Sessão)', 'Depilação Buço'],
  'podologa': ['Podologia Preventiva', 'Tratamento de Unha Encravada'],
  'massoterapia': ['Massagem Relaxante', 'Massagem Modeladora', 'Pedras Quentes']
};

professionals.forEach(prof => {
  prof.categories.forEach(cat => {
    if (serviceNames[cat]) {
      serviceNames[cat].forEach(sName => {
        services.push({
          id: `srv_${generateId()}`,
          professionalId: prof.id,
          name: sName,
          category: cat,
          description: `Serviço de ${sName} com produtos de alta qualidade.`,
          duration: randomInt(3, 12) * 10, // 30 to 120 mins
          price: randomInt(30, 300),
          images: [`https://picsum.photos/seed/${generateId()}/400/400`],
        });
      });
    }
  });
});

// 3. Clients (25 clients)
const clients = [];
for (let i = 0; i < 25; i++) {
  const name = `${randomItem(names)} Cliente`;
  clients.push({
    id: `cli_${i+1}`,
    name,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/ /g, '')}`,
    phone: `119${randomInt(10000000, 99999999)}`,
    email: `${name.toLowerCase().replace(/ /g, '')}@email.com`,
    totalBookings: randomInt(1, 20),
    lastVisit: new Date(Date.now() - randomInt(1, 30) * 86400000).toISOString(),
    tags: randomItem([['vip'], ['novo'], ['sensivel_atraso'], []]),
  });
}

// 4. Bookings (40 bookings)
const bookings = [];
const statuses = ['pendente', 'confirmado', 'concluido', 'cancelado', 'nao_compareceu'];
const payments = ['pix', 'cartao', 'dinheiro', 'pago_online'];
for (let i = 0; i < 40; i++) {
  const srv = randomItem(services);
  const client = randomItem(clients);
  bookings.push({
    id: `bkg_${i+1}`,
    professionalId: srv.professionalId,
    client: client,
    services: [srv],
    date: new Date(Date.now() + randomInt(-10, 10) * 86400000).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    status: randomItem(statuses),
    paymentMethod: randomItem(payments),
    totalPrice: srv.price,
    createdAt: new Date().toISOString(),
  });
}

// 5. Reviews (30 reviews)
const reviews = [];
for (let i = 0; i < 30; i++) {
  const srv = randomItem(services);
  const client = randomItem(clients);
  reviews.push({
    id: `rev_${i+1}`,
    professionalId: srv.professionalId,
    clientName: client.name,
    clientAvatar: client.avatar,
    rating: randomInt(3, 5),
    comment: 'Ótimo atendimento, profissional muito dedicada e cuidadosa! Recomendo muito.',
    serviceName: srv.name,
    createdAt: new Date(Date.now() - randomInt(1, 30) * 86400000).toISOString(),
    reply: Math.random() > 0.5 ? { content: 'Muito obrigada pela preferência! ❤️', createdAt: new Date().toISOString() } : undefined
  });
}

// 6. Portfolio (40 photos)
const portfolio = [];
for (let i = 0; i < 40; i++) {
  const prof = randomItem(professionals);
  const cat = randomItem(prof.categories);
  portfolio.push({
    id: `port_${i+1}`,
    professionalId: prof.id,
    url: `https://picsum.photos/seed/port${i}/600/800`,
    category: cat,
    description: `Trabalho lindo de ${cat}`,
    isBeforeAfter: Math.random() > 0.7,
  });
}

// Write files
const writeTs = (filename, varName, typeName, data) => {
  const content = `import { ${typeName} } from '../types/${filename.replace('.mock', '')}.types';\n\n` +
                  `export const ${varName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(path.join(MOCKS_DIR, `${filename}.ts`), content);
};

writeTs('professionals.mock', 'professionalsMock', 'Professional', professionals);
writeTs('services.mock', 'servicesMock', 'Service', services);
writeTs('clients.mock', 'clientsMock', 'Client', clients);
writeTs('bookings.mock', 'bookingsMock', 'Booking', bookings);
writeTs('reviews.mock', 'reviewsMock', 'Review', reviews);

// Extra portfolio mock file
const portfolioContent = `import { PortfolioPhoto } from '../types/professional.types';\n\n` +
                  `export const portfolioMock: PortfolioPhoto[] = ${JSON.stringify(portfolio, null, 2)};\n`;
fs.writeFileSync(path.join(MOCKS_DIR, 'portfolio.mock.ts'), portfolioContent);

console.log('Mocks generated successfully!');
