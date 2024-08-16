import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "./entities/user.entity";

export const GetUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
    let request = ctx.switchToHttp().getRequest()
    let user = request.user;

    return data ? user?.[data] : user
})