import { Column, Model, Table, PrimaryKey, ForeignKey, CreatedAt, DataType, UpdatedAt } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Avatar } from '../../avatar/model/avatar.model';

@Table({ tableName: 'admin' })
export class Admin extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
    })
    id: UUID;

    @ForeignKey(() => Avatar)
    @Column({
        field: 'avatar_id',
        type: DataType.UUID,
    })
    avatarId: UUID;

    @Column({
        field: 'avatar_custom',
        type: DataType.BLOB,
    })
    avatarCustom: Buffer;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    pseudo: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @CreatedAt
    @Column({
        field: 'created_at',
        type: DataType.DATE,
        allowNull: false,
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at',
        type: DataType.DATE,
        allowNull: false,
    })
    updatedAt: Date;
}