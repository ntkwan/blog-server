import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
    @IsNotEmpty({ message: 'Username cannot be empty' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString()
    password: string;
}
