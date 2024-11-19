import { Model, Table, Column, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';

import { Player } from './player.model';

@Table
export class FavoritePlayer extends Model {
    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    player_id: number;

    @PrimaryKey
    @ForeignKey(() => Player)
    @Column({
        type: DataType.NUMBER,
        unique: true,
        allowNull: false,
    })
    favority_player_id: number;
}

// CREATE TABLE favorite_player (
//     player_id INT,
//     favorite_player_id INT,
//     PRIMARY KEY (player_id, favorite_player_id),
//     CONSTRAINT fk_player
//         FOREIGN KEY (player_id)
//         REFERENCES player(ID),
//     CONSTRAINT fk_favorite_player
//         FOREIGN KEY (favorite_player_id)
//         REFERENCES player(ID)
// );