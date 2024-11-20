import { ApiProperty } from '@nestjs/swagger';

export class CredEntity {
    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;
}
