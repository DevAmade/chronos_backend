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
import * as request from 'supertest';
import * as dayjs from 'dayjs';
import * as dotenv from 'dotenv';
dotenv.config();

import { AdminGuard } from '../src/domain/toolkit/guard/admin.guard';
import { PlayerGuard } from '../src/domain/toolkit/guard/player.guard';
import { Game } from '../src/domain/game/model/game.model';
import { Admin } from '../src/domain/admin/model/admin.model';
import { AdminService } from '../src/domain/admin/service/admin.service';
import { AdminController } from '../src/domain/admin/controller/admin.controller';
import { Player } from '../src/domain/player/model/player.model';
import { PlayerService } from '../src/domain/player/service/player.service';
import { PlayerController } from '../src/domain/player/controller/player.controller';
import { GameSession } from '../src/domain/game_session/model/game_session.model';
import { GameSessionService  } from '../src/domain/game_session/service/game_session.service';
import { GameSessionController } from '../src/domain/game_session/controller/game_session.controller';
import { GameSessionPlayer } from '../src/domain/game_session/model/game_session_player.model';
import { GameSessionPlayerService } from '../src/domain/game_session/service/game_session_player.service';
import { GameSessionPlayerDto } from '../src/domain/game_session/dto/game_session_player.dto';
import { GAME_SESSION_DESCRIPTION_MAX_LENGTH,
         GAME_SESSION_DESCRIPTION_MIN_LENGTH,
         GAME_SESSION_NAME_MAX_LENGTH,
         GAME_SESSION_NAME_MIN_LENGTH } from '../src/domain/game_session/validation/validation.config';

