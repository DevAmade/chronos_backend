import { Column, Model, Table, PrimaryKey, ForeignKey, AutoIncrement, CreatedAt } from 'sequelize-typescript';

import { Avatar } from '../../avatar/entity/avatar.entity';
import { ProfileStatus } from '../profile_status.enum';

@Table
export class Player extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => Avatar)
    @Column
    avatar_id: number;

    @Column
    avatar_custom: Buffer;

    @Column
    pseudo: string;

    @Column({ defaultValue: ProfileStatus.AVAILABLE })
    profileStatus: ProfileStatus;

    @Column
    firstName: string;

    @Column
    lastName: string;

    @Column
    birthdate: Date;

    @Column
    phoneNumber: string;

    @Column
    email: string;

    @Column
    password: string;

    @Column
    country: string;

    @Column({ defaultValue: false })
    banned: boolean;

    @CreatedAt
    @Column
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