import { Column, Model, Table, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table
export class Avatar extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @Column
    name: string;

    @Column
    photo: Buffer;
}

// CREATE TABLE avatar (
//     ID SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL UNIQUE,
//     photo BYTEA UNIQUE
// );