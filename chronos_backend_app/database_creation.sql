-- Créer la base de données de Chronos
CREATE DATABASE chronos_database;

-- Connexion à la base de données "chronos_database"
\c chronos_database;

-- Création de la table "game"
CREATE TABLE game (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    cover_photo BYTEA UNIQUE,
    editor VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    min_number_players INT NOT NULL,
    max_number_players INT NOT NULL,
    PEGI INT NOT NULL
);

-- Création de la table "avatar"
CREATE TABLE avatar (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    photo BYTEA NOT NULL UNIQUE
);

-- Création de la table "player"
CREATE TABLE player (
    id UUID PRIMARY KEY,
    avatar_id UUID,
    avatar_custom BYTEA,
    pseudo VARCHAR(255) NOT NULL UNIQUE,
    profile_status VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    banned BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_avatar
        FOREIGN KEY (avatar_id)
        REFERENCES avatar(id)
);

-- Création de la table "game_session"
CREATE TABLE game_session (
    id UUID PRIMARY KEY,
    organizer_id UUID NOT NULL,
    game_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    description VARCHAR(255),
    chat_room VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_organizer
        FOREIGN KEY (organizer_id)
        REFERENCES player(id),
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
);

-- Création de la table de liaison "game_owned"
CREATE TABLE game_owned (
    player_id UUID,
    game_id UUID,
    PRIMARY KEY (player_id, game_id),
    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES player(id),
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
);

-- Création de la table de liaison "favorite_player"
CREATE TABLE favorite_player (
    player_id UUID,
    favorite_player_id UUID,
    PRIMARY KEY (player_id, favorite_player_id),
    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES player(id),
    CONSTRAINT fk_favorite_player
        FOREIGN KEY (favorite_player_id)
        REFERENCES player(id)
);

-- Création de la table de liaison "game_session_player"
CREATE TABLE game_session_player (
    game_session_id UUID,
    game_session_player_id UUID,
    PRIMARY KEY (game_session_id, game_session_player_id),
    CONSTRAINT fk_game_session
        FOREIGN KEY (game_session_id)
        REFERENCES game_session(id),
    CONSTRAINT fk_game_session_player
        FOREIGN KEY (game_session_player_id)
        REFERENCES player(id)
);

-- Création de la table "admin"
CREATE TABLE admin (
    id UUID PRIMARY KEY,
    avatar_id UUID,
    avatar_custom BYTEA,
    pseudo VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_avatar
        FOREIGN KEY (avatar_id)
        REFERENCES avatar(id)
);