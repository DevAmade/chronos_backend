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

        /*
        * Checking for authorization header.
        */
        if(!authHeader) {
            return false;
        }

        const [bearer, token] = authHeader.split(' ');

        /*
        * Check whether the authorization header starts with 'Bearer' and whether a token is present.
        */
        if(bearer !== 'Bearer' || !token) {
            return false;
        }

        /*
        * Check whether the authorization header contains a valid player token.
        * If yes, insert the token player payloads in the request and authorize access.
        */
        try {
            const payloads = await this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_KEY_PLAYER') });
            request['payloads'] = payloads;

            return true;
        } catch {
            this.loggerService.warn(
                `Access attempt: { Client IP: ${request.ip} }`,
                'PlayerGuard#canActivate',
            );

            return false;
        }

    }
}