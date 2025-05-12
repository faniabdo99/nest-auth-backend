import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create_user.dto';
import { RefreshTokenDto } from '../dtos/refresh_token.dto';
import { User } from '../schemas/user.schema';
import { AuthTokens } from 'src/interfaces/auth_token.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Creates a new user account
   * @param user_data - The user registration data containing name, email and password
   * @returns The newly created user object
   * @throws BadRequestException if a user with the provided email already exists
   */
  @ApiOperation({ summary: 'Create new user account', description: 'Register a new user with name, email and password' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request - Email already exists or invalid input' })
  @ApiBody({ type: CreateUserDto })
  @Post('signup')
  signup(@Body() user_data: CreateUserDto): Promise<User> {
    return this.authService.createUser(user_data);
  }

  /**
   * Authenticates a user and generates access token
   * @param credentials - The login credentials containing email and password
   * @returns An object containing access_token and refresh_token
   * @throws UnauthorizedException if credentials are invalid
   */
  @ApiOperation({ summary: 'User login', description: 'Authenticate user and generate access token' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Body() credentials: LoginDto): Promise<AuthTokens> {
    return this.authService.login(credentials);
  }

  /**
   * Generates new access token using refresh token
   * @param refresh_token_data - The refresh token data containing refresh_token
   * @returns An object containing new access_token and refresh_token
   * @throws UnauthorizedException if refresh token is invalid or expired
   */
  @ApiOperation({ summary: 'Refresh access token', description: 'Generate new access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or expired refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @Post('refresh-token')
  refreshToken(
    @Body() refresh_token_data: RefreshTokenDto,
  ): Promise<AuthTokens> {
    const { refresh_token } = refresh_token_data;
    return this.authService.refreshToken(refresh_token);
  }
}
