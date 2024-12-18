import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { GameSessionService } from '../../game_session/service/game_session.service';

@Injectable()
export class CreatorSessionGuard implements CanActivate {

    constructor(
        private readonly gameSessionService: GameSessionService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const payloads = request['payloads'];

        if(!payloads) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'CreatorSessionGuard#canActivate',
            );

            return false;
        }

        const isAdmin = payloads.admin;

        if(isAdmin) {
            return true;
        }

        const gameSessions = await this.gameSessionService.findManyByAttribute([{ organizer_id: payloads.id }]);
        const isMatch = gameSessions.find(session => session.id === request.params.id);

        if(!isMatch) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'CreatorSessionGuard#canActivate',
            );

            return false;
        }

        return true;
    }
}