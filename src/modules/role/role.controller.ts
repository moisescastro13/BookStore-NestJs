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
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './Dto';

@Controller('role')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
    return this._roleService.getOne(id);
  }

  @Get()
  findAll(): Promise<ReadRoleDto[]> {
    return this._roleService.getAll();
  }

  @Post('create')
  newRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    return this._roleService.create(role);
  }

  @Put()
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    return this._roleService.update(id, role);
  }

  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this._roleService.delete(id);
  }
}
