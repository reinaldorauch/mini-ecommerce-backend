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

  @Prop({
    required: true,
    set: hashPassword,
    get: protectedProp('passwordHash'),
  })
  passwordHash: string;

  @Prop({ default: UserRole.Customer, enum: UserRole })
  role: UserRole;

  checkPassword(plain: string): Promise<boolean> {
    return argon2.verify(this.passwordHash, plain);
  }
}

function hashPassword(plain: string) {
  argon2.hash(plain, { salt: randomBytes(32) });
}

function protectedProp(prop: string) {
  return () => {
    throw new Error('getting ' + prop + ' hash not permitted');
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
