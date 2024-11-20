import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsString()
    id: string;

    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(4)
    password: string;
}
