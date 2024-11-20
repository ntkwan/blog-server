import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './entities/article.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessControlService } from 'src/shared/shared.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [SequelizeModule.forFeature([Article])],
    controllers: [ArticlesController],
    providers: [ArticlesService, AccessControlService, JwtService],
})
export class ArticlesModule {}
