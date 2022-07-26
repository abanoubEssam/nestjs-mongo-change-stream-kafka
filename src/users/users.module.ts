import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaModule } from 'src/kafka/kafka.module';
import { User, UserSchema } from './schemas/users.schema';
import { UserChangeListenerService } from './user-change-listener.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    KafkaModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserChangeListenerService],
  exports: [UserChangeListenerService, UsersService],
})
export class UsersModule {}
