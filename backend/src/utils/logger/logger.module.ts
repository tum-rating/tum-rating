import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import pretty from 'pino-pretty';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const env = config.getOrThrow('app.env');

        if (env === 'development')
          return {
            pinoHttp: {
              level: 'trace',
              stream: pretty({
                colorize: true,
                sync: true,
                translateTime: 'SYS:standard',
                ignore: 'req,res,pid,hostname,context',
                messageFormat: '[{context}] [{req.headers.x-trace-id}]: {msg}',
              }),
            },
          };
        // TODO add production logger config
        return {};
      },
    }),
  ],
})
export class LoggerModule {}
