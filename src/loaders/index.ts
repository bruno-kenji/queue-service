import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';
import queue from './queue';

export default async ({ expressApp }) => {
  const messageModel = {
    name: 'messageModel',
    // Notice the require syntax and the '.default'
    model: require('../models/message').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  await dependencyInjectorLoader({
    queue,
    models: [
      messageModel,
      // salaryModel,
      // whateverModel
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
