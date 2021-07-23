import { createParamDecorator } from '@nestjs/common';
import { UserDto } from '../user/Dto/user.dto';
export const GetUser = createParamDecorator((req, res): UserDto => {
  return req.user;
});
