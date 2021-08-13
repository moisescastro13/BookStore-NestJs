import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoggedInDto, SigninDto, SignupDto } from './Dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() signupDto: SignupDto): Promise<void> {
    return this._authService.singup(signupDto);
  }
  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(@Body() signinDto: SigninDto): Promise<LoggedInDto> {
    return this._authService.singin(signinDto);
  }
}
