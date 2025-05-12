import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // TODO: Extract this to a config file
  imports: [
    JwtModule.register({
      global: true,
      secret: 'TOP_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forRoot(
      'mongodb+srv://faniabdo999:sLqIbvUeIYOnxhEy@nestjs-auth.penoidn.mongodb.net/?retryWrites=true&w=majority&appName=nestjs-auth',
    ),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
