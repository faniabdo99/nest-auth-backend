import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '../dtos/create_user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../schemas/refresh_token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: email,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async login(credentials: LoginDto): Promise<object> {
    const user = await this.userModel.findOne({ email: credentials.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.generateAccessToken(user._id.toString());
  }

  async refreshToken(refresh_token: string): Promise<object> {
    const refresh_token_document = await this.refreshTokenModel.findOne({
      token: refresh_token,
      expiry_date: { $gt: new Date() },
    });
    if (!refresh_token_document) {
      throw new UnauthorizedException(
        'Your refresh token is invalid or expired',
      );
    }
    return this.generateAccessToken(refresh_token_document.user_id);
  }

  async generateAccessToken(user_id: string): Promise<object> {
    const payload = { user_id };
    const refresh_token = await this.refreshTokenModel.create({
      token: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      user_id: user_id,
      expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      refresh_token: refresh_token.token,
    };
  }
}
