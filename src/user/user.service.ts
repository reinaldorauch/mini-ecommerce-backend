import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, hashPassword } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async create({ password, confirmPassword: _, ...dto }: CreateUserDto) {
    const u = new this.model({
      ...dto,
      passwordHash: await hashPassword(password),
    });
    await u.save();
  }

  async update({ email, password, confirmPassword: _, ...dto }: UpdateUserDto) {
    const u = await this.model.findOne({ email });
    if (!u) throw new NotFoundException();
    await u.updateOne(dto);
  }

  findByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
