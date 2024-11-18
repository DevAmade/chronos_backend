import { Column, Model, Table, PrimaryKey, ForeignKey, AutoIncrement, CreatedAt } from 'sequelize-typescript';

import { Avatar } from '../../avatar/entity/avatar.entity';

@Table
export class Admin extends Model {
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

    @Column
    password: string;

    @CreatedAt
    @Column
    createdAt: Date;
}

// CREATE TABLE admin (
//     ID SERIAL PRIMARY KEY,
//     avatar_id INT,
//     avatar_custom BYTEA,
//     pseudo VARCHAR(255) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP NOT NULL,
//     CONSTRAINT fk_avatar
//         FOREIGN KEY (avatar_id)
//         REFERENCES avatar(ID)
// );