import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';

@Injectable()
export class SpecService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateSpecDto) {
    return this.prisma.spec.create({ data });
  }

  findAll() {
    return this.prisma.spec.findMany({
      include: { car: true },
    });
  }

  findOne(id: number) {
    return this.prisma.spec.findUnique({
      where: { id },
      include: { car: true },
    });
  }

  update(id: number, updateSpecDto: UpdateSpecDto) {
    return this.prisma.spec.update({
      where: { id },
      data: updateSpecDto,
    });
  }

  remove(id: number) {
    return this.prisma.spec.delete({
      where: { id },
    });
  }
  async findAllWithCars() {
    return this.prisma.spec.findMany({
      include: {
        car: true,
      },
    });
  }
  findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return this.prisma.spec.findMany({
      skip,
      take: limit,
      include: { car: true },
      orderBy: { id: 'desc' },
    });
  }
}
