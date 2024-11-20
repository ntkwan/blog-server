import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'articles',
    timestamps: true,
})
export class Article extends Model<Article> {
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
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    author: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    updatedAt: Date;
}
