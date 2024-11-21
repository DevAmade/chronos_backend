import { Column, Model, Table, PrimaryKey, ForeignKey, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Player } from '../../player/model/player.model';
import { Game } from '../../game/model/game.model';

@Table({ tableName: 'game_session' })
export class GameSession extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
    })
    id: UUID;

    @ForeignKey(() => Player)
    @Column({
        field: 'organizer_id',
        type: DataType.UUID,
        allowNull: false,
    })
    organizerId: UUID;

    @ForeignKey(() => Game)
    @Column({
        field: 'game_id',
        type: DataType.UUID,
        allowNull: false,
    })
    gameId: UUID;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        field: 'start_date',
        type: DataType.DATE,
        allowNull: false,
    })
    startDate: Date;

    @Column({
        field: 'end_date',
        type: DataType.DATE,
        allowNull: false,
    })
    endDate: Date;

    @Column({
        type: DataType.STRING,
    })
    description: string;

    @Column({
        field: 'chat_room',
        type: DataType.STRING,
    })
    chatRoom: string;

    @CreatedAt
    @Column({
        field: 'created_at',
        type: DataType.DATE,
        allowNull: false,
    })
    createdAt: Date;

    @UpdatedAt
    @Column({
        field: 'updated_at',
        type: DataType.DATE,
        allowNull: false,
    })
    updatedAt: Date;
}