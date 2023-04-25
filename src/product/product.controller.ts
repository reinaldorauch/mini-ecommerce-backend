import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ProductListParamsDto } from './dto/product-list-params.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly svc: ProductService) {}

  @Get()
  list(@Query() query: ProductListParamsDto) {
    return this.svc.list(query);
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
