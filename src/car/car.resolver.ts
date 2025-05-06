import {
  Resolver,
  Query,
  Args,
  Int,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Car } from './car.model';
import { CarService } from './car.service';
import { Spec } from 'src/spec/entities/spec.entity';
import { SpecService } from 'src/spec/spec.service';
import { CreateCarInput } from './dto/create-car.input';
import { PaginatedCars } from './dto/paginated-cars.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarModelInput } from './dto/update-car-model.input';
import { UpdateCarPriceInput } from './dto/update-car-price.input';
import { UpdateCarImageInput } from './dto/update-car-image.input';

@Resolver(() => Car)
export class CarResolver {
  constructor(
    private readonly carService: CarService,
    private readonly specService: SpecService,
  ) {}

  @Query(() => PaginatedCars)
  async findAllCars(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedCars> {
    const cars = await this.carService.findAllPaginated(page, limit);
    const total = await this.carService.count();
    return new PaginatedCars(cars, total, page, limit);
  }

  @Query(() => Car)
  async findCar(@Args('id', { type: () => Int }) id: number): Promise<Car> {
    const car = await this.carService.findOne(id);
    if (!car) {
      throw new Error(`Car with id ${id} not found`);
    }
    return car;
  }

  @ResolveField(() => Spec, { nullable: true })
  async specs(@Parent() car: any): Promise<Spec | null> {
    if (!car.specs) return null;

    // Возвращаем объект, соответствующий структуре Spec
    return {
      id: car.specs.id,
      carId: car.specs.carId,
      engine: car.specs.engine,
      power: car.specs.power,
      drive: car.specs.drive,
    };
  }

  @Mutation(() => Car)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCar(@Args('input') input: CreateCarInput): Promise<Car> {
    console.log('Received input:', input);

    // Преобразуем в CreateCarDto
    const dto: CreateCarDto = {
      model: input.model,
      price: input.price ?? '', // Устанавливаем пустую строку, если undefined
      image: input.image ?? '',
    };

    console.log('Transformed DTO:', dto);

    return this.carService.create(dto);
  }

  @Mutation(() => Car)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateCarModel(
    @Args('input') input: UpdateCarModelInput,
  ): Promise<Car> {
    console.log('Received input in resolver:', input); // Логируем входные данные
    return this.carService.update(input.id, { model: input.model });
  }

  @Mutation(() => Car)
  async updateCarPrice(
    @Args('input', { type: () => UpdateCarPriceInput })
    input: UpdateCarPriceInput,
  ): Promise<Car> {
    console.log('Received input in resolver:', input);
    return this.carService.update(input.id, { price: input.price });
  }

  @Mutation(() => Car)
  async updateCarImage(
    @Args('input', { type: () => UpdateCarImageInput })
    input: UpdateCarImageInput,
  ): Promise<Car> {
    console.log('Received input in resolver:', input);
    const id: number = Number(input.id);
    return this.carService.update(id, { image: input.image });
  }

  @Mutation(() => Car)
  async deleteCar(@Args('id', { type: () => Int }) id: number): Promise<Car> {
    return this.carService.remove(id);
  }
}
