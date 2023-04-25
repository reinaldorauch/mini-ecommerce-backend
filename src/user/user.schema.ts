import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  Admin = 'admin',
  Customer = 'customer',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, index: 'hashed', unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: UserRole.Customer, enum: UserRole })
  role: UserRole;
}

export function checkPassword(
  passwordHash: string,
  plain: string,
): Promise<boolean> {
  return argon2.verify(passwordHash, plain);
}

export function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, { salt: randomBytes(32) });
}

export const UserSchema = SchemaFactory.createForClass(User);
