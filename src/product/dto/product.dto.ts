import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

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
