import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from './guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a welcome message for the public API
   * @returns An object containing the welcome message
   * @public
   * @skipThrottle This endpoint bypasses rate limiting
   */
  @ApiOperation({
    summary: 'Get welcome message',
    description: 'Returns a welcome message for the public API',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message retrieved successfully',
  })
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
  @ApiOperation({
    summary: 'Access protected route',
    description: 'Protected route that requires authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully accessed protected route',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @Get('/protected-route')
  getProtectedRoute(@Req() request: Request): object {
    return {
      message: `This is a protected route! You are authenticated`,
      user: request['user'] as object,
    };
  }
}
