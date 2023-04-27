import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CartProductDto {
  @IsUUID('4')
  @IsOptional()
  cartId?: string;

  @IsString()
  id: string;

  @IsNumber()
  quantity: number;
}
