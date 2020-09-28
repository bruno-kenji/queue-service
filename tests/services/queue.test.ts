import winston from 'winston';
import QueueService from '../../src/services/queue';
import { queueMock } from '../mocks/queue';

jest.mock('winston');

describe('QueueService', () => {

  const logger = winston.createLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all messages', () => {
    const queueService = new QueueService(queueMock, logger);
    expect(queueService.GetMessages()).toEqual(queueMock);
  });
});
