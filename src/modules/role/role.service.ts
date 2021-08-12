import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Role } from './Entities/role.entity';
import { RoleRepository } from './role.repository';
import { Status } from '../../Share/Enums';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './Dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: RoleRepository,
  ) {}
  async getOne(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException();
    }
    const user: Role = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return plainToClass(ReadRoleDto, user);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: Status.ACTIVE },
    });
    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    if (!role) {
      throw new BadRequestException();
    }
    const newRole: Role = await this._roleRepository.save(role);
    return plainToClass(ReadRoleDto, newRole);
  }

  async update(id: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
    const foundRole: Role = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!foundRole) throw new NotFoundException();

    foundRole.name = role.name;
    foundRole.description = role.description;

    const updatedRole = await this._roleRepository.save(foundRole);
    return plainToClass(ReadRoleDto, updatedRole);
  }

  async delete(id: number): Promise<void> {
    const roleExist: Role = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!roleExist) throw new NotFoundException();

    await this._roleRepository.update(id, { status: Status.INACTIVE });
  }
}
