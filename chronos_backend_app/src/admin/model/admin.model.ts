import { Column, Model, Table, PrimaryKey, ForeignKey, AutoIncrement, CreatedAt, DataType } from 'sequelize-typescript';

import { Avatar } from '../../avatar/model/avatar.model';

@Table
export class Admin extends Model {
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
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
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