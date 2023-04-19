import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly svc: ProductService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Post()
  async create(@Body() dto: ProductDto) {
    await this.svc.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.svc.update(id, dto);
  }
}
