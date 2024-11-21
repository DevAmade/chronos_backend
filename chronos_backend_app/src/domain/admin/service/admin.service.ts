import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { SupportService } from '../../../core/toolkit/support.service';

import { Admin } from '../model/admin.model';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { UpdateAdminDto } from '../dto/update_admin.dto';
import { AuthAdminDto } from '../dto/auth_admin.dto';

@Injectable()
export class AdminService 
    extends SupportService<CreateAdminDto, UpdateAdminDto, Admin> {
        constructor(
            @InjectModel(Admin) protected readonly model: typeof Admin,
            private readonly jwtService: JwtService,
            private readonly configService: ConfigService,
        ) {
            super(model);
        }

        async authenticateAdmin(data: AuthAdminDto): Promise<{ token: string } | Error> {
            try {
                const admin = await this.findOneByIdentifier(data.pseudo, 'pseudo');
    
                if(!admin) {
                    return new UnauthorizedException();
                }
    
                const isMatch = await bcrypt.compare(data.password, admin.password);
    
                if(!isMatch) {
                    return new UnauthorizedException();
                }
    
                const payload = {
                    id: admin.id,
                    pseudo: admin.pseudo,
                };
    
                return {
                    token: await this.jwtService.signAsync(payload, { expiresIn: '1d', secret: this.configService.get('JWT_KEY_ADMIN') })
                }
            } catch(err) {
                throw new Error(err);
            }
        }
}