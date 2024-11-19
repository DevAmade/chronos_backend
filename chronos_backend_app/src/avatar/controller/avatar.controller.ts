import { Controller } from '@nestjs/common';

import { SupportController } from '../../toolkit/support.controller';
import { Avatar } from '../model/avatar.model';
import { AvatarService } from '../service/avatar.service';

@Controller('avatar')
export class AvatarController extends SupportController<Avatar> { 
    constructor(protected readonly service: AvatarService) {
        super(service);
    }
}