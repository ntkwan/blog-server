import { Injectable } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class AppService {
    constructor(private sequelize: Sequelize) {}

    async getStatus() {
        try {
            await this.sequelize.authenticate();
            return {
                status: 'ok',
            };
        } catch (error) {
            return {
                statusCode: 500,
                error: error.message,
            };
        }
    }
}
