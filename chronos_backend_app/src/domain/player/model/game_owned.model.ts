import { Model, Table, Column, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Game } from '../../game/model/game.model';
import { Player } from './player.model';

@Table({ tableName: 'game_owned', timestamps: false })
export class GameOwned extends Model {
    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        field: 'player_id',
        type: DataType.UUID,
        allowNull: false,
    })
    playerId: UUID;

    @PrimaryKey
    @ForeignKey(() => Game)
    @Column({
        field: 'game_id',
        type: DataType.UUID,
        allowNull: false,
    })
    gameId: UUID;
}