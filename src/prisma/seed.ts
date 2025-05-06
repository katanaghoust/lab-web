import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Очищаем таблицы (опционально)
  await prisma.spec.deleteMany();
  await prisma.car.deleteMany();

  // Создаём автомобили
  const cars = await Promise.all([
    prisma.car.create({ data: { model: 'M4345', price: '2', image: '1' } }),
    prisma.car.create({ data: { model: '23', price: '124343', image: '123' } }),
    prisma.car.create({ data: { model: 'M4345', price: '1', image: '1' } }),
    prisma.car.create({ data: { model: 'M4345', price: '1', image: '1' } }),
    prisma.car.create({ data: { model: 'M43', price: '1', image: '1' } }),
    prisma.car.create({
      data: {
        model: 'New Car',
        price: '30000',
        image: 'http://example.com/newcar.jpg',
      },
    }),
    prisma.car.create({
      data: {
        model: 'New Carrr',
        price: '30000',
        image: 'http://example.com/newcar.jpg',
      },
    }),
    prisma.car.create({
      data: {
        model: 'New Car',
        price: '30000',
        image: 'http://example.com/newcar.jpg',
      },
    }),
    prisma.car.create({
      data: {
        model: 'New Car',
        price: '30000',
        image: 'http://example.com/newcar.jpg',
      },
    }),
    prisma.car.create({
      data: {
        model: 'Toyota Camry',
        price: '25000',
        image: 'http://example.com/toyota.jpg',
      },
    }),
    prisma.car.create({
      data: {
        model: 'Honda Civic',
        price: '22000',
        image: 'http://example.com/honda.jpg',
      },
    }),
    prisma.car.create({ data: { model: '23', price: '124343', image: '123' } }),
  ]);

  // Создаём характеристики для всех автомобилей
  await Promise.all(
    cars.map((car) =>
      prisma.spec.create({
        data: {
          carId: car.id,
          engine: `Engine-${car.id}`,
          power: `${car.id * 100}hp`,
          drive: car.id % 2 === 0 ? 'AWD' : 'FWD',
        },
      }),
    ),
  );

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
