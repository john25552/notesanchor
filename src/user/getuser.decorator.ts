import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "./entities/user.entity";

export const GetUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
    let user: { [x: string]: any; };
    if(ctx.getType() == 'ws'){
        let client = ctx.switchToWs().getClient()
        user = client.handshake.user
    } else if(ctx.getType() == 'http'){
        let request = ctx.switchToHttp().getRequest()
        user = request.user;
    }

    return data ? user?.[data] : user
})