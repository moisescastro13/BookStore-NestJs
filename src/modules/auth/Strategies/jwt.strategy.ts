import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { ConfigService } from '../../../config/config.service';
import { Configuration } from '../../../config/config.keys';
import { AuthRepository } from '../auth.repository';
import { IJwtPayload } from '../Interfaces/jwt-payload.interface';
import { Status } from '../../user/UserStatus.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(Configuration.JWT_SECRET),
    });
  }
  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this._authRepository.findOne({
      where: { username, status: Status.ACTIVE },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
