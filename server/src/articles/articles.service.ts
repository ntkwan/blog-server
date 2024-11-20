import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article)
        private readonly articleModel: typeof Article,
    ) {}

    async createArticle(title: string, content: string, author: string) {
        try {
            const article = await this.articleModel.create({
                title,
                content,
                author,
            });
            return article;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async getAllArticles() {
        return this.articleModel.findAll();
    }

    async getArticleById(id: string) {
        try {
            const isExisted = await this.articleModel.findOne({
                where: { id },
            });
            if (isExisted === null) {
                throw new BadRequestException('Article not found');
            }
            return isExisted;
        } catch (error) {
            console.log(error.message);
            throw new BadRequestException('ID is invalid');
        }
    }

    async updateArticle(
        id: string,
        title: string,
        content: string,
        author?: string,
    ) {
        const article = await this.getArticleById(id);
        if (article) {
            article.title = title;
            article.content = content;
            if (author) article.author = author;
            await article.save();
            return article;
        }
        return null;
    }

    async deleteArticle(id: string) {
        try {
            const article = await this.getArticleById(id);
            if (article) {
                await article.destroy();
                return { message: 'Article deleted successfully' };
            }
            return { message: 'Article not found' };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
