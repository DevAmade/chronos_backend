import { Column, Model, Table, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

@Table
export class Game extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.BLOB,
        unique: true,
    })
    cover_photo: Buffer;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    editor: string;

    @Column({
        type: DataType.STRING,
    })
    description: string;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    minNumberPlayers: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    maxNumberPlayers: number;

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    PEGI: number;
}

// CREATE TABLE game (
//     ID SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL UNIQUE,
//     cover_photo BYTEA UNIQUE,
//     editor VARCHAR(255) NOT NULL,
//     description VARCHAR(255),
//     min_number_players INT NOT NULL,
//     max_number_players INT NOT NULL,
//     PEGI INT NOT NULL
// );