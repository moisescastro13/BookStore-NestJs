import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from './Entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Status } from '../../Share/Enums';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepository: RoleRepository,
  ) {}
  async getOne(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException();
    }
    const user: Role = await this._roleRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: Status.ACTIVE },
    });
    return roles;
  }

  async create(role: Role): Promise<Role> {
    if (!role) {
      throw new BadRequestException();
    }
    const newRole = await this._roleRepository.save(role);
    return newRole;
  }

  async update(id: number, role: Role): Promise<void> {
    await this._roleRepository.update(id, role);
  }

  async delete(id: number): Promise<void> {
    await this._roleRepository.update(id, { status: Status.INACTIVE });
  }
}
