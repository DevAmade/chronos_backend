-- Supprimer la base de données si elle existe
DROP DATABASE IF EXISTS chronos_database;

-- Créer la base de données de Chronos
CREATE DATABASE chronos_database;

-- Connexion à la base de données "chronos_database"
\c chronos_database;

-- Ajouter l'enum pour la colonne profile_status de la table player
CREATE TYPE STATUS AS ENUM (
    'AVAILABLE',
    'ABSENT',
    'NOT AVAILABLE',
    'DO NOT DISTURB',
    'OFFLINE'
);

-- Création de la table "avatar"
CREATE TABLE avatar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    photo BYTEA NOT NULL
);

-- Création de la table "editor"
CREATE TABLE editor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Création de la table "game"
CREATE TABLE game (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    editor_id UUID,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    min_number_players INT NOT NULL,
    max_number_players INT NOT NULL,
    pegi INT NOT NULL,
    CONSTRAINT fk_editor
        FOREIGN KEY (editor_id)
        REFERENCES editor(id)
);

-- Création de la table "player"
CREATE TABLE player (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_id UUID,
    pseudo VARCHAR(255) NOT NULL UNIQUE,
    profile_status STATUS NOT NULL DEFAULT 'AVAILABLE',
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birthdate DATE NOT NULL,
    phone_number VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    banned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_avatar
        FOREIGN KEY (avatar_id)
        REFERENCES avatar(id)
);

-- Création de la table "game_session"
CREATE TABLE game_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL,
    game_id UUID,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    description VARCHAR(255),
    chat_room VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_organizer
        FOREIGN KEY (organizer_id)
        REFERENCES player(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
);

-- Création de la table de table "team"
CREATE TABLE team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_session_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    chat_room VARCHAR(255),
    CONSTRAINT fk_game_session
        FOREIGN KEY (game_session_id)
        REFERENCES game_session(id)
        ON DELETE CASCADE
);

-- Création de la table de liaison "game_owned"
CREATE TABLE game_owned (
    player_id UUID,
    game_id UUID,
    PRIMARY KEY (player_id, game_id),
    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES player(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
        ON DELETE CASCADE
);

-- Création de la table de liaison "favorite_player"
CREATE TABLE favorite_player (
    player_id UUID,
    favorite_player_id UUID,
    PRIMARY KEY (player_id, favorite_player_id),
    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES player(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_favorite_player
        FOREIGN KEY (favorite_player_id)
        REFERENCES player(id)
        ON DELETE CASCADE
);

-- Création de la table de liaison "game_session_player"
CREATE TABLE game_session_player (
    game_session_id UUID,
    player_id UUID,
    team_id UUID,
    PRIMARY KEY (game_session_id, player_id),
    CONSTRAINT fk_game_session
        FOREIGN KEY (game_session_id)
        REFERENCES game_session(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES player(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_team
        FOREIGN KEY (team_id)
        REFERENCES team(id)
);

-- Création de la table "admin"
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_id UUID,
    pseudo VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_avatar
        FOREIGN KEY (avatar_id)
        REFERENCES avatar(id)
);

-- Création de la table "game media"
CREATE TABLE game_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL UNIQUE,
    photo BYTEA NOT NULL,
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES game(id)
        ON DELETE CASCADE
);

-- Création de la table "player media"
CREATE TABLE player_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL UNIQUE,
    photo BYTEA NOT NULL,
    CONSTRAINT fk_player
        FOREIGN KEY (player_id)
        REFERENCES player(id)
        ON DELETE CASCADE
);

-- Création de la table "admin media"
CREATE TABLE admin_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL UNIQUE,
    photo BYTEA NOT NULL,
    CONSTRAINT fk_admin
        FOREIGN KEY (admin_id)
        REFERENCES admin(id)
        ON DELETE CASCADE
);