import { Repository, EntityRepository, getConnection } from 'typeorm';
import { RoleRepository } from '../role/role.repository';
import { User } from '../user/Entities/user.entity';
import { SignupDto } from './Dto';
import { Role } from '../role/Entities/role.entity';
import { RoleType } from '../role/roleType.enum';
import { UserDetails } from '../user/Entities/userDetails.entity';
import { genSalt, hash } from 'bcryptjs';

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
