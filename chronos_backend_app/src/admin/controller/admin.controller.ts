import { Controller } from '@nestjs/common';

import { SupportController } from '../../toolkit/support.controller';
import { Admin } from '../model/admin.model';
import { AdminService } from '../service/admin.service';

@Controller('admin')
export class AdminController extends SupportController<Admin> { 
    constructor(protected readonly service: AdminService) {
        super(service);
    }
}