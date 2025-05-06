import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCarModelInput {
  @Field(() => Int, { description: 'Уникальный идентификатор автомобиля' })
  @IsInt()
  @IsNotEmpty({ message: 'ID автомобиля обязателен' })
  id: number;

  @Field(() => String, { description: 'Новая модель автомобиля' })
  @IsString()
  @IsNotEmpty({ message: 'Модель автомобиля не может быть пустой' })
  model: string;
}
