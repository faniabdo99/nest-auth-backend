import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create_user.dto';
import { RefreshTokenDto } from '../dtos/refresh_token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singup(@Body() user_data: CreateUserDto) {
    return this.authService.create(user_data);
  }

  @Post('login')
  login(@Body() credentials: LoginDto): Promise<object> {
    return this.authService.login(credentials);
  }

  @Post('refresh-token')
  refreshToken(@Body() refresh_token_data: RefreshTokenDto): Promise<object> {
    const { refresh_token } = refresh_token_data;
    return this.authService.refreshToken(refresh_token);
  }
}
