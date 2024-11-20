import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as morgan from 'morgan';

const setMiddleware = (app: NestExpressApplication) => {
    app.use(helmet());

    app.enableCors({
        credentials: true,
        origin: (_, callback) => callback(null, true),
    });

    app.use(morgan('combined'));

    app.use(compression());

    app.use(cookieParser());
};

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: new Logger('[]'),
    });
    app.useLogger(new Logger('[APP]'));
    const logger = new Logger('[APP]');
    setMiddleware(app);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get('SERVER_PORT');

    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.enableCors({ credentials: true, origin: true });

    const config = new DocumentBuilder()
        .setTitle('blog-server')
        .setDescription('The blog-server API description')
        .setVersion('1.0')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

    await app.listen(port, () => logger.warn(`> Listening on port ${port}`));
}
bootstrap();
