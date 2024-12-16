import { Column, Model, Table, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Avatar } from '../../avatar/model/avatar.model';
import { ProfileStatus } from '../validation/profile_status.enum';

@Table({ tableName: 'player' })
export class Player extends Model {
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
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    pseudo: string;

    @Column({
        field: 'profile_status',
        type: DataType.ENUM,
        values: Object.values(ProfileStatus),
        allowNull: false,
        defaultValue: ProfileStatus.AVAILABLE,
    })
    profileStatus: ProfileStatus;

    @Column({
        field: 'first_name',
        type: DataType.STRING,
        allowNull: false,
    })
    firstName: string;

    @Column({
        field: 'last_name',
        type: DataType.STRING,
        allowNull: false,
    })
    lastName: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    birthdate: Date;

    @Column({
        field: 'phone_number',
        type: DataType.STRING,
    })
    phoneNumber: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    banned: boolean;

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