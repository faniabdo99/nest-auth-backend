import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '../dto/create_user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get('/')
  findAll() {
    return 'All users here';
  }

  @Post('signup')
  singup(@Body() user_data: CreateUserDto){
    return this.userService.create(user_data);
  }
}
