import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
@Module({
  // TODO: Extract this to a config file
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://faniabdo999:sLqIbvUeIYOnxhEy@nestjs-auth.penoidn.mongodb.net/?retryWrites=true&w=majority&appName=nestjs-auth',
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
