import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create_user.dto';
import { RefreshTokenDto } from '../dtos/refresh_token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Creates a new user account
   * @param user_data - The user registration data containing name, email and password
   * @returns The newly created user object
   * @throws BadRequestException if a user with the provided email already exists
   */
  @Post('signup')
  singup(@Body() user_data: CreateUserDto) {
    return this.authService.createUser(user_data);
  }

  /**
   * Authenticates a user and generates access token
   * @param credentials - The login credentials containing email and password
   * @returns An object containing access_token and refresh_token
   * @throws UnauthorizedException if credentials are invalid
   */
  @Post('login')
  login(@Body() credentials: LoginDto): Promise<object> {
    return this.authService.login(credentials);
  }

  /**
   * Generates new access token using refresh token
   * @param refresh_token_data - The refresh token data containing refresh_token
   * @returns An object containing new access_token and refresh_token
   * @throws UnauthorizedException if refresh token is invalid or expired
   */
  @Post('refresh-token')
  refreshToken(@Body() refresh_token_data: RefreshTokenDto): Promise<object> {
    const { refresh_token } = refresh_token_data;
    return this.authService.refreshToken(refresh_token);
  }
}
