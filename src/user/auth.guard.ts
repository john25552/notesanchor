import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export class AuthGuard implements CanActivate {
    private jwt_key = process.env.JWT;

    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const cookies = request.headers.cookie

        if(!cookies) throw new UnauthorizedException()

        const token = this.extractTokenFromCookie(cookies);

        if(!token) throw new UnauthorizedException();

        try{
            const payload = await this.jwtService.verify(token, {secret: this.jwt_key})
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException()
        }

        return true
    }

    private extractTokenFromCookie(cookies: string){
        const token = cookies.split('; ').find(row => row.startsWith('access_token='))
        return token ? token.split('=')[0] : undefined
    }
}

