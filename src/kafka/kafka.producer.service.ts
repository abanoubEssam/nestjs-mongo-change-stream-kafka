import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Admin, Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  constructor() {}
  private readonly kafka = new Kafka({
    brokers: ['localhost:29092'],
  });
  private readonly producer: Producer = this.kafka.producer();
  private readonly admin: Admin = this.kafka.admin();
  async onModuleInit() {
    await this.producer.connect();
    await this.admin.createTopics({
      waitForLeaders: true,
      topics: [],
    });
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  async onApplicationShutdown(signal?: string) {
    console.log(
      '🚀 ~ file: kafka.producer.service.ts ~ line 26 ~ onApplicationShutdown ~ signal',
      signal,
    );
    await this.producer.disconnect();
  }
}
