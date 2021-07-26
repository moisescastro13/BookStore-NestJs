import { RoleType } from '../../../Share/Enums';
import { UserDetails } from '../Entities/userDetails.entity';
export class UserDto {
  id: number;
  username: string;
  email: string;
  roles: RoleType[];
  detail: UserDetails;
}
