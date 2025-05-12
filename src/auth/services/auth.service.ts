import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create_user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../schemas/refresh_token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  /**
   * Creates a new user account in the system
   * @param createUserDto - The data transfer object containing user registration information
   * @param createUserDto.name - The name of the user
   * @param createUserDto.email - The email address of the user
   * @param createUserDto.password - The password for the user account
   * @returns A Promise that resolves to the newly created User object
   * @throws BadRequestException if a user with the provided email already exists
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    this.logger.log(`Creating user ${name} with email ${email}`);
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: email,
    });
    if (existingUser) {
      this.logger.error(`User with email ${email} already exists`);
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    this.logger.log(`User ${name} created successfully`);
    return createdUser.save();
  }

  /**
   * Authenticates a user with their email and password
   * @param credentials - The login credentials containing email and password
   * @param credentials.email - The email address of the user
   * @param credentials.password - The password for authentication
   * @returns A Promise that resolves to an object containing access and refresh tokens
   * @throws UnauthorizedException if the email is not found or password is invalid
   */
  async login(credentials: LoginDto): Promise<object> {
    const user = await this.userModel.findOne({ email: credentials.email });
    if (!user) {
      this.logger.error(`User with email ${credentials.email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.error(`Invalid credentials for user ${credentials.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    this.logger.log(`User ${credentials.email} logged in successfully`);
    return await this.generateAccessToken(user._id.toString());
  }

  /**
   * Refreshes an access token using a refresh token
   * @param refresh_token - The refresh token to be used for token refresh
   * @returns A Promise that resolves to an object containing the new access token and refresh token
   * @throws UnauthorizedException if the refresh token is invalid or expired
   */
  async refreshToken(refresh_token: string): Promise<object> {
    const refresh_token_document = await this.refreshTokenModel.findOne({
      token: refresh_token,
      expiry_date: { $gt: new Date() },
    });
    if (!refresh_token_document) {
      this.logger.error(`Invalid refresh token ${refresh_token}`);
      throw new UnauthorizedException(
        'Your refresh token is invalid or expired',
      );
    }
    this.logger.log(`Refresh token ${refresh_token} refreshed successfully`);
    return this.generateAccessToken(refresh_token_document.user_id);
  }

  /**
   * Generates an access token for a user
   * @param user_id - The ID of the user for whom the access token is being generated
   * @returns A Promise that resolves to an object containing the access token and refresh token
   * @throws Logger if the access token generation fails
   */
  async generateAccessToken(user_id: string): Promise<object> {
    const payload = { user_id };
    const refresh_token = await this.refreshTokenModel.create({
      token: uuidv4(),
      user_id: user_id,
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    this.logger.log(`Access token generated for user ${user_id}`);
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refresh_token: refresh_token.token,
    };
  }
}
