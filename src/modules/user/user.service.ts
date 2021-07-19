import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './Entities/user.entity';
import { Status } from './UserStatus.enum';
import { UserDetails } from './Entities/userDetails.entity';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
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
    const details = new UserDetails();
    details.name = 'user';
    user.details = details;
    const defaultRole = await this._roleRepository.findOne({
      where: { name: 'GENERAL' },
    });
    user.roles = [defaultRole];

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
    if (!id) {
      throw new BadRequestException();
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException();
    }
    await this._userRepository.update(id, { status: Status.INACTIVE });
  }
}
