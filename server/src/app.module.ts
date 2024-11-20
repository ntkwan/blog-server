import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import pg from 'pg';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    port: configService.get('MAIL_PORT'),
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"[NO-REPLY] blog server" <no-repy@blog-server>`, // Sender's email address
                },
            }),
            inject: [ConfigService],
        }),

        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                dialectModule: pg,
                host: configService.get('DATABASE'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                autoLoadModels: true,
                synchronize: true,
                models: [User],
                dialectOptions: {
                    ssl: false,
                },
            }),
            inject: [ConfigService],
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
