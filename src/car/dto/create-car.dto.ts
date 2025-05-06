import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota Camry', description: 'Модель автомобиля' })
  @IsString()
  @IsNotEmpty({ message: 'Модель автомобиля не может быть пустой' })
  model: string;

  @ApiProperty({ example: '25000', description: 'Цена автомобиля в USD' })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({
    example: 'https://example.com/car.jpg',
    description: 'Ссылка на изображение автомобиля',
  })
  @IsString()
  @IsOptional()
  image?: string;
}
