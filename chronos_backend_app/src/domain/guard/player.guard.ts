import { Injectable, CanActivate, ExecutionContext, LoggerService, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PlayerGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: LoggerService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        const clientIp = request.ip;

        if(!authHeader) {
            return false;
        }

        const [bearer, token] = authHeader.split(' ');

        if(bearer !== 'Bearer' || !token) {
            return false;
        }

        try {
            const payloads = await this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_KEY_PLAYER') });
            request['payloads'] = payloads;

            return true;
        } catch {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${clientIp} }`,
                'PlayerGuard#canActivate',
            );

            return false;
        }
    }
}