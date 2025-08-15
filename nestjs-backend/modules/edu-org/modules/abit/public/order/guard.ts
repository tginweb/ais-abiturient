import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {GqlExecutionContext, GqlContextType} from '@nestjs/graphql';
import {Reflector} from '@nestjs/core';
import {AbitOrderPublicService} from './service'

@Injectable()
export class AbitOrderByUserGuard implements CanActivate {
    constructor(
        private orderService: AbitOrderPublicService,
        private readonly reflector: Reflector
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        let req;

        if (context.getType() === 'http') {
            req = context.switchToHttp().getRequest();
        } else if (context.getType<GqlContextType>() === 'graphql') {
            req = GqlExecutionContext.create(context).getContext().req;
        }

        if (req) {
            if (req.user) {
                req.userAbitOrder = await this.orderService.ensureByUser(req.user, req.user.eduType || 2);
            }
        }

        return true;
    }
}
