import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CarApiController } from './car-api.controller';
import { CarResolver } from './car.resolver';
import { SpecService } from '../spec/spec.service';
import { SpecModule } from '../spec/spec.module';
@Module({
  imports: [PrismaModule, SpecModule],
  controllers: [CarController, CarApiController],
  providers: [CarService, CarResolver, SpecService],
})
export class CarModule {}
