import { Service, Inject, Container } from 'typedi';
import Message from '../models/message';
import MessagesDTO from '../models/messagesDTO';
import timeoutPromise from '../utils/timeoutPromise';
import config from '../config';

@Service()
export default class QueueService {
  constructor(
    @Inject('queue') private queue: Message[],
    @Inject('logger') private logger,
  ) { }

  private async PublishMessage(message: Message) {
    this.queue.push(message);
  };

  public async ProduceMessages(messages: MessagesDTO) {
    const publishedMessageIDs = messages.map((message) => {
      const messageObj = new Message(message);
      this.PublishMessage(messageObj);
      return messageObj.id;
    });
    this.logger.debug('Messages published! Total messages in Queue: %i', this.queue.length);
    return { publishedMessageIDs };
  };

  private async ConsumeMessage(message: Message) {
    this.logger.info('Finished processing message %s', message.id);

    // const consumeMessage = timeoutPromise(resolve => resolve(() => {
    //   this.logger.info('Finished processing message %s', message.id);
    // }), Math.random() * 500);

    // const onTimeout = timeoutPromise(resolve => resolve(() => {
    //   throw 'Timeout';
    // }), config.consumer.timeout);

    // return Promise.race([consumeMessage, onTimeout].map(f => f())).then(result => result());
  };

  public async ConsumeMessages() {
    const failedMessageIDs = [];

    await Promise.all(this.queue.map(async (message, index) => {
      this.queue.splice(index, 1);
      this.logger.debug('Reading message: %s', message.body);
      this.logger.debug('queue is now this length: %i', this.queue.length);
      try {
        await this.ConsumeMessage(message);
      } catch (e) {
        this.logger.error("Consumer failed to read message. Adding message %s back to the queue. Reason: %o", message.id, e);
        this.queue.push(message);
        failedMessageIDs.push(message);
      }
    }));

    return { failedMessageIDs };
  };

  public GetMessages() {
    return this.queue;
  };
}
