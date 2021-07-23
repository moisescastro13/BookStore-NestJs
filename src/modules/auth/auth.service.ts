import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { SignupDto, SigninDto } from './Dto';
import { User } from '../user/Entities/user.entity';
import { IJwtPayload } from './Interfaces/jwt-payload.interface';
import { RoleType } from '../role/roleType.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async singup(signupDto: SignupDto) {
    const { username, email } = signupDto;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });
    if (userExists) {
      throw new ConflictException('username or email already exist');
    }
    return this._authRepository.signup(signupDto);
  }

  async singin(signinDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signinDto;
    const user: User = await this._authRepository.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('user does not exist');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name as RoleType),
    };
    const token = await this._jwtService.sign(payload);
    return { token };
  }
}
