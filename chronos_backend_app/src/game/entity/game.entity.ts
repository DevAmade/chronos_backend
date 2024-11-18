import { Column, Model, Table, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class Game extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    name: string;

    @Column
    cover_photo: Buffer;

    @Column
    editor: string;

    @Column
    description: string;

    @Column
    minNumberPlayers: number;

    @Column
    maxNumberPlayers: number;

    @Column
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