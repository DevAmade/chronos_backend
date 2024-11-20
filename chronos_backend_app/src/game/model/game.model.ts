import { Column, Model, Table, PrimaryKey, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

@Table({ tableName: 'game', timestamps: false })
export class Game extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
    })
    id: UUID;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

    @Column({
        field: 'cover_photo',
        type: DataType.BLOB,
        unique: true,
    })
    coverPhoto: Buffer;

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
        field: 'min_number_players',
        type: DataType.NUMBER,
        allowNull: false,
    })
    minNumberPlayers: number;

    @Column({
        field: 'max_number_players',
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