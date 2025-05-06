import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // Импортируем CACHE_MANAGER
import { Cache } from 'cache-manager'; // Импортируем тип Cache

@Injectable()
export class CarService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Инжектируем CACHE_MANAGER
  ) {}

  async create(data: CreateCarDto): Promise<Car> {
    if (!data.model) {
      throw new Error('Model is required to create a car');
    }

    try {
      return await this.prisma.car.create({
        data: {
          model: data.model,
          price: data.price ?? '',
          image: data.image ?? '',
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create car: ${errorMessage}`);
    }
  }

  async findAll(): Promise<Car[]> {
    try {
      return await this.prisma.car.findMany();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch cars: ${errorMessage}`);
    }
  }

  async findOne(id: number): Promise<Car | null> {
    try {
      return await this.prisma.car.findUnique({ where: { id } });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch car with id ${id}: ${errorMessage}`);
    }
  }

  async update(id: number, data: UpdateCarDto): Promise<Car> {
    console.log('Received id and data in service:', { id, data });
    try {
      return await this.prisma.car.update({
        where: { id },
        data,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to update car: ${errorMessage}`);
    }
  }

  async remove(id: number): Promise<Car> {
    try {
      return await this.prisma.car.delete({ where: { id } });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to delete car with id ${id}: ${errorMessage}`);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.car.count();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to count cars: ${errorMessage}`);
    }
  }

  async findAllPaginated(page: number, limit: number): Promise<Car[]> {
    try {
      // Формируем ключ для кэша на основе page и limit
      const cacheKey = `cars_paginated_${page}_${limit}`;

      // Проверяем, есть ли данные в кэше
      const cachedCars = await this.cacheManager.get<Car[]>(cacheKey);
      if (cachedCars) {
        console.log(`Returning cached cars for key ${cacheKey}`);
        return cachedCars;
      }

      // Если данных нет в кэше, запрашиваем из базы
      const skip = (page - 1) * limit;
      const cars = await this.prisma.car.findMany({
        skip,
        take: limit,
        include: {
          specs: true,
        },
      });
      console.log('Fetched cars with specs from Prisma:', cars);

      // Сохраняем данные в кэш с TTL 5 секунд
      await this.cacheManager.set(cacheKey, cars, 5 * 1000); // TTL в миллисекундах

      return cars;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch paginated cars: ${errorMessage}`);
    }
  }
}
