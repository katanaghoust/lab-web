import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Header,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cars')
@Controller('api/cars')
export class CarApiController {
  constructor(private readonly carService: CarService) {}

  @Post()
  async create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get()
  @Header('Cache-Control', 'max-age=3600')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() query: Record<string, string | undefined>,
  ) {
    const cars = await this.carService.findAllPaginated(+page, +limit);

    const totalCars = await this.carService.count();
    const totalPages = Math.ceil(totalCars / limit);

    const host: string = query.host || 'http://localhost:3000';
    const prevPage =
      page > 1 ? `${host}/api/cars?page=${page - 1}&limit=${limit}` : null;
    const nextPage =
      page < totalPages
        ? `${host}/api/cars?page=${page + 1}&limit=${limit}`
        : null;

    return {
      data: cars,
      links: {
        prev: prevPage,
        next: nextPage,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
