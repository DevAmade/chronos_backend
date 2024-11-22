import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../../core/toolkit/support.service';

import { Admin } from '../model/admin.model';
import { CreateAdminDto } from '../dto/create_admin.dto';
import { UpdateAdminDto } from '../dto/update_admin.dto';

@Injectable()
export class AdminService 
    extends SupportService<CreateAdminDto, UpdateAdminDto, Admin> {
        constructor(@InjectModel(Admin) protected readonly adminModel: typeof Admin) {
            super(adminModel);
        }
}