import { Injectable } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class AppService {
    constructor(private sequelize: Sequelize) {}

    @ApiOperation({ summary: 'Check the status of the server' })
    @ApiResponse({
        status: 200,
        description: 'Server is running',
        schema: {
            example: {
                status: 'ok',
            },
        },
    })
    async getStatus() {
        try {
            await this.sequelize.authenticate();
            return {
                status: 'ok',
            };
        } catch (error) {
            return {
                status: 'error',
                error: error.message,
            };
        }
    }
}
