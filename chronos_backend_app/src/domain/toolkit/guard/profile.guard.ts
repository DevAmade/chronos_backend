import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ProfileGuard implements CanActivate {

    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const payloads = request['payloads'];

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

        const isMatch = request.params.id ? payloads.id === request.params.id : 
            payloads.id === request.body.playerId;

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