import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Request,
    HttpCode,
    Res,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import {
    ApiResponse,
    ApiOperation,
    ApiBody,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/enums/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { Response } from 'express';
import { ATAuthGuard } from '../auth/guards/at-auth.guard';

@Controller('article')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Create an article with title, content, and author [ADMIN]',
    })
    @ApiBody({ type: CreateArticleDto })
    @ApiResponse({
        status: 200,
        description: 'Article created successfully',
        type: CreateArticleDto,
    })
    @Post('create')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @HttpCode(200)
    async createArticle(
        @Request() req: any,
        @Res() res: Response,
    ): Promise<void> {
        const { title, content } = req.body;
        const user = req.user.username;
        const article = await this.articlesService.createArticle(
            title,
            content,
            user,
        );
        res.send({
            message: 'Article created successfully',
            article,
        });
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get all articles [ADMIN, READER, EDITOR]',
    })
    @ApiResponse({
        status: 200,
        description: 'All articles get successfully',
        type: CreateArticleDto,
    })
    @Get('articles')
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.READER)
    @HttpCode(200)
    async getAllArticles(@Request() req: any, @Res() res: Response) {
        const articles = await this.articlesService.getAllArticles();
        res.send({
            message: 'All articles get successfully',
            articles,
        });
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Get article by ID [ADMIN, READER, EDITOR]',
    })
    @ApiResponse({
        status: 200,
        description: 'Article get successfully',
        type: CreateArticleDto,
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.READER)
    @HttpCode(200)
    @Get(':id')
    async getArticleById(@Param('id') id: string, @Res() res: Response) {
        const article = await this.articlesService.getArticleById(id);
        res.send({
            message: 'Article get succesfully',
            article,
        });
    }

    @ApiBearerAuth('access-token')
    @ApiBody({
        type: CreateArticleDto,
    })
    @ApiOperation({
        summary: 'Change article title or content by ID [ADMIN, EDITOR]',
    })
    @ApiResponse({
        status: 200,
        description: 'Article changed successfully',
        type: CreateArticleDto,
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.EDITOR)
    @HttpCode(200)
    @Put(':id')
    async updateArticle(
        @Param('id') id: string,
        @Body('title') title: string,
        @Body('content') content: string,
        @Res() res: Response,
    ) {
        const article = this.articlesService.updateArticle(id, title, content);
        res.send({
            message: 'Article updated succesfully',
            article,
        });
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Delete article by ID [ADMIN]',
    })
    @ApiResponse({
        status: 200,
        description: 'Article deleted successfully',
        type: CreateArticleDto,
    })
    @UseGuards(ATAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @HttpCode(200)
    @Delete(':id')
    async deleteArticle(@Param('id') id: string, @Res() res: Response) {
        await this.articlesService.deleteArticle(id);
        res.send({
            message: 'Article deleted successfully',
        });
    }
}
