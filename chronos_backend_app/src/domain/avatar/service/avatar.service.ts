import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { SupportService } from '../../../core/toolkit/support.service';

import { Avatar } from '../model/avatar.model';
import { CreateAvatarDto } from '../dto/create_avatar.dto';
import { UpdateAvatarDto } from '../dto/update_avatar.dto';

@Injectable()
export class AvatarService 
    extends SupportService<CreateAvatarDto, UpdateAvatarDto, Avatar> {
        constructor(@InjectModel(Avatar) protected readonly avatarModel: typeof Avatar) {
            super(avatarModel);
        }
}