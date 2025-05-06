import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCarPriceInput {
  @Field(() => Int, { description: 'Уникальный идентификатор автомобиля' })
  @IsInt()
  @IsNotEmpty({ message: 'ID автомобиля обязателен' })
  id: number;

  @Field(() => String, { description: 'Новая цена автомобиля' })
  @IsString()
  @IsNotEmpty({ message: 'Цена автомобиля не может быть пустой' })
  price: string;
}
