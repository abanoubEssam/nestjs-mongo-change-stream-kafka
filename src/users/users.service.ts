import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { ChangeStreamDocument, ChangeStream } from 'mongodb';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';
@Injectable()
export class UsersService implements OnApplicationBootstrap, OnModuleDestroy {
  constructor(
    @InjectModel(User.name) private _model: Model<UserDocument>,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  private changeStream: ChangeStream;
  // private listeners:
  async createUser() {
    const createdUser = await this._model.create({
      email: 'abanoub.e.mhanna@gmail.com',
      name: 'abanoub',
      age: 28,
      password: '123456',
    });
    console.log(
      '🚀 ~ file: users.service.ts ~ line 23 ~ UsersService ~ createUser ~ createdUser',
      createdUser,
    );

    return createdUser;
  }

  async onApplicationBootstrap() {
    // this.changeStream = this._model.watch([], { fullDocument: 'updateLookup' });
    this.changeStream = this._model.watch([]); // make ensure to create
    console.log('Listener Working');
    this.changeStream.on(
      'change',
      async (listener: ChangeStreamDocument<Document>) => {
        if (listener.operationType == 'insert') {
          const size = Buffer.byteLength(JSON.stringify(listener.fullDocument));
          console.log(
            '🚀 ~ file: users.service.ts ~ line 48 ~ UsersService ~ onApplicationBootstrap ~ size',
            size,
            'bytes',
          );
          const kiloBytes = size / 1024;
          console.log(
            '🚀 ~ file: users.service.ts ~ line 53 ~ UsersService ~ onApplicationBootstrap ~ kiloBytes',
            kiloBytes,
          );
          const megaBytes = kiloBytes / 1024;
          console.log(
            '🚀 ~ file: users.service.ts ~ line 55 ~ UsersService ~ onApplicationBootstrap ~ megaBytes',
            megaBytes,
          );
          // send to kafka
          await this.kafkaProducerService.produce({
            topic: 'create-user',
            messages: [
              {
                value: JSON.stringify(listener.fullDocument),
              },
            ],
          });
        }
        if (listener.operationType == 'delete') {
          console.log('listener', listener);
        }
      },
    );
  }

  async onModuleDestroy() {
    console.log(
      `${UsersService.name} resume token ${this.changeStream.resumeToken} should be saved to resume`,
    );
    this.changeStream.close();
    console.log(`${UsersService.name} destroyed`);
  }
}
