import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'Content is required' })
    content: string;

    @IsString()
    @IsNotEmpty()
    author: string;
}
