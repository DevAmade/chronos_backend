import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { AdminGuard } from './admin.guard';
import { PlayerGuard } from './player.guard';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly adminGuard: AdminGuard,
        private readonly playerGuard: PlayerGuard,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return await this.playerGuard.canActivate(context) || await this.adminGuard.canActivate(context);
    }
}