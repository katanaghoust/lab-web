import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Car } from '../car.model';

@ObjectType()
export class PaginatedCars {
  @Field(() => [Car], { description: 'Список автомобилей' })
  data: Car[];

  @Field(() => Int, { description: 'Общее количество автомобилей' })
  total: number;

  @Field(() => Int, { description: 'Текущая страница' })
  page: number;

  @Field(() => Int, { description: 'Лимит записей на страницу' })
  limit: number;

  constructor(data: Car[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
