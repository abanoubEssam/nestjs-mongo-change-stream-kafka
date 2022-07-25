import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChangeStreamInsertDocument } from 'mongodb';
import { Model } from 'mongoose';
import { ChangeStreamOperationType } from 'src/utils/interfaces/change-stream.interface';
import { User, UserDocument } from './schemas/users.schema';
@Injectable()
export class UserChangeListenerService {
  constructor(@InjectModel(User.name) private _model: Model<UserDocument>) {}

  async listener(changeStreamOperationType: ChangeStreamOperationType) {
    const changeStream = this._model.watch([
      {
        $match: {
          operationType: changeStreamOperationType
        },
      },
    ]);
    console.log('Listener Working');
    changeStream.on('change', (listener: ChangeStreamInsertDocument) => {
      console.log(
        '🚀 ~ file: users.service.ts ~ line 22 ~ UsersService ~ listener ~ listener',
        listener.fullDocument,
        listener.operationType,
      );
    });
  }
}
