import { IsEmail, IsIn, IsString } from 'class-validator';
import { UserRole } from '../user.schema';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsIn(Object.values(UserRole))
  role: UserRole;
}
