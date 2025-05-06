import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCarInput {
  @Field(() => String, { description: 'Модель автомобиля', nullable: false })
  @IsString()
  @IsNotEmpty({ message: 'Модель автомобиля не может быть пустой' })
  model: string;

  @Field(() => String, { description: 'Цена автомобиля в USD', nullable: true })
  @IsString()
  price?: string;

  @Field(() => String, {
    description: 'Ссылка на изображение автомобиля',
    nullable: true,
  })
  @IsString()
  image?: string;
}
