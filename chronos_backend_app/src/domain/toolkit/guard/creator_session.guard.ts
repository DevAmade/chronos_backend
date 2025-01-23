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
        const paramsId = request.params.id;

        /*
        * Check whether the request contains payloads and an id in the params.
        */
        if(!payloads || !paramsId) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'CreatorSessionGuard#canActivate',
            );

            return false;
        }

        const isAdmin = payloads.admin;

        /*
        * Check whether the payloads contains admin="true".
        * If yes, authorize access.
        */
        if(isAdmin) {
            return true;
        }

        const gameSession = await this.gameSessionService.findOneById(paramsId);

        /*
        * Check whether the id in the request params corresponds to a game session.
        */
        if(!gameSession) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'CreatorSessionGuard#canActivate',
            );

            return false;
        }

        const isMatch = gameSession.organizerId === payloads.id;

        /*
        * Check whether the player id in the payloads matches the organizer id in the game session.
        * If no, refuse access.
        */
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