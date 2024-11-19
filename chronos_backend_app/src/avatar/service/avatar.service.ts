import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../toolkit/support.service';
import { Avatar } from '../model/avatar.model';

@Injectable()
export class AvatarService extends SupportService<Avatar> {
    constructor(@InjectModel(Avatar) protected readonly model: typeof Avatar) {
        super(model);
    }
}