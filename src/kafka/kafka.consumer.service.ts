import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';

@Injectable()
export class KafkaConsumerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly kafka = new Kafka({
    brokers: ['localhost:29092'],
  });
  private readonly consumers: Consumer[] = [];

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'create-user' });
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onModuleInit() {
    await this.consume(
      {
        topics: ['create-user'],
      },
      {
        eachMessage: async ({ message, topic, partition }) => {
          console.log(
            '🚀 ~ file: kafka.consumer.service.ts ~ line 39 ~ onModuleInit ~ message',
            JSON.parse(message.value.toString()),
          );
          console.log(
            '🚀 ~ file: kafka.consumer.service.ts ~ line 39 ~ onModuleInit ~ topic',
            topic,
          );
          console.log(
            '🚀 ~ file: kafka.consumer.service.ts ~ line 39 ~ onModuleInit ~ partition',
            partition,
          );
        },
      },
    );
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
