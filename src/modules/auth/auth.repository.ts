import { Repository, EntityRepository, getConnection } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { RoleRepository } from '../role/role.repository';
import { User } from '../user/Entities/user.entity';
import { Role } from '../role/Entities/role.entity';
import { UserDetails } from '../user/Entities/userDetails.entity';
import { SignupDto } from './Dto';
import { RoleType } from '../../Share/Enums';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(SignupDto: SignupDto) {
    const { username, email, password } = SignupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );
    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });
    user.roles = [defaultRole];

    const details = new UserDetails();
    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
