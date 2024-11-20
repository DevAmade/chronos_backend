import { Column, Model, Table, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Player } from '../../player/model/player.model';
import { GameSession } from './game_session.model';

@Table({ tableName: 'game_session_player', timestamps: false })
export class GameSessionPlayer extends Model {
    @PrimaryKey
    @ForeignKey(() => GameSession)
    @Column({
        field: 'game_session_id',
        type: DataType.UUID,
        allowNull: false,
    })
    gameSessionId: UUID;

    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        field: 'game_session_player_id',
        type: DataType.UUID,
        allowNull: false,
    })
    gameSessionPlayerId: UUID;
}