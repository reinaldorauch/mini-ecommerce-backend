import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ProductListParamsDto } from './dto/product-list-params.dto';
import { TokenGuard } from '../auth/token.guard';
import { IsAdminGuard } from '../auth/is-admin.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly svc: ProductService) {}

  @Get()
  list(@Query() query: ProductListParamsDto) {
    return this.svc.list(query);
  }

  @UseGuards(TokenGuard, IsAdminGuard)
  @Get('summary')
  summary() {
    return this.svc.summary();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @UseGuards(TokenGuard, IsAdminGuard)
  @Post()
  async create(@Body() dto: ProductDto) {
    await this.svc.create(dto);
  }

  @UseGuards(TokenGuard, IsAdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(TokenGuard, IsAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.svc.delete(id);
  }
}
