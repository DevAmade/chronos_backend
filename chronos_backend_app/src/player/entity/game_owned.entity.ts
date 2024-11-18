import { Model, Table, Column, PrimaryKey, ForeignKey } from 'sequelize-typescript';

import { Game } from '../../game/entity/game.entity';
import { Player } from './player.entity';

@Table
export class GameOwned extends Model {
    @PrimaryKey
    @ForeignKey(() => Player)
    @Column
    player_id: number;

    @PrimaryKey
    @ForeignKey(() => Game)
    @Column
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