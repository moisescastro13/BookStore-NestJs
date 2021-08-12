import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../role/role.repository';
import { User } from './Entities/user.entity';
import { Status } from '../../Share/Enums';
import { Role } from '../role/Entities/role.entity';
import { ReadUserDto, UpdateUserDto } from './Dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepositoy: RoleRepository,
  ) {}

  async getOne(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException();
    }
    const user: User = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: Status.ACTIVE },
    });
    return users.map((user: User) => plainToClass(ReadUserDto, user));
  }

  async update(id: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const useExist = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });
    if (!useExist) throw new NotFoundException();
    useExist.username = user.username;

    const updatedUser = await this._userRepository.save(useExist);
    return plainToClass(ReadUserDto, updatedUser);
  }

  async delete(id: number): Promise<void> {
    if (!id) throw new BadRequestException();

    const userExist: User = await this._userRepository.findOne(id, {
      where: { status: Status.ACTIVE },
    });

    if (!userExist) throw new NotFoundException();

    await this._userRepository.update(id, { status: Status.INACTIVE });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
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
