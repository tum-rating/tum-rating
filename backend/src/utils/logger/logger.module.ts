import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const env = config.getOrThrow('app.env');

                if (env === 'development') {
                    const pretty = await import('pino-pretty');

                    return {
                        pinoHttp: {
                            level: 'trace',
                            stream: pretty.default({
                                colorize: true,
                                sync: true,
                                translateTime: 'SYS:standard',
                                ignore: 'req,res,pid,hostname,context',
                                messageFormat:
                                    '[{context}] [{req.headers.x-trace-id}]: {msg}',
                            }),
                        },
                    };
                }
                // for AWS log to stdout
                return {
                    pinoHttp: {
                        level: 'info',
                        stream: process.stdout,
                    },
                };
            },
        }),
    ],
})
export class LoggerModule {}
