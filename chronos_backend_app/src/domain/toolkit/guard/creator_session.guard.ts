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

        if(!payloads || !paramsId) {
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

        const gameSession = await this.gameSessionService.findOneById(paramsId);

        if(!gameSession) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'CreatorSessionGuard#canActivate',
            );

            return false;
        }

        const isMatch = gameSession.organizerId === payloads.id;

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