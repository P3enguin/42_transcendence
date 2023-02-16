import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetPlayer = createParamDecorator (
	(data: string | null, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		if (data)
			return request.player[data];
		return request.player;
	},
);