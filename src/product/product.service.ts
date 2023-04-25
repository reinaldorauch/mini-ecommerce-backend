import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './product.schema';
import { ProductDto } from './dto/product.dto';
import { ProductListParamsDto } from './dto/product-list-params.dto';
import { PaginatedResult } from '../util/paginated-result';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
  ) {}

  async list({
    skip = 0,
    take = 10,
    search = null,
  }: ProductListParamsDto): Promise<PaginatedResult<Product>> {
    const searchOpt = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    return {
      total: await this.model.countDocuments(searchOpt),
      data: await this.model.find(searchOpt).limit(take).skip(skip).exec(),
    };
  }

  async create(dto: ProductDto): Promise<void> {
    await this.model.create(dto);
  }

  get(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException();
    const product = this.model.findById(id);
    if (!product) throw new NotFoundException();
    return product;
  }

  update(id: string, dto: ProductDto): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException();
    return this.model.findByIdAndUpdate(id, dto, { returnOriginal: false });
  }
}
