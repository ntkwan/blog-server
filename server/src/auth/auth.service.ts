import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { CreateDto } from '../users/dtos/user-signup.dto';
import { UserLoginDto } from '../users/dtos/user-login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }

        const isValidPassword = await this.usersService.validatePassword(
            password,
            user,
        );

        if (!isValidPassword) {
            return null;
        }

        return user;
    }

    public async signIn(user: UserLoginDto): Promise<any> {
        try {
            const payloadAccessToken = {
                id: user.id,
                username: user.username,
                role: user.role,
            };

            const accessToken =
                await this.jwtService.signAsync(payloadAccessToken);

            const payloadRefreshToken = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };

            const refreshToken = await this.jwtService.signAsync(
                payloadRefreshToken,
                {
                    secret: this.configService.get('RT_SECRET'),
                    expiresIn: '7d',
                },
            );

            await this.usersService.updateRefreshToken(user.id, refreshToken);
            //await this.usersService.updateOtp(user.id, null, null);

            return {
                refreshToken,
                accessToken,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    public async signUp(user: CreateDto): Promise<User> {
        try {
            const newUser = await this.usersService.create(user);
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException('Error signing up', {
                cause: error.message,
            });
        }
    }

    public async logOut(user: any): Promise<void> {
        try {
            await this.usersService.updateRefreshToken(user.id, null);
        } catch (error) {
            throw new InternalServerErrorException('Error logging out', {
                cause: error.message,
            });
        }
    }

    public async getNewTokens(id: string, refreshToken: string): Promise<any> {
        try {
            const user = await this.usersService.findById(id);
            if (!user) {
                throw new BadRequestException('User not found');
            }

            if (user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            const payloadAccessToken = {
                id: user.id,
                username: user.username,
                role: user.role,
            };

            const newAT = await this.jwtService.signAsync(payloadAccessToken);

            const payloadRefreshToken = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };

            const newRT = await this.jwtService.signAsync(payloadRefreshToken, {
                secret: this.configService.get('RT_SECRET'),
                expiresIn: '7d',
            });

            await this.usersService.updateRefreshToken(user.id, newRT);

            return {
                refreshToken: newRT,
                accessToken: newAT,
            };
        } catch (error) {
            throw new InternalServerErrorException('Error refreshing token', {
                cause: error.message,
            });
        }
    }

    public async forgotPassword(email: string): Promise<void> {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) throw new NotFoundException('User not found');

            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

            await this.usersService.updateOtp(email, otp, otpExpiry);

            await this.mailerService.sendMail({
                to: email,
                subject: '[NO-REPLY] Reset Password OTP',
                text: `Please do not reply this message. \n Your OTP is: ${otp}`,
            });

            return;
        } catch (error) {
            throw new InternalServerErrorException(error.message, {
                cause: error.message,
            });
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(+this.configService.get('SALT'));
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async resetPassword(
        email: string,
        otp: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<void> {
        try {
            if (newPassword !== confirmPassword) {
                throw new BadRequestException('Passwords do not match');
            }

            const user = await this.usersService.findByOtpOnly(email, otp);

            if (!user) throw new BadRequestException('Invalid or expired OTP');

            const currentTime = new Date();
            if (currentTime > user.otpExpiry) {
                throw new BadRequestException('OTP expired');
            }

            const hashedPassword = await this.hashPassword(newPassword);
            await this.usersService.updateOtp(email, null, null); // Clear OTP
            await this.usersService.updatePassword(email, hashedPassword);
            return;
        } catch (error) {
            throw new InternalServerErrorException(error.message, {
                cause: error.message,
            });
        }
    }

    async changeRole(user: User, id: string, role: string): Promise<void> {
        try {
            if (user.id === id) {
                throw new BadRequestException('Cannot change your own role');
            }

            await this.usersService.updateRole(id, role);
        } catch (error) {
            console.log(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }
}
