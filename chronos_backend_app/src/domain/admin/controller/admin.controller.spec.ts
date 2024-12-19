import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Sequelize } from 'sequelize-typescript';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid'

import { AdminGuard } from '../../toolkit/guard/admin.guard';
import { Avatar } from '../../avatar/model/avatar.model';
import { AvatarService } from '../../avatar/service/avatar.service';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { Admin } from '../model/admin.model';
import { AdminService } from '../service/admin.service';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
    let adminService: AdminService;
    let avatarService: AvatarService;
    let adminController: AdminController;
    let sequelize: Sequelize;
    let avatar: any;

    const mockAdminService = {
        create: jest.fn(),
        findOneByAttribute: jest.fn()
    };

    const mockAvatarService = {
        create: jest.fn(),
        findOneByAttribute: jest.fn()
    };

    const mockLoggerService = {
        log: jest.fn(),
        warn: jest.fn()
    };

    const mockAdminGuard = {
        canActivate: jest.fn().mockResolvedValue(true),
    };

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [Admin, Avatar],
        });
    
        await sequelize.sync();
    });

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AdminController],
            providers: [
                JwtService,
                ConfigService,
                {
                    provide: AdminService,
                    useValue: mockAdminService,
                },
                {
                    provide: AvatarService,
                    useValue: mockAvatarService,
                },
                {
                    provide: WINSTON_MODULE_NEST_PROVIDER,
                    useValue: mockLoggerService,
                },
            ],
        })
        .overrideGuard(AdminGuard)
        .useValue(mockAdminGuard)
        .compile();

        await sequelize.sync({ force: true });

        adminService = moduleRef.get(AdminService);
        avatarService = moduleRef.get(AvatarService);
        adminController = moduleRef.get(AdminController);

        avatar = mockAvatarService.create.mockResolvedValue({
            name: 'Avatar1',
            photo: Buffer.from(''),
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('create', () => {
        it('should create an admin model and return it', async () => {
            const adminId = uuidv4();

            const createAdminDto = plainToInstance(CreateAdminDto, {
                id: adminId,
                avatarId: avatar.id,
                pseudo: 'Admin1',
                password: 'Azerty123456!',
            });

            const createdAdmin = {
                id: adminId,
                pseudo: createAdminDto.pseudo,
                password: createAdminDto.password,
                avatarId: avatar.id,
            } as Admin;

            const errors = await validate(createAdminDto);

            mockAdminService.create.mockResolvedValue(createdAdmin);

            const result = await adminController.create(createAdminDto, { ip: '127.0.0.1' } as any);

            expect(errors.length).toBe(0);
            expect(result).toEqual(createdAdmin);
            expect(mockAdminService.create).toHaveBeenCalledWith(createAdminDto);
        });

        it('should failed cause', async () => {
            const adminId = uuidv4();
            const unexistingAvatarId = uuidv4();

            const createAdminDto = plainToInstance(CreateAdminDto, {
                id: adminId,
                avatarId: unexistingAvatarId,
                pseudo: 'A',
                password: 'A',
            });

            // const createdAdmin = {
            //     id: adminId,
            //     pseudo: createAdminDto.pseudo,
            //     password: createAdminDto.password,
            //     avatarId: avatar.id,
            // } as Admin;

            const errors = await validate(createAdminDto);
            console.log(errors)

            // mockAdminService.create.mockResolvedValue(createdAdmin);

            await adminController.create(createAdminDto, { ip: '127.0.0.1' } as any);

            expect(errors.length).toBe(3);
            expect(mockAdminService.create).toHaveBeenCalledWith(createAdminDto);
        });
    });
});