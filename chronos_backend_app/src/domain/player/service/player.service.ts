import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { SupportService } from '../../../core/toolkit/support.service';

import { PLAYER_JWT_TOKEN_EXPIRATION } from '../../config/module.config';
import { Player } from '../model/player.model';
import { CreatePlayerDto } from '../dto/create_player.dto';
import { UpdatePlayerDto } from '../dto/update_player.dto';
import { AuthPlayerDto } from '../dto/auth_player.dto';

@Injectable()
export class PlayerService 
    extends SupportService<CreatePlayerDto, UpdatePlayerDto, Player> {
        constructor(
            @InjectModel(Player) protected readonly model: typeof Player,
            private readonly jwtService: JwtService,
            private readonly configService: ConfigService,
        ) {
            super(model);
        }

        async authenticatePlayer(data: AuthPlayerDto): Promise<{ token: string } | Error> {
            try {
                const player = await this.findOneByIdentifier(data.email, 'email');
    
                if(!player) {
                    return new UnauthorizedException();
                }
    
                const isMatch = await bcrypt.compare(data.password, player.password);
    
                if(!isMatch) {
                    return new UnauthorizedException();
                }
    
                const payload = { 
                    id: player.id,
                    pseudo: player.pseudo,
                    name: player.lastName,
                    firstName: player.firstName,
                    email: player.email,
                };
    
                return {
                    token: await this.jwtService.signAsync(
                        payload, 
                        { expiresIn: PLAYER_JWT_TOKEN_EXPIRATION, secret: this.configService.get('JWT_KEY_PLAYER') },
                    )
                }
            } catch(err) {
                throw new Error(err);
            }
        }
}