import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
export class UserModule {}