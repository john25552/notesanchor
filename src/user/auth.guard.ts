import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export class AuthGuard implements CanActivate {
    private jwt_key = process.env.JWT;

    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request);

        if(!token) throw new UnauthorizedException();

        try{
            const payload = await this.jwtService.signAsync(token, {secret: this.jwt_key})
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException()
        }

        return true
    }

    private extractTokenFromHeader(request: Request){
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type == "Bearer" ? token : undefined
    }
}