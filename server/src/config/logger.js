const pino = require('pino');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === "test";
const logger =isTest? pino({ enabled: false }): pino({
  level: process.env.LOG_LEVEL || 'info',

  // Pretty logs in development
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  // Structured error logging
  serializers: {
    err: pino.stdSerializers.err,
  },

  base: {
    env: process.env.NODE_ENV,
  },
});

module.exports = logger;