import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './product.schema';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
  ) {}

  list(): Promise<Product[]> {
    return this.model.find().exec();
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
