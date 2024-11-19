import { Column, Model, Table, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';

@Table
export class Avatar extends Model {
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
        allowNull: false,
    })
    photo: Buffer;
}

// CREATE TABLE avatar (
//     ID SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL UNIQUE,
//     photo BYTEA NOT NULL UNIQUE
// );