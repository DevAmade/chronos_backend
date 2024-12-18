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

        if(!payloads) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'ProfileGuard#canActivate',
            );

            return false;
        }

        const isAdmin = payloads.admin;

        if(isAdmin) {
            return true;
        }

        if(!paramsId && !bodyPlayerId) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'ProfileGuard#canActivate',
            );

            return false;
        }

        const isMatch = paramsId ? payloads.id === paramsId : 
            payloads.id === bodyPlayerId;

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