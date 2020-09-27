import { Container } from 'typedi';
import LoggerInstance from './logger';
import Message from '../models/message';

export default ({ queue, processingQueue, models }: {
  queue: Message[];
  processingQueue: Message[];
  models: { name: string; model: any }[]
}) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    Container.set('queue', queue);
    Container.set('logger', LoggerInstance)

    LoggerInstance.info('✌️ Models injected into container');

    return { queue };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