describe('GameSessionController', () => {
    let sequelize: Sequelize;
    let app: INestApplication;

    let organizerAuthToken: string;
    let playerAuthToken: string;
    let adminAuthToken: string;

    /*
    * Initialize general mock.
    */
    const mockPlayers = [
        {
            id: uuidv4(),
            pseudo: 'Player1',
            firstName: 'John',
            lastName: 'DOE',
            birthdate: dayjs('1987-04-03').toISOString(),
            email: 'john@doe.com',
            password: 'Azerty12345!',
        },
        {
            id: uuidv4(),
            pseudo: 'Player2',
            firstName: 'Jane',
            lastName: 'DOE',
            birthdate: dayjs('1956-09-05').toISOString(),
            email: 'jane@doe.com',
            password: 'Azerty12345!',
        },
        {
            id: uuidv4(),
            pseudo: 'Player3',
            firstName: 'Jack',
            lastName: 'DOE',
            birthdate: dayjs('1997-09-03').toISOString(),
            email: 'jack@doe.com',
            password: 'Azerty12345!',
        },
        {
            id: uuidv4(),
            pseudo: 'Player4',
            firstName: 'James',
            lastName: 'DOE',
            birthdate: dayjs('2020-09-05').toISOString(),
            email: 'james@doe.com',
            password: 'Azerty12345!',
        },
    ];

    const mockAdmin = {
        id: uuidv4(),
        pseudo: 'Admin1',
        password: 'Azerty12345!',
    };

    const mockGameSessionPlayer = new GameSessionPlayerDto();
    mockGameSessionPlayer.playerId = mockPlayers[1].id;

    const mockStartDate = dayjs();
    const mockEndDate = mockStartDate.add(1, 'hour');

    const mockGameSession = {
        id: uuidv4(),
        organizerId: mockPlayers[0].id,
        gameId: 'ca5044d5-739b-4ef7-b705-11d8d1d088f4',
        name: 'Game Session',
        startDate: mockStartDate.toISOString(),
        endDate: mockEndDate.toISOString(),
        description: 'Super Game Session',
        chatRoom: 'https://chat.room.exemple.com',
        gameSessionPlayers: [
            mockGameSessionPlayer,
        ],
    };

    const mockLoggerService = {
        log: jest.fn(),
        warn: jest.fn(),
    };

    /*
    * Is perfomed before playing the tests.
    */
    beforeAll(async () => {
 
        /*
        * Create a test module with a test database.
        */
        const moduleTest = await Test.createTestingModule({
            imports: [
                SequelizeModule.forRoot({
                    dialect: process.env.DATABASE_DIALECT as Dialect,
                    host: process.env.DATABASE_HOST,
                    port: +process.env.DATABASE_PORT,
                    username: process.env.DATABASE_USERNAME,
                    password: 'postgres',
                    database: process.env.DATABASE_TEST_NAME,
                    logging: false,
                    models: [GameSession, GameSessionPlayer, Player, Game, Admin],
                }),
                SequelizeModule.forFeature([GameSession, GameSessionPlayer, Player, Admin]),
            ],
            controllers: [
                GameSessionController,
                PlayerController,
                AdminController,
            ],
            providers: [
                JwtService,
                ConfigService,
                PlayerService,
                AdminService,
                GameSessionService,
                GameSessionPlayerService,
                AdminGuard,
                PlayerGuard,
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
        .compile();

        /*
        * Create a test application with the test module.
        */
        app = moduleTest.createNestApplication();
        await app.init();

        /*
        * Store the sequelize module in a variable.
        */
        sequelize = moduleTest.get<Sequelize>(Sequelize);

        /*
        * Clean up the relevant repositories.
        */
        await sequelize.getRepository(GameSession).sync({ force: true });
        await sequelize.getRepository(GameSessionPlayer).sync({ force: true });
        await sequelize.getRepository(Player).sync({ force: true });
        await sequelize.getRepository(Admin).sync({ force: true });

        /*
        * Insert mock players in test database.
        */
        mockPlayers.forEach(async player => {
            await request(app.getHttpServer()).post('/player')
                                              .send(player)
                                              .expect(201);
        });

        /*
        * Insert a mock admin in test database.
        */
        await request(app.getHttpServer()).post('/admin')
                                          .send(mockAdmin)
                                          .expect(201);

        /*
        * Send authentication request with credentials and store JWT in variables.
        */
        const authOrganizer = { email: mockPlayers[0].email, password: mockPlayers[0].password };
        const authPlayer = { email: mockPlayers[1].email, password: mockPlayers[1].password };
        const authAdmin = { pseudo: mockAdmin.pseudo, password: mockAdmin.password };

        const resultAuthOrganizer = await request(app.getHttpServer()).post('/player/auth')
                                                                      .send(authOrganizer)
                                                                      .expect(201);
                                                                      
        const resultAuthPlayer = await request(app.getHttpServer()).post('/player/auth')
                                                                   .send(authPlayer)
                                                                   .expect(201);

        const resultAuthAdmin = await request(app.getHttpServer()).post('/admin/auth')
                                                                  .send(authAdmin)
                                                                  .expect(201);
        
        organizerAuthToken = `Bearer ${resultAuthOrganizer.body.token}`;
        playerAuthToken = `Bearer ${resultAuthPlayer.body.token}`;
        adminAuthToken = `Bearer ${resultAuthAdmin.body.token}`;
    });

    /*
    * Is perfomed after playing the tests.
    */
    afterAll(async () => {

        /*
        * Close the sequelize connection and stop the application.
        */
        await sequelize.close();
        await app.close();
    });

    /*
    * Testing the game session controller creation route.
    */
    describe('Create', () => {
        
        /*
        * Testing the DTO validators.
        */
        it('Should failed and return status 400: Bad Request', async () => {
            
            /*
            * Initialize fake data and mock.
            */
            const fakePlayerUUID = uuidv4();
            const fakeGameUUID = uuidv4();
            const fakeOrganizerUUID = uuidv4();

            const mockGameSessionPlayerError = new GameSessionPlayerDto();
            mockGameSessionPlayerError.playerId = fakePlayerUUID;

            const mockGameSessionError = {
                id: uuidv4(),
                organizerId: fakeOrganizerUUID,
                gameId: fakeGameUUID,
                name: 'LO',
                startDate: mockGameSession.startDate,
                endDate: mockGameSession.endDate,
                description: 'LO',
                chatRoom: 'http://chat.room.exemple.com',
                gameSessionPlayers: [
                    mockGameSessionPlayerError,
                ],
            };

            /*
            * Send a POST request to the creation path with mock and wait for the "400 Bad Request" status.
            */
            const result = await request(app.getHttpServer()).post('/game_session')
                                                             .send(mockGameSessionError)
                                                             .set({ authorization: organizerAuthToken })
                                                             .expect(400);

            /*
            * Check request response and wait for defined errors.
            */
            expect(result.body.message).toHaveLength(6);
            expect(result.body.message).toContain(`This resource with the gameId ${fakeGameUUID} doesn't exists`);
            expect(result.body.message).toContain(`This resource with the organizerId ${fakeOrganizerUUID} doesn't exists`);
            expect(result.body.message).toContain(`name must be longer than or equal to ${GAME_SESSION_NAME_MIN_LENGTH} characters`);
            expect(result.body.message).toContain(`description must be longer than or equal to ${GAME_SESSION_DESCRIPTION_MIN_LENGTH} characters`);
            expect(result.body.message).toContain('chatRoom must be a URL address');
            expect(result.body.message).toContain(`gameSessionPlayers.0.This resource with the playerId ${fakePlayerUUID} doesn't exists`);
        });

        /*
        * Testing the Auth Guard.
        */
        it('Should failed and return status 403: Forbidden', async () => {
            
            /*
            * Send a POST request to the creation path with mock and no authentication token, and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).post('/game_session')
                                                             .send(mockGameSession)
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the database integration and return.
        */
        it('Should create a game session model and return it with status 201: Created', async () => {
            
            /*
            * Send a POST request to the creation path with mock and wait for the "201 Created" status.
            */
            const result = await request(app.getHttpServer()).post('/game_session')
                                                             .send(mockGameSession)
                                                             .set({ authorization: organizerAuthToken })
                                                             .expect(201);

            /*
            * Check request response and wait for correct values in the request body.
            */                                                 
            expect(result.body.id).toBe(mockGameSession.id);
            expect(result.body.organizerId).toBe(mockGameSession.organizerId);
            expect(result.body.gameId).toBe(mockGameSession.gameId);
            expect(result.body.name).toBe(mockGameSession.name);
            expect(result.body.startDate).toBe(mockGameSession.startDate);
            expect(result.body.endDate).toBe(mockGameSession.endDate);
            expect(result.body.description).toBe(mockGameSession.description);
            expect(result.body.chatRoom).toBe(mockGameSession.chatRoom);
        });
    });

    /*
    * Testing the game session controller update route.
    */
    describe('Update', () => {

        /*
        * Testing the DTO validators.
        */
        it('Should failed and return status 400: Bad Request', async () => {

            /*
            * Initialize fake data and mock.
            */
            const mockDescritptionTooLong =  
                `Life is a journey filled with endless opportunities.
                Embrace each challenge, learn from every moment, and never stop dreaming.
                The road may twist and turn, but persistence and hope will always lead you to success.
                Stay curious and keep moving forward!`;

            const mockGameSessionPlayerError1 = new GameSessionPlayerDto();
            const mockGameSessionPlayerError2 = new GameSessionPlayerDto();
            const mockGameSessionPlayerError3 = new GameSessionPlayerDto();
            mockGameSessionPlayerError1.playerId = mockPlayers[1].id;
            mockGameSessionPlayerError2.playerId = mockPlayers[2].id;
            mockGameSessionPlayerError3.playerId = mockPlayers[3].id;

            const mockGameSessionUpdateError = {
                organizerId: mockGameSession.organizerId,
                gameId: 'e685c081-bbb6-43d0-8cd8-efddcfa2a177',
                name: 'GameSessionNameTooLong',
                startDate: 'It is not a date string',
                endDate: '',
                description: mockDescritptionTooLong,
                chatRoom: 'http://chat.room.exemple.com',
                gameSessionPlayers: [
                    mockGameSessionPlayerError1,
                    mockGameSessionPlayerError2,
                    mockGameSessionPlayerError3,
                ],
            };

            /*
            * Send a PUT request to the update path with mock and wait for the "400 Bad Request" status.
            */
            const result = await request(app.getHttpServer()).put(`/game_session/${mockGameSession.id}`)
                                                             .send(mockGameSessionUpdateError)
                                                             .set({ authorization: organizerAuthToken })
                                                             .expect(400);

            /*
            * Check request response and wait for defined errors.
            */
            expect(result.body.message).toHaveLength(8);
            expect(result.body.message).toContain(`name must be shorter than or equal to ${GAME_SESSION_NAME_MAX_LENGTH} characters`);
            expect(result.body.message).toContain(`description must be shorter than or equal to ${GAME_SESSION_DESCRIPTION_MAX_LENGTH} characters`);
            expect(result.body.message).toContain('startDate must be a valid ISO 8601 date string');
            expect(result.body.message).toContain('endDate must be a valid ISO 8601 date string');
            expect(result.body.message).toContain('endDate should not be empty');
            expect(result.body.message).toContain('chatRoom must be a URL address');
            expect(result.body.message).toContain('The number of players must be between 2 and 2');
            expect(result.body.message).toContain('One of the players is under the required age. The minimum age is 12 years');
        });

        /*
        * Testing the Creator Session Guard.
        */
        it('Should failed and return status 403: Forbidden (With bad token)', async () => {

            /*
            * Initialize mock.
            */
            const mockStartDateUpdate = mockStartDate.add(1, 'day');
            const mockEndDateUpdate = mockStartDateUpdate.add(1, 'hour');

            const mockGameSessionUpdate = {
                organizerId: mockGameSession.organizerId,
                gameId: 'dd36f115-36d6-4707-a473-cce0270ee46f',
                name: 'Session Updated',
                startDate: mockStartDateUpdate.toISOString(),
                endDate: mockEndDateUpdate.toISOString(),
                description: 'Super Game Session Updated',
                chatRoom: 'https://chat.room.exemple.updated.com',
            };

            /*
            * Send a PUT request to the update path with mock and bad authentication token, and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).put(`/game_session/${mockGameSession.id}`)
                                                             .send(mockGameSessionUpdate)
                                                             .set({ authorization: playerAuthToken })
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the Auth Guard.
        */
        it('Should failed and return status 403: Forbidden (Without token)', async () => {

            /*
            * Initialize mock.
            */
            const mockStartDateUpdate = mockStartDate.add(1, 'day');
            const mockEndDateUpdate = mockStartDateUpdate.add(1, 'hour');

            const mockGameSessionUpdate = {
                organizerId: mockGameSession.organizerId,
                gameId: 'dd36f115-36d6-4707-a473-cce0270ee46f',
                name: 'Session Updated',
                startDate: mockStartDateUpdate.toISOString(),
                endDate: mockEndDateUpdate.toISOString(),
                description: 'Super Game Session Updated',
                chatRoom: 'https://chat.room.exemple.updated.com',
            };

            /*
            * Send a PUT request to the update path with mock and no authentication token, and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).put(`/game_session/${mockGameSession.id}`)
                                                             .send(mockGameSessionUpdate)
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the database integration and return.
        */
        it('Should update a game session model and return it with status 200: OK', async () => {

            /*
            * Initialize mock.
            */
            const mockStartDateUpdate = mockStartDate.add(1, 'day');
            const mockEndDateUpdate = mockStartDateUpdate.add(1, 'hour');

            const mockGameSessionUpdate = {
                organizerId: mockGameSession.organizerId,
                gameId: 'dd36f115-36d6-4707-a473-cce0270ee46f',
                name: 'Session Updated',
                startDate: mockStartDateUpdate.toISOString(),
                endDate: mockEndDateUpdate.toISOString(),
                description: 'Super Game Session Updated',
                chatRoom: 'https://chat.room.exemple.updated.com',
            };

            /*
            * Send a PUT request to the update path with mock and wait for the "200 OK" status.
            */
            const result = await request(app.getHttpServer()).put(`/game_session/${mockGameSession.id}`)
                                                             .send(mockGameSessionUpdate)
                                                             .set({ authorization: organizerAuthToken })
                                                             .expect(200);
            
            /*
            * Check request response and wait for correct values in the request body.
            */
            const gameSessionUpdated = result.body[1][0];
            const nbrGameSessionUpdated = result.body[0];

            expect(nbrGameSessionUpdated).toBe(1);
            expect(gameSessionUpdated.id).toBe(mockGameSession.id);
            expect(gameSessionUpdated.organizerId).toBe(mockGameSessionUpdate.organizerId);
            expect(gameSessionUpdated.gameId).toBe(mockGameSessionUpdate.gameId);
            expect(gameSessionUpdated.name).toBe(mockGameSessionUpdate.name);
            expect(gameSessionUpdated.startDate).toBe(mockGameSessionUpdate.startDate);
            expect(gameSessionUpdated.endDate).toBe(mockGameSessionUpdate.endDate);
            expect(gameSessionUpdated.description).toBe(mockGameSessionUpdate.description);
            expect(gameSessionUpdated.chatRoom).toBe(mockGameSessionUpdate.chatRoom);

            /*
            * Uptade the general mock with the new values.
            */
            mockGameSession.organizerId = gameSessionUpdated.organizerId;
            mockGameSession.gameId = gameSessionUpdated.gameId;
            mockGameSession.name = gameSessionUpdated.name;
            mockGameSession.startDate = gameSessionUpdated.startDate;
            mockGameSession.endDate = gameSessionUpdated.endDate;
            mockGameSession.description = gameSessionUpdated.description;
            mockGameSession.chatRoom = gameSessionUpdated.chatRoom;
        });
    });

    /*
    * Testing the game session controller find one route.
    */
    describe('Find one by ID', () => {

        /*
        * Testing the Not Found Exception.
        */
        it('Should failed and return status 404: Not Found', async () => {

            /*
            * Initialize fake id.
            */
            const fakeGameSessionUUID = uuidv4();

            /*
            * Send a GET request to the find one path with bad id and wait for the "404 Not Found" status.
            */
            const result = await request(app.getHttpServer()).get(`/game_session/${fakeGameSessionUUID}`)
                                                             .set({ authorization: playerAuthToken })
                                                             .expect(404);

            expect(result.body.message).toBe('Not Found');
        });

        /*
        * Testing the Auth Guard.
        */
        it('Should failed and return status 403: Forbidden', async () => {

            /*
            * Send a GET request to the find one path without authentication token and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).get(`/game_session/${mockGameSession.id}`)
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the return.
        */
        it('Should return a game session model with status 200: OK', async () => {

            /*
            * Send a GET request to the find one path and wait for the "200 OK" status.
            */
            const result = await request(app.getHttpServer()).get(`/game_session/${mockGameSession.id}`)
                                                             .set({ authorization: playerAuthToken })    
                                                             .expect(200);

            /*
            * Check request response and wait for correct values in the request body.
            */
            expect(result.body.id).toBe(mockGameSession.id);
            expect(result.body.organizerId).toBe(mockGameSession.organizerId);
            expect(result.body.gameId).toBe(mockGameSession.gameId);
            expect(result.body.name).toBe(mockGameSession.name);
            expect(result.body.startDate).toBe(mockGameSession.startDate);
            expect(result.body.endDate).toBe(mockGameSession.endDate);
            expect(result.body.description).toBe(mockGameSession.description);
            expect(result.body.chatRoom).toBe(mockGameSession.chatRoom);
        });
    });

    /*
    * Testing the game session controller find all route.
    */
    describe('Find all', () => {
        
        /*
        * Testing the Admin Guard 1/2.
        */
        it('Should failed and return status 403: Forbidden (With bad token)', async () => {

            /*
            * Send a GET request to the find all path with bad authentication token and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).get('/game_session')
                                                             .set({ authorization: playerAuthToken })
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the Admin Guard 2/2.
        */
        it('Should failed and return status 403: Forbidden (Without token)', async () => {
            
            /*
            * Send a GET request to the find all path without authentication token and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).get('/game_session')
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the return.
        */
        it('Should return an array of game session model with status 200: OK', async () => {

            /*
            * Send a GET request to the find all path and wait for the "200 OK" status.
            */
            const result = await request(app.getHttpServer()).get('/game_session')
                                                             .set({ authorization: adminAuthToken })
                                                             .expect(200);

            /*
            * Check request response and wait for correct values in the request body.
            */
            const gameSession = result.body[0];

            expect(result.body).toHaveLength(1);
            expect(gameSession.id).toBe(mockGameSession.id);
            expect(gameSession.organizerId).toBe(mockGameSession.organizerId);
            expect(gameSession.gameId).toBe(mockGameSession.gameId);
            expect(gameSession.name).toBe(mockGameSession.name);
            expect(gameSession.startDate).toBe(mockGameSession.startDate);
            expect(gameSession.endDate).toBe(mockGameSession.endDate);
            expect(gameSession.description).toBe(mockGameSession.description);
            expect(gameSession.chatRoom).toBe(mockGameSession.chatRoom);
        });
    });

    /*
    * Testing the game session controller delete route.
    */
    describe('Delete', () => {

        /*
        * Testing the Creator Session Guard.
        */
        it('Should failed and return status 403: Forbidden (With bad token)', async () => {

            /*
            * Send a DELETE request to the delete path with bad authentication token and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).delete(`/game_session/${mockGameSession.id}`)
                                                             .set({ authorization: playerAuthToken })
                                                             .expect(403);

            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the Auth Guard.
        */
        it('Should failed and return status 403: Forbidden (Without token)', async () => {

            /*
            * Send a DELETE request to the delete path without authentication token and wait for the "403 Forbidden resource" status.
            */
            const result = await request(app.getHttpServer()).delete(`/game_session/${mockGameSession.id}`)
                                                             .expect(403);
            
            expect(result.body.message).toBe('Forbidden resource');
        });

        /*
        * Testing the supression in database.
        */
        it('Should delete the game session model and return status 200: OK', async () => {

            /*
            * Send a DELETE request to the delete path and wait for the "200 OK" status.
            */
            await request(app.getHttpServer()).delete(`/game_session/${mockGameSession.id}`)
                                              .set({ authorization: organizerAuthToken })
                                              .expect(200);

            /*
            * Send a GET request to the find one path and wait for the "404 Not Found" status.
            */
            const result = await request(app.getHttpServer()).get(`/game_session/${mockGameSession.id}`)
                                                             .set({ authorization: organizerAuthToken })
                                                             .expect(404);
                                            
            expect(result.body.message).toBe('Not Found');
        });
    });
});