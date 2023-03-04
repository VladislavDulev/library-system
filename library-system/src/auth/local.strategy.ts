import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";
import { jwtConstants } from "src/constants/secret";
import { JwtPayload } from "src/common/jwt-payload";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtConstants.secret
      });
  }

  async validate(payload: any): Promise<JwtPayload> {
    const user = await this.authService.validateUser(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}