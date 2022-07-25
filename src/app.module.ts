import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { StatisticsModule } from './statistics/statistics.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb1:27017,mongodb2:27018,mongodb3:27019/change-stream-example', {
      replicaSet: 'rs0',
    }),
    UsersModule,
    StatisticsModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
