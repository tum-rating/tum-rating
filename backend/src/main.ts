import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { initOpenApi } from './utils/openapi/openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors();

  if (configService.get('app.env') === 'development') {
    initOpenApi(app);
  }

  await app.listen(configService.getOrThrow('app.port'));
}
bootstrap();
