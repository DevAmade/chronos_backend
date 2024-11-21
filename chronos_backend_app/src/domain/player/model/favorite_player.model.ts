import { Model, Table, Column, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';
import { UUID } from 'node:crypto';

import { Player } from './player.model';

@Table({ tableName: 'favorite_player', timestamps: false })
export class FavoritePlayer extends Model {
    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        field: 'player_id',
        type: DataType.UUID,
        allowNull: false,
    })
    playerId: UUID;

    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        field: 'favorite_player_id',
        type: DataType.UUID,
        allowNull: false,
    })
    favoritePlayerId: UUID;
}