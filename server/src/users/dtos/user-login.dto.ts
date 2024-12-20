import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from 'src/auth/enums/roles.enum';

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

    @IsString()
    role: Role;
}
