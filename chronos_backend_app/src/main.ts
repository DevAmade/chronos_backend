import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error'] });
    const configService = app.get(ConfigService);
    const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER);

    app.setGlobalPrefix('api/chronos');
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.useGlobalPipes(new ValidationPipe());

    /*    
    *  Enable CORS to authorize only requests from the client side application
    */
    app.enableCors({
        origin: configService.get('CLIENT_URL'),
        methods: 'GET, PUT, POST, DELETE',
    });

    await app.listen(configService.get('APP_PORT'));

    loggerService.log(
        `Server listen: ${configService.get('APP_HOST')}:${configService.get('APP_PORT')}`,
        'Server',
    );

    return app;
}

export const APP = bootstrap();