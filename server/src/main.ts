import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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

    await app.listen(port);
}
bootstrap();
