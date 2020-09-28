import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import Message from '../models/message';
import MessagesDTO from '../models/messagesDTO';
import timeoutPromise from '../utils/timeoutPromise';
import config from '../config';

@Service()
export default class QueueService {
  constructor(
    @Inject('queue') private queue: Message[],
    @Inject('logger') private logger: Logger,
  ) { }

  private async ProduceMessage(message: Message): Promise<void> {
    this.queue.push(message);
  };

  public async ProduceMessages(messages: MessagesDTO) {
    const publishedMessageIDs = messages.map((message) => {
      const messageObj = new Message(message);
      this.ProduceMessage(messageObj);
      return messageObj.id;
    });
    this.logger.debug('Messages published! Total messages in Queue: %i', this.queue.length);
    return { publishedMessageIDs };
  };

  /*
    Process message takes a random time between 0 and 500 miliseconds.
    If it takes longer than the configured timeout, it throws an error.
  */
  private async ProcessMessage(message: Message): Promise<void> {
    this.logger.debug('Consuming message: %s', message.body);

    const processMessage: Function = timeoutPromise(resolve => resolve(() => {
      this.logger.info('🚀 Finished processing message %s', message.id);
    }), Math.random() * 500);

    const onTimeout: Function = timeoutPromise(resolve => resolve(() => {
      throw 'Timeout';
    }), config.consumer.timeout);

    return Promise.race([processMessage, onTimeout].map(f => f()))
      .then(resolve => resolve())
      .catch(e => { throw e });
  };

  /*
    Removes the first message from the queue and process it.
    If it fails, pushes the message back to the queue and returns the message ID.
    If it succeeds, does nothing and returns null.
  */
  private async ConsumeMessage(message: Message): Promise<Message['id']> {
    this.queue.splice(0, 1);
    try {
      await this.ProcessMessage(message);
    } catch (e) {
      this.logger.error(
        `❌ Consumer failed to read message. Adding message
          ${message.id} back to the queue. Reason: ${e}.`
      );
      this.queue.push(message);
      return message.id;
    }
  };

  public async ConsumeMessages() {
    const queue = [...this.queue];
    const consumedMessages = await Promise.all(queue.map(async (message) =>
      await this.ConsumeMessage(message)));

    this.logger.debug('Messages consumed! Remaining messages in Queue: %i', this.queue.length);

    const failedMessageIDs = consumedMessages.filter(message => message);
    return { failedMessageIDs };
  };

  public GetMessages(): Message[] {
    return this.queue;
  };
};
