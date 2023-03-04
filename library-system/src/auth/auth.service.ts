import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "src/data/token.entity";
import { Repository } from "typeorm";
import { UserDTO } from "src/models/dtos/users-dtos/user.dto";
import { User } from "src/data/user.entity";
import * as bcrypt from 'bcrypt'
import { LoginUserDTO } from "src/models/dtos/users-dtos/login-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async blacklist(token: string) {
        const tokenEntity = this.tokenRepository.create();
        tokenEntity.token = token;
    
        await this.tokenRepository.save(tokenEntity)
      }
    
      async isBlacklisted(token: string): Promise<boolean> {
        return Boolean(await this.tokenRepository.findOne({
          where: {
            token,
          }
        }));
      }
    
      
    async validateUser(username: string): Promise<User> {
        const user: User = await this.userRepository.findOne({
          where: {
            username: username,
            isDeleted: false,
            isBanned: false
          }
        });
        if (user) {
            return user;
        }
        return null;
    }

    async login(user: LoginUserDTO){
        const validateduser = await this.validateUser(user.username); 

        if(!validateduser || !(await bcrypt.compareSync(user.password, validateduser.password))){
          throw new UnauthorizedException();
        }

        const payload = {username: user.username, role: validateduser.role, sub: validateduser.id};

        return {
            token: this.jwtService.sign(payload),
        };
    }
}