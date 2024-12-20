import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['warn', 'error', 'fatal'] });
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api/chronos');

    app.useGlobalPipes(new ValidationPipe())

    await app.listen(configService.get('APP_PORT'));
}

bootstrap();