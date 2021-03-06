import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT || '9898', 10),

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'debug',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api/v1',
  },

  /**
   * Consumer configs
   * a message needs to be processed within the timeout value, in miliseconds
   */
  consumer: {
    timeout: parseInt(process.env.TIMEOUT || '250', 10),
  },
};
