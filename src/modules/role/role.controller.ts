import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './Entities/role.entity';

@Controller('role')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return await this._roleService.getOne(id);
  }
  @Get()
  async findAll(): Promise<Role[]> {
    return await this._roleService.getAll();
  }
  @Post('create')
  async newRole(@Body() role: Role): Promise<Role> {
    return await this._roleService.create(role);
  }
  @Put()
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role) {
    return await this._roleService.update(id, role);
  }
  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this._roleService.delete(id);
  }
}
