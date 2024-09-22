import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    private jwt_key = process.env.JWT_KEY;

    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const cookies = request.headers.cookie;

        if (!cookies) {
            console.log("No cookies in HTTP request");
            throw new UnauthorizedException("No cookies found");
        }

        const token = this.extractTokenFromCookie(cookies);

        if (!token) {
            console.log("No token in cookies");
            throw new UnauthorizedException("No token found in cookies");
        }

        try {
            const payload = await this.jwtService.verify(token, { secret: this.jwt_key });
            request['user'] = payload;
        } catch (error) {
            console.log("JWT Token is invalid:", token, error);
            throw new UnauthorizedException("Invalid token");
        }

        return true;
    }

    private extractTokenFromCookie(cookies: string): string | undefined {
        const token = cookies.split('; ').find(row => row.startsWith('access_token='));
        return token ? token.split('=')[1] : undefined;
    }
}
