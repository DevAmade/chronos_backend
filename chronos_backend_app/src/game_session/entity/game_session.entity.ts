import { Column, Model, Table, PrimaryKey, ForeignKey, AutoIncrement, CreatedAt, DataType } from 'sequelize-typescript';

import { Player } from '../../player/entity/player.entity';
import { Game } from '../../game/entity/game.entity';

@Table
export class GameSession extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    id: number;

    @ForeignKey(() => Player)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    organizer_id: number;

    @ForeignKey(() => Game)
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    game_id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    startDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    endDate: Date;

    @Column({
        type: DataType.STRING,
    })
    description: string;

    @Column({
        type: DataType.STRING,
    })
    chatRoom: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
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