import { IsNumber, IsNumberString, IsString, IsUrl } from 'class-validator';

export class ProductDto {
  @IsString()
  title: string;

  @IsNumberString()
  price: string;

  @IsUrl({}, { each: true })
  images: string[];

  @IsNumber()
  itemsInStock: number;
}
