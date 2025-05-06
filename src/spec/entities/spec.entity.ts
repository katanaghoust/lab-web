import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Spec {
  @Field(() => Int, { description: 'Уникальный идентификатор характеристик' })
  id: number;

  @Field(() => Int, { description: 'ID связанного автомобиля' })
  carId: number;

  @Field({ description: 'Тип двигателя' })
  engine: string;

  @Field({ description: 'Мощность двигателя' })
  power: string;

  @Field({ description: 'Тип привода' })
  drive: string;
}
