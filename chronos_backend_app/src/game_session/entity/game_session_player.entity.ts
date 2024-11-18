import { Model, Table, PrimaryKey, HasOne, ForeignKey, Column } from 'sequelize-typescript';

import { Player } from '../../player/entity/player.entity';
import { GameSession } from './game_session.entity';

@Table
export class GameSessionPlayer extends Model {
    @PrimaryKey
    @ForeignKey(() => GameSession)
    @Column
    game_session_id: number;

    @PrimaryKey
    @ForeignKey(() => Player)
    @Column
    game_session_player_id: number;
}

// CREATE TABLE game_session_player (
//     game_session_id INT,
//     game_session_player_id INT,
//     PRIMARY KEY (game_session_id, game_session_player_id),
//     CONSTRAINT fk_game_session
//         FOREIGN KEY (game_session_id)
//         REFERENCES game_session(ID),
//     CONSTRAINT fk_game_session_player
//         FOREIGN KEY (game_session_player_id)
//         REFERENCES player(ID)
// );