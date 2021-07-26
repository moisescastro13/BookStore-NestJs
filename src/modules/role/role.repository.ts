import { EntityRepository, Repository } from 'typeorm';
import { Role } from './Entities/role.entity';
@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
