import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number, get: getPrice, set: setPrice })
  price: number; // stored as cents

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  itemsInStock: number;
}

function getPrice(num: number) {
  return (num / 100).toFixed(2);
}

function setPrice(num: number) {
  return num * 100;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
