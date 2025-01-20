import { APP_PIPE } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'node:crypto';
import * as request from 'supertest';
import * as dayjs from 'dayjs';
import * as dotenv from 'dotenv';
dotenv.config();

import { AuthGuard } from '../src/domain/toolkit/guard/auth.guard';
import { CreatorSessionGuard } from '../src/domain/toolkit/guard/creator_session.guard';
import { Game } from '../src/domain/game/model/game.model';
import { GAME_DESCRIPTION_MIN_LENGTH, GAME_NAME_MIN_LENGTH } from '../src/domain/game/validation/validation.config';
import { Player } from '../src/domain/player/model/player.model';
import { GameSession } from '../src/domain/game_session/model/game_session.model';
import { GameSessionService  } from '../src/domain/game_session/service/game_session.service';
import { GameSessionPlayer } from '../src/domain/game_session/model/game_session_player.model';
import { GameSessionPlayerService } from '../src/domain/game_session/service/game_session_player.service';
import { GameSessionPlayerDto } from '../src/domain/game_session/dto/game_session_player.dto';
import { GameSessionController } from '../src/domain/game_session/controller/game_session.controller';

describe('GameSessionController', () => {
    let sequelize: Sequelize;
    let app: INestApplication;
    let gameSessionId: UUID;

    const mockLoggerService = {
        log: jest.fn(),
        warn: jest.fn(),
    };

    const mockGuard = {
        canActivate: jest.fn().mockResolvedValue(true),
    };

    beforeAll(async () => {
        const moduleTest = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRoot({
                    dialect: process.env.DATABASE_DIALECT as Dialect,
                    host: process.env.DATABASE_HOST,
                    port: +process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: process.env.DATABASE_PASSWORD,
                    database: process.env.DATABASE_TEST_NAME,
                    logging: false,
                    models: [GameSession, GameSessionPlayer, Player, Game],
                }),
                SequelizeModule.forFeature([GameSession, GameSessionPlayer]),
            ],
            controllers: [
                GameSessionController,
            ],
            providers: [
                JwtService,
                ConfigService,
                GameSessionService,
                GameSessionPlayerService,
                {
                    provide: WINSTON_MODULE_NEST_PROVIDER,
                    useValue: mockLoggerService,
                },
                {
                    provide: APP_PIPE,
                    useValue: new ValidationPipe(),
                },
            ],
        })
        .overrideGuard(AuthGuard)
        .useValue(mockGuard)
        .overrideGuard(CreatorSessionGuard)
        .useValue(mockGuard)
        .compile();

        app = moduleTest.createNestApplication();
        await app.init();

        sequelize = moduleTest.get<Sequelize>(Sequelize);

        await sequelize.getRepository(GameSession).sync({ force: true });
        await sequelize.getRepository(GameSessionPlayer).sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
        await app.close();
    });

    describe('Create', () => {
        it('Should create a game session model and return it with status 201', async () => {
            const player = new GameSessionPlayerDto();
            player.playerId = '6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66';

            const startDate = dayjs();
            const endDate = startDate.add(1, 'hour');

            const createGameSession = {
                id: uuidv4(),
                organizerId: 'b2cb079f-e330-4f3a-b071-46b8da8f6ab6',
                gameId: 'ca5044d5-739b-4ef7-b705-11d8d1d088f4',
                name: 'Game Session',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                description: 'Super Game Session',
                chatRoom: 'https://chat.room.exemple.com',
                gameSessionPlayers: [
                    player,
                ],
            };

            const result = await request(app.getHttpServer()).post('/game_session')
                                                             .send(createGameSession)
                                                             .expect(201);

            expect(result.body.id).toBe(createGameSession.id);
            expect(result.body.organizerId).toBe(createGameSession.organizerId);
            expect(result.body.gameId).toBe(createGameSession.gameId);
            expect(result.body.name).toBe(createGameSession.name);
            expect(result.body.startDate).toBe(createGameSession.startDate);
            expect(result.body.endDate).toBe(createGameSession.endDate);
            expect(result.body.description).toBe(createGameSession.description);
            expect(result.body.chatRoom).toBe(createGameSession.chatRoom);

            gameSessionId = result.body.id;
        });

        it('Should failed cause errors and return 404', async () => {
            const fakePlayerUUID = uuidv4();
            const fakeGameUUID = uuidv4();
            const fakeOrganizerUUID = uuidv4();

            const player = new GameSessionPlayerDto();
            player.playerId = fakePlayerUUID;

            const startDate = dayjs();
            const endDate = startDate.add(1, 'hour');

            const createGameSession = {
                id: uuidv4(),
                organizerId: fakeOrganizerUUID,
                gameId: fakeGameUUID,
                name: 'LO',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                description: 'LO',
                chatRoom: 'http://chat.room.exemple.com',
                gameSessionPlayers: [
                    player,
                ],
            };

            const result = await request(app.getHttpServer()).post('/game_session')
                                                             .send(createGameSession)
                                                             .expect(400);

            expect(result.body.message.length).toBe(6);
            expect(result.body.message).toContain(`This resource with the gameId ${fakeGameUUID} doesn't exists`);
            expect(result.body.message).toContain(`This resource with the organizerId ${fakeOrganizerUUID} doesn't exists`);
            expect(result.body.message).toContain(`name must be longer than or equal to ${GAME_NAME_MIN_LENGTH} characters`);
            expect(result.body.message).toContain(`description must be longer than or equal to ${GAME_DESCRIPTION_MIN_LENGTH} characters`);
            expect(result.body.message).toContain('chatRoom must be a URL address');
            expect(result.body.message).toContain(`gameSessionPlayers.0.This resource with the playerId ${fakePlayerUUID} doesn't exists`);
        });
    });

    describe('Update', () => {
        it('Should update a game session model and return it with status 200', async () => {
            const player = new GameSessionPlayerDto();
            player.playerId = '6a49ff96-63e2-4c5e-9b25-c5e3a7a59f66';

            const startDate = dayjs().add(1, 'day');
            const endDate = startDate.add(1, 'hour');

            const updateGameSession = {
                organizerId: 'b2cb079f-e330-4f3a-b071-46b8da8f6ab6',
                gameId: 'dd36f115-36d6-4707-a473-cce0270ee46f',
                name: 'Session Updated',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                description: 'Super Game Session Updated',
                chatRoom: 'https://chat.room.exemple.updated.com',
            };

            const result = await request(app.getHttpServer()).put(`/game_session/${gameSessionId}`)
                                                             .send(updateGameSession)
                                                             .expect(200);

            expect(result.body[0]).toBe(1);
            expect(result.body[1][0].id).toBe(gameSessionId);
            expect(result.body[1][0].organizerId).toBe(updateGameSession.organizerId);
            expect(result.body[1][0].gameId).toBe(updateGameSession.gameId);
            expect(result.body[1][0].name).toBe(updateGameSession.name);
            expect(result.body[1][0].startDate).toBe(updateGameSession.startDate);
            expect(result.body[1][0].endDate).toBe(updateGameSession.endDate);
            expect(result.body[1][0].description).toBe(updateGameSession.description);
            expect(result.body[1][0].chatRoom).toBe(updateGameSession.chatRoom);
        });

        // it('should failed cause errors', async () => {
        //     const fakePlayerUUID = uuidv4();
        //     const fakeGameUUID = uuidv4();
        //     const fakeOrganizerUUID = uuidv4();

        //     const player = new GameSessionPlayerDto();
        //     player.playerId = fakePlayerUUID;

        //     const createGameSession = {
        //         id: uuidv4(),
        //         organizerId: fakeOrganizerUUID,
        //         gameId: fakeGameUUID,
        //         name: 'LO',
        //         startDate: dayjs().toISOString(),
        //         endDate: dayjs().add(1, 'hour').toISOString(),
        //         description: 'LO',
        //         chatRoom: 'http://chat.room.exemple.com',
        //         gameSessionPlayers: [
        //             player,
        //         ],
        //     };

        //     const result = await request(app.getHttpServer()).post('/game_session')
        //                                                      .send(createGameSession)
        //                                                      .expect(400);

        //     expect(result.body.message.length).toBe(6);
        //     expect(result.body.message).toContain(`This resource with the gameId ${fakeGameUUID} doesn't exists`);
        //     expect(result.body.message).toContain(`This resource with the organizerId ${fakeOrganizerUUID} doesn't exists`);
        //     expect(result.body.message).toContain(`name must be longer than or equal to ${GAME_NAME_MIN_LENGTH} characters`);
        //     expect(result.body.message).toContain(`description must be longer than or equal to ${GAME_DESCRIPTION_MIN_LENGTH} characters`);
        //     expect(result.body.message).toContain('chatRoom must be a URL address');
        //     expect(result.body.message).toContain(`gameSessionPlayers.0.This resource with the playerId ${fakePlayerUUID} doesn't exists`);
        // });
    });
});