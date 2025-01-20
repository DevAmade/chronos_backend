import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { AdminGuard } from './admin.guard';
import { PlayerGuard } from './player.guard';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly adminGuard: AdminGuard,
        private readonly playerGuard: PlayerGuard,
    ) {}

    /*
    * Authorize access if the player guard return true or if the admin guard return true.
    */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return await this.playerGuard.canActivate(context) || await this.adminGuard.canActivate(context);
    }

}