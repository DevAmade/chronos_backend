import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ProfileGuard implements CanActivate {

    constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const clientIp = request.ip;
        const payloads = request['payloads'];

        if(!payloads) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${clientIp} }`,
                'ProfileGuard#canActivate',
            );

            return false;
        }

        const isAdmin = request['payloads'].admin;

        if(isAdmin) {
            return true;
        }

        const isMatch = payloads.id === request.params.id;

        if(!isMatch) {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${clientIp} }`,
                'ProfileGuard#canActivate',
            );

            return false;
        }

        return true;
    }
}