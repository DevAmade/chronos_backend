import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

@Table({ tableName: 'avatar', timestamps: false })
export class Avatar extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
    })
    id: UUID;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.BLOB,
        unique: true,
        allowNull: false,
    })
    photo: Buffer;
}