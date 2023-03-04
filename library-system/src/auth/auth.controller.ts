import { Controller, Body, Post, ValidationPipe, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from 'src/models/dtos/users-dtos/login-user.dto';
import { GetToken } from './get-token.decorator';

@Controller('/api/session')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
      ) {}

      @Post()
      async login(@Body(new ValidationPipe({ whitelist: true})) userDto: LoginUserDTO): Promise<{ token: string }> {
        return await this.authService.login(userDto);
      }
      
      @Delete()
      async logout(@GetToken() token: string): Promise<{ message: string}> {
        await this.authService.blacklist(token?.slice(7));
    
        return {
          message: 'You have been logged out!',
        };
      }
    
}