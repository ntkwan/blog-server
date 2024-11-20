import {
    Column,
    Model,
    Table,
    Unique,
    DataType,
    CreatedAt,
    UpdatedAt,
    IsEmail,
} from 'sequelize-typescript';
import { Role } from '../../auth/roles.enum';

@Table({
    tableName: 'accounts',
    timestamps: true,
})
export class User extends Model {
    @Column({
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({
        type: DataType.STRING,
    })
    username: string;

    @Unique
    @IsEmail
    @Column({
        type: DataType.STRING,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        field: 'refresh_token',
    })
    refreshToken: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    otp: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    otpExpiry: Date;

    @Column({
        type: DataType.STRING,
    })
    role: Role;
}