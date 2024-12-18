import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PlayerSessionGuard implements CanActivate {

    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const payloads = request['payloads'];
        const body = request.body;

        if(!payloads) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'PlayerSessionGuard#canActivate',
            );

            return false;
        }

        const isAdmin = payloads.admin;

        if(isAdmin) {
            return true;
        }

        const isMatch = payloads.id === body.playerId;

        if(!isMatch) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'PlayerSessionGuard#canActivate',
            );

            return false;
        }

        return true;
    }
}