import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  Redirect,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Response } from 'express'; // Импортируем тип Response

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @Render('car/index')
  async findAll(@Query('message') message: string, @Res() res: Response) {
    const cars = await this.carService.findAll();
    const elapsedTime = res.locals.elapsedTime || 0; // Берем время из res.locals
    return { cars, message, elapsedTime }; // Явно передаём elapsedTime в шаблон
  }

  @Get('add')
  @Render('car/create')
  getCreateForm() {
    return {};
  }

  @Post()
  @Redirect('/cars?message=Автомобиль успешно добавлен!')
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get(':id/edit')
  @Render('car/edit')
  async getEditForm(@Param('id') id: string) {
    const car = await this.carService.findOne(+id);
    return { car };
  }

  @Patch(':id')
  @Redirect('/cars?message=Автомобиль успешно обновлен!')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.update(+id, updateCarDto);
  }

  @Delete(':id')
  @Redirect('/cars?message=Автомобиль успешно удален!')
  remove(@Param('id') id: string) {
    return this.carService.remove(+id);
  }
}
