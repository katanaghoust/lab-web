import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Spec } from 'src/spec/entities/spec.entity';

@ObjectType()
export class Car {
  @Field(() => Int, { description: 'Уникальный идентификатор автомобиля' })
  id: number;

  @Field({ description: 'Модель автомобиля' })
  model: string;

  @Field({ description: 'Цена автомобиля в USD' })
  price: string;

  @Field({ description: 'Ссылка на изображение автомобиля' })
  image: string;

  @Field(() => Spec, {
    nullable: true,
    description: 'Характеристики автомобиля',
  })
  specs?: Spec;
}
