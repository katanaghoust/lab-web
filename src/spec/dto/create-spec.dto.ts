import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpecDto {
  @IsInt()
  @Type(() => Number)
  carId: number;

  @IsString()
  engine: string;

  @IsString()
  power: string;

  @IsString()
  drive: string;
}
