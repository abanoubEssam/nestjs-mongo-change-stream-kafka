import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb1:27017,mongodb2:27018,mongodb3:27019/change-stream-example', {
      replicaSet: 'rs0',
    }),
    UsersModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
