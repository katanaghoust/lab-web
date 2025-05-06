import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Redirect,
  Patch,
  Delete,
} from '@nestjs/common';
import { SpecService } from './spec.service';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { Request } from 'express';

@Controller('specs')
export class SpecController {
  constructor(private readonly specService: SpecService) {}

  @Get()
  @Render('spec/index')
  async findAll() {
    const specs = await this.specService.findAllWithCars();
    return { specs };
  }

  @Get('create')
  @Render('spec/create')
  createForm() {
    return {};
  }

  @Post()
  @Redirect('/specs')
  async create(@Body() createSpecDto: CreateSpecDto) {
    await this.specService.create(createSpecDto);
  }

  @Get(':id')
  @Render('spec/show')
  async findOne(@Param('id') id: string) {
    const spec = await this.specService.findOne(+id);
    return { spec };
  }

  @Get(':id/edit')
  @Render('spec/edit')
  async editForm(@Param('id') id: string) {
    const spec = await this.specService.findOne(+id);
    return { spec };
  }

  @Patch(':id')
  @Redirect('/specs')
  async update(@Param('id') id: string, @Body() updateSpecDto: UpdateSpecDto) {
    await this.specService.update(+id, updateSpecDto);
  }

  @Delete(':id')
  @Redirect('/specs')
  async remove(@Param('id') id: string) {
    await this.specService.remove(+id);
  }
}
