import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async create({ password, ...dto }: CreateUserDto) {
    await this.model.create({
      ...dto,
      // Will be hashed by the User.passwordHash set method
      passwordHash: password,
    });
  }

  async update({ email, password, ...dto }: UpdateUserDto) {
    await this.model.findOneAndUpdate(
      { email },
      { ...dto, email, passwordHash: password },
    );
  }

  findByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
