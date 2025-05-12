import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a welcome message for the public API
   * @returns An object containing the welcome message
   * @public
   * @skipThrottle This endpoint bypasses rate limiting
   */
  @SkipThrottle()
  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  /**
   * Protected route that requires authentication
   * @returns An object containing a message confirming authentication
   * @protected
   */
  @UseGuards(AuthGuard)
  @Get('/protected-route')
  getProtectedRoute(@Req() request: Request): object {
    return {
      message: `This is a protected route! You are authenticated as ${request['user'].email}`,
      user: request['user'],
    };
  }
}
