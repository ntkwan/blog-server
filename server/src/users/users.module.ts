import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { CreateDto } from './dtos/user-signup.dto';

@Module({
    imports: [SequelizeModule.forFeature([User]), CreateDto],
    providers: [UsersService],
    exports: [UsersService, CreateDto],
})
export class UsersModule {}
