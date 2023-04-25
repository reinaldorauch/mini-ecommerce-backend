import { IsEmail, IsIn, IsString } from 'class-validator';
import { UserRole } from '../user.schema';
import { Match } from 'src/util/match.decorator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Match('password')
  confirmPassword: string;

  @IsIn(Object.values(UserRole))
  role: UserRole;
}
