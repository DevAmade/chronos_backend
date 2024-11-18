import { Column, Model, Table, PrimaryKey, ForeignKey, AutoIncrement, CreatedAt } from 'sequelize-typescript';

import { Player } from '../../player/entity/player.entity';
import { Game } from '../../game/entity/game.entity';

@Table
export class GameSession extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => Player)
    @Column
    organizer_id: number;

    @ForeignKey(() => Game)
    @Column
    game_id: number;

    @Column
    name: number;

    @Column
    startDate: Date;

    @Column
    endDate: Date;

    @Column
    description: string;

    @Column
    chatRoom: string;

    @CreatedAt
    @Column
    createdAt: Date;
}

// CREATE TABLE game_session (
//     ID SERIAL PRIMARY KEY,
//     organizer_id INT NOT NULL,
//     game_id INT NOT NULL,
//     name VARCHAR(255) NOT NULL,
//     start_date TIMESTAMP NOT NULL,
//     end_date TIMESTAMP NOT NULL,
//     description VARCHAR(255),
//     chat_room VARCHAR(255),
//     created_at TIMESTAMP NOT NULL,
//     CONSTRAINT fk_organizer
//         FOREIGN KEY (organizer_id)
//         REFERENCES player(ID),
//     CONSTRAINT fk_game
//         FOREIGN KEY (game_id)
//         REFERENCES game(ID)
// );