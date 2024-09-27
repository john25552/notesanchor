import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { UserService } from "./user.service";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class AuthGuard implements CanActivate {
    private jwt_key = process.env.JWT_KEY;

    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        let cookies: string;
        let contextType = context.getType()

        if (contextType == 'ws')
            cookies = context.switchToWs().getClient().handshake?.headers?.cookie

        else if(contextType == 'http')
            cookies = context.switchToHttp().getRequest().headers?.cookie;

        if (!cookies) {
            console.log(`No cookies in ${context.getType().toLocaleUpperCase()} request`);
            if(contextType == 'http')
                throw new UnauthorizedException("No cookies found");

            else if(contextType == 'ws')
                throw new WsException("No cookies found");

        }

        const token = this.extractTokenFromCookie(cookies);

        if (!token) {
            console.log("No token in cookies");
            if(contextType == 'http')
                throw new UnauthorizedException("No token found in cookies");
            else if(contextType == 'ws')
                throw new WsException("No token found in cookies");

        }

        if (this.userService.isBlacklisted(token)) {
            if(contextType == 'http')
                throw new UnauthorizedException('Logged out user');
            else if(contextType == 'ws')
                throw new WsException('Unauthorized; You are logged out')
        }

        try {
            const payload = await this.jwtService.verify(token, { secret: this.jwt_key });
            if (contextType == 'http')
                context.switchToHttp().getRequest()['user'] = payload;
            
            else if(contextType == 'ws')
                context.switchToWs().getClient().handshake['user'] = payload
        } catch (error) {
            console.log("JWT Token is invalid:", token, error);
            if(contextType == 'http')
                throw new UnauthorizedException("Invalid token");
            else if(contextType == 'ws')
                throw new WsException("Invalid token");

        }

        return true;
    }

    private extractTokenFromCookie(cookies: string): string | undefined {
        const token = cookies.split('; ').find(row => row.startsWith('access_token='));
        return token ? token.split('=')[1] : undefined;
    }
}
