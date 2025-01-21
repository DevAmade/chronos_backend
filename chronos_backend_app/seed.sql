-- Insertion dans la table avatar
INSERT INTO avatar (id, name, photo)
VALUES 
    ('e23a8db7-7c9f-4b76-9cfa-92a716d90b6b', 'Avatar 1', decode('89504e470d0a1a0a0000000d4948445200000020000000200806000000ff5f7c280000097048597300000b1300000b1301009a9c13000000000474524e5300a00a0000', 'hex')),
    ('cb15f0e4-17e7-4e82-a07e-575e6cfc10a1', 'Avatar 2', decode('89504e470d0a1a0a0000000d4948445200000020000000200806000000ff5f7c280000097048597300000b1300000b1301009a9c13000000000474524e5300a00a0000', 'hex'));

-- Insertion dans la table editor
INSERT INTO editor (id, name)
VALUES 
    ('6be65b6c-684e-4d1b-9d2a-19e1a94c1e8f', 'Editor 1'),
    ('497f10ca-5a61-4fe6-b68f-f6f90b2c2bb0', 'Editor 2');

-- Insertion dans la table game
INSERT INTO game (id, editor_id, name, description, min_number_players, max_number_players, pegi)
VALUES 
    ('ca5044d5-739b-4ef7-b705-11d8d1d088f4', '6be65b6c-684e-4d1b-9d2a-19e1a94c1e8f', 'Game 1', 'A cool game', 1, 4, 18),
    ('dd36f115-36d6-4707-a473-cce0270ee46f', '497f10ca-5a61-4fe6-b68f-f6f90b2c2bb0', 'Game 2', 'Another fun game', 2, 6, 12),
    ('e685c081-bbb6-43d0-8cd8-efddcfa2a177', '6be65b6c-684e-4d1b-9d2a-19e1a94c1e8f', 'Game 3', 'Another +1 fun game', 2, 2, 12);

-- Insertion dans la table player
INSERT INTO player (id, avatar_id, pseudo, profile_status, first_name, last_name, birthdate, phone_number, email, password, banned, created_at, updated_at)
VALUES 
    ('b2cb079f-e330-4f3a-b071-46b8da8f6ab6', 'e23a8db7-7c9f-4b76-9cfa-92a716d90b6b', 'Player1', 'AVAILABLE', 'John', 'Doe', '1990-01-01', '+33667489034', 'player1@example.com', 'password', FALSE, NOW(), NOW()),
    ('6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66', 'cb15f0e4-17e7-4e82-a07e-575e6cfc10a1', 'Player2', 'AVAILABLE', 'Jane', 'Smith', '1992-02-02', '+33629087843', 'player2@example.com', 'password', FALSE, NOW(), NOW()),
    ('33affecd-7c5b-4bd6-85e4-74b28d498e0e', 'cb15f0e4-17e7-4e82-a07e-575e6cfc10a1', 'Player3', 'AVAILABLE', 'Jack', 'Duncan', '2020-07-26', '+33689093456', 'player3@example.com', 'password', FALSE, NOW(), NOW()),
    ('205e4da5-dd67-4938-ae2c-5325a42d5c5b', 'e23a8db7-7c9f-4b76-9cfa-92a716d90b6b', 'Player4', 'AVAILABLE', 'Donald', 'Trump', '2021-09-11', '+33690876543', 'player4@example.com', 'password', FALSE, NOW(), NOW());

-- Insertion dans la table game_session
INSERT INTO game_session (id, organizer_id, game_id, name, start_date, end_date, description, chat_room, created_at, updated_at)
VALUES 
    ('10f9fe23-13b8-4334-9447-e455d990c4ef', 'b2cb079f-e330-4f3a-b071-46b8da8f6ab6', 'ca5044d5-739b-4ef7-b705-11d8d1d088f4', 'Session 1', NOW(), NOW() + INTERVAL '1 hour', 'A fun session', 'https://chat_room_1/', NOW(), NOW()),
    ('8235b26e-9874-497f-960d-6a7e3ebbf324', '6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66', 'dd36f115-36d6-4707-a473-cce0270ee46f', 'Session 2', NOW(), NOW() + INTERVAL '1 hour', 'Another fun session', 'https://chat_room_2/', NOW(), NOW());

-- Insertion dans la table game_owned
INSERT INTO game_owned (player_id, game_id)
VALUES 
    ('b2cb079f-e330-4f3a-b071-46b8da8f6ab6', 'ca5044d5-739b-4ef7-b705-11d8d1d088f4'),
    ('6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66', 'dd36f115-36d6-4707-a473-cce0270ee46f');

-- Insertion dans la table favorite_player
INSERT INTO favorite_player (player_id, favorite_player_id)
VALUES 
    ('b2cb079f-e330-4f3a-b071-46b8da8f6ab6', '6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66'),
    ('6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66', 'b2cb079f-e330-4f3a-b071-46b8da8f6ab6');

-- Insertion dans la table game_session_player
INSERT INTO game_session_player (game_session_id, player_id)
VALUES 
    ('10f9fe23-13b8-4334-9447-e455d990c4ef', 'b2cb079f-e330-4f3a-b071-46b8da8f6ab6'),
    ('8235b26e-9874-497f-960d-6a7e3ebbf324', '6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66');

-- Insertion dans la table admin
INSERT INTO admin (id, avatar_id, pseudo, password, created_at, updated_at)
VALUES 
    ('1a0bfe94-e5b4-4bc9-b6c4-0c789ed0d9c7', 'e23a8db7-7c9f-4b76-9cfa-92a716d90b6b', 'Admin1', 'password', NOW(), NOW());

-- Insertion dans la table game_media
INSERT INTO game_media (id, game_id, photo)
VALUES 
    ('e0fdc7b7-f320-4622-9a18-bd18ea90d71a', 'ca5044d5-739b-4ef7-b705-11d8d1d088f4', decode('89504e470d0a1a0a0000000d4948445200000020000000200806000000ff5f7c280000097048597300000b1300000b1301009a9c13000000000474524e5300a00a0000', 'hex'));

-- Insertion dans la table player_media
INSERT INTO player_media (id, player_id, photo)
VALUES 
    ('fbd8368f-1fd9-452b-87c0-46a640a558ad', 'b2cb079f-e330-4f3a-b071-46b8da8f6ab6', decode('89504e470d0a1a0a0000000d4948445200000020000000200806000000ff5f7c280000097048597300000b1300000b1301009a9c13000000000474524e5300a00a0000', 'hex'));

-- Insertion dans la table admin_media
INSERT INTO admin_media (id, admin_id, photo)
VALUES 
    ('b307ec9b-e501-4161-b47e-e5c8b05f0f99', '1a0bfe94-e5b4-4bc9-b6c4-0c789ed0d9c7', decode('89504e470d0a1a0a0000000d4948445200000020000000200806000000ff5f7c280000097048597300000b1300000b1301009a9c13000000000474524e5300a00a0000', 'hex'));
