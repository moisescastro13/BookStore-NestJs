import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from '../../Share/Enums';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { ReadUserDto, UpdateUserDto } from './Dto';
import { User } from './Entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Roles(RoleType.ADMIN, RoleType.AUTHOR)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
    return this._userService.getOne(id);
  }

  @UseGuards(AuthGuard())
  @Get()
  findAll(): Promise<ReadUserDto[]> {
    return this._userService.getAll();
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this._userService.update(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this._userService.delete(id);
  }

  @Post('/setRole/:userId/:roleId')
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
