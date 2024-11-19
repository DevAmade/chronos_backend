import { Model, Table, Column, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';

import { Game } from '../../game/model/game.model';
import { Player } from './player.model';

@Table
export class GameOwned extends Model {
    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    player_id: number;

    @PrimaryKey
    @ForeignKey(() => Game)
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    game_id: number;
}

// CREATE TABLE game_owned (
//     player_id INT,
//     game_id INT,
//     PRIMARY KEY (player_id, game_id),
//     CONSTRAINT fk_player
//         FOREIGN KEY (player_id)
//         REFERENCES player(ID),
//     CONSTRAINT fk_game
//         FOREIGN KEY (game_id)
//         REFERENCES game(ID)
// );