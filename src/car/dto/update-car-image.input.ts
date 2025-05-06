import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsString, IsNotEmpty, IsUrl } from 'class-validator';

@InputType()
export class UpdateCarImageInput {
  @Field(() => Int, { description: 'Уникальный идентификатор автомобиля' })
  @IsInt()
  @IsNotEmpty({ message: 'ID автомобиля обязателен' })
  id: number;

  @Field(() => String, { description: 'Новая ссылка на изображение' })
  @IsString()
  @IsNotEmpty({ message: 'Ссылка на изображение не может быть пустой' })
  @IsUrl(
    { require_protocol: true }, // Требовать протокол (http или https)
    { message: 'Неверный формат URL' },
  )
  image: string;
}
