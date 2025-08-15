import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {GqlContextType, GqlExecutionContext} from "@nestjs/graphql";

export const AbitOrderByUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {

        let req;

        if (context.getType() === 'http') {
            req = context.switchToHttp().getRequest();
        } else if (context.getType<GqlContextType>() === 'graphql') {
            req = GqlExecutionContext.create(context).getContext().req;
        }

        return req ? req.userAbitOrder : null
    },
);


