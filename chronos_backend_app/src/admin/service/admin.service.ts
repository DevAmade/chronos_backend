import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { Admin } from '../model/admin.model';

@Injectable()
export class AdminService extends SupportService<Admin> {
    constructor(@InjectModel(Admin) protected readonly model: typeof Admin) {
        super(model);
    }
}