import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ProfileGuard implements CanActivate {

    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const payloads = request['payloads'];
        const paramsId = request.params.id;
        const bodyPlayerId = request.body.playerId;

        /*
        * Check whether the request contains payloads.
        */
        if(!payloads) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'ProfileGuard#canActivate',
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

        /*
        * Check whether the request contains player id in params or in body.
        */
        if(!paramsId && !bodyPlayerId) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'ProfileGuard#canActivate',
            );

            return false;
        }

        const isMatch = paramsId ? payloads.id === paramsId : 
            payloads.id === bodyPlayerId;

        /*
        * Check whether the player id in the request matches the player id in the payloads.
        * If no, refuse access.
        */
        if(!isMatch) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'ProfileGuard#canActivate',
            );

            return false;
        }

        return true;
    }
}