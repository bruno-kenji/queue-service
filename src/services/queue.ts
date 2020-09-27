import { Service, Inject, Container } from 'typedi';
import winston from 'winston';
import Message from '../models/message';
import MessagesDTO from '../models/messagesDTO';
import oi from './oi';

@Service()
export default class QueueService {
  constructor(
    @Inject('queue') private queue: Message[]
  ) { }

  private async PublishMessage(message: Message) {
    this.queue.push(message);
  };

  public async ProduceMessages(messages: MessagesDTO) {
    const logger = Container.get<winston.Logger>('logger');

    const messagesObj = messages.map((message) => new Message(message));
    messagesObj.forEach((message) => this.PublishMessage(message));
    logger.debug('Messages published! Total messages in Queue: %i', this.queue.length);
    return { messages: messagesObj };
  };

  public GetMessages() {
    return this.queue;
  };
}
