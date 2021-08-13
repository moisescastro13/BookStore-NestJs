import { Exclude, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadRoleDto } from '../../role/Dto';
import { ReadUserDetailDto } from './read-details.dto';

@Exclude()
export class ReadUserDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @Type(type => ReadUserDetailDto)
  readonly detail: ReadUserDetailDto;

  @Type(type => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
