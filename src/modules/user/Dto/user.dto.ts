import { RoleType } from '../../role/roleType.enum';
import { UserDetails } from '../Entities/userDetails.entity';
export class UserDto {
  id: number;
  username: string;
  email: string;
  roles: RoleType[];
  detail: UserDetails;
}
