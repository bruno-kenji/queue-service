import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import QueueService from '../../services/queue';
import MessagesDTO from '../../models/messagesDTO';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/messages', route);

  route.post(
    '/produce',
    celebrate({
      body: Joi.array().items(
        Joi.string().required()
      ),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get<Logger>('logger');
      logger.debug('📡 Calling Produce endpoint with body: %o', req.body);
      try {
        const queueService = Container.get(QueueService);
        const { publishedMessageIDs } = await queueService.ProduceMessages(req.body as MessagesDTO);
        return res.status(201).json({ publishedMessageIDs });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.post('/consume', async (_req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get<Logger>('logger');
    logger.debug('📡 Calling Consume endpoint');
    try {
      const queueService = Container.get(QueueService);
      const { failedMessageIDs } = await queueService.ConsumeMessages();
      return res.status(201).json({ failedMessageIDs });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  route.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get<Logger>('logger');
    logger.debug('📡 Calling Get endpoint');
    try {
      const queueService = Container.get(QueueService);
      const messages = queueService.GetMessages();
      return res.status(200).json({ messages });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });
};
