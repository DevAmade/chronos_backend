import { Column, Model, Table, PrimaryKey, DataType, ForeignKey } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Editor } from '../../editor/model/editor.model';

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

    @ForeignKey(() => Editor)
    @Column({
        field: 'editor_id',
        type: DataType.UUID,
        allowNull: false,
    })
    editorId: UUID;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    name: string;

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
    pegi: number;
}