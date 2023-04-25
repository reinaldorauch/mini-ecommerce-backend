import { IsNumber, IsString } from 'class-validator';

export class CartProductDto {
  @IsString()
  id: string;

  @IsNumber()
  quantity: number;
}
