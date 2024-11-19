import { Column, Model, Table, PrimaryKey, ForeignKey, AutoIncrement, CreatedAt, DataType } from 'sequelize-typescript';

import { Avatar } from '../../avatar/model/avatar.model';
import { ProfileStatus } from '../toolkit/profile_status.enum';

@Table
export class Player extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => Avatar)
    @Column({
        type: DataType.NUMBER,
    })
    avatar_id: number;

    @Column({
        type: DataType.BLOB,
    })
    avatar_custom: Buffer;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    pseudo: string;

    @Column({
        type: DataType.ENUM,
        values: [...typeof ProfileStatus],
        allowNull: false,
        defaultValue: ProfileStatus.AVAILABLE,
    })
    profileStatus: ProfileStatus;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    firstName: string;

    @Column({
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
        type: DataType.STRING,
        allowNull: false,
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
        type: DataType.STRING,
        allowNull: false,
    })
    country: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    banned: boolean;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    createdAt: Date;
}

// CREATE TABLE player (
//     ID SERIAL PRIMARY KEY,
//     avatar_id INT,
//     avatar_custom BYTEA,
//     pseudo VARCHAR(255) NOT NULL UNIQUE,
//     profile_status VARCHAR(255) NOT NULL,
//     first_name VARCHAR(255) NOT NULL,
//     last_name VARCHAR(255) NOT NULL,
//     birthdate DATE NOT NULL,
//     phone_number VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     country VARCHAR(255) NOT NULL,
//     banned BOOLEAN NOT NULL,
//     created_at TIMESTAMP NOT NULL,
//     CONSTRAINT fk_avatar
//         FOREIGN KEY (avatar_id)
//         REFERENCES avatar(ID)
// );