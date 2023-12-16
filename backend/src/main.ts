import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { initOpenApi } from './utils/openapi/openapi';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const loggerServivce = await app.resolve(PinoLogger);
    loggerServivce.setContext('bootstrap');

    app.enableCors();

    if (configService.getOrThrow('app.env') === 'development') {
        initOpenApi(app);
        loggerServivce.info(
            'Swagger initialized on localhost:%s/api',
            configService.getOrThrow('app.port'),
        );
    }

    await app.listen(configService.getOrThrow('app.port'), () => {
        loggerServivce.info(
            'Application v: %s, started on port %s',
            process.env.npm_package_version,
            configService.getOrThrow('app.port'),
        );
    });
}
bootstrap();
