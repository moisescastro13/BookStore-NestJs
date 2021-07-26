import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { User } from './Entities/user.entity';
import { Status } from '../../Share/Enums';
import { Role } from '../role/Entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepositoy: RoleRepository,
  ) {}

  async getOne(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException();
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: Status.ACTIVE },
    });
    return users;
  }

  async create(user: User): Promise<User> {
    if (!user) {
      throw new BadRequestException();
    }
    const savedUser = await this._userRepository.save(user);
    return savedUser;
  }

  async update(id: number, user: User): Promise<void> {
    if (!id) {
      throw new BadRequestException();
    }
    await this._userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    if (!id) throw new BadRequestException();

    const userExist: User = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!userExist) throw new NotFoundException();

    await this._userRepository.update(id, { status: Status.INACTIVE });
  }

  async setRoleToUser(userId: number, roleId: number) {
    const userExist: User = await this._userRepository.findOne(userId, {
      where: { status: Status.ACTIVE },
    });

    if (!userExist) throw new NotFoundException();

    const roleExist: Role = await this._roleRepositoy.findOne(roleId, {
      where: { status: Status.ACTIVE },
    });

    if (!roleExist) throw new NotFoundException();

    userExist.roles.push(roleExist);
    await this._userRepository.save(userExist);

    return true;
  }
}
