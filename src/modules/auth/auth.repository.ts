import { Repository, EntityRepository } from 'typeorm';
import { User } from '../user/Entities/user.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {}
