import { IsEmail, IsNumber, IsString } from 'class-validator';
import { RoleType } from '../../../Share/Enums';
import { UserDetails } from '../Entities/userDetails.entity';
export class UserDto {
  @IsNumber()
  id: number;
  @IsString()
  username: string;
  @IsEmail()
  email: string;
  roles: RoleType[];
  detail: UserDetails;
}
