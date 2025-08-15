import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitAppService as ModelCoreService} from "../../core/app/service"
import {AbitTestModel as Model} from "../../core/test/model"
import {AbitTestAdminService as ModelAdminService} from "./service"
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UserService} from "~modules/user/core/user.service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

import {EntityService} from "~modules/entity/entity.service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('AbitTest')
export class AbitTestAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly userService: UserService,
        private readonly entityService: EntityService,
        private readonly orderService: AbitOrderService,
    ) {
    }

    @Query('edu_test_admin_single')
    async single(@Args() args, @Info() info) {
        const query = this.adminService.query()
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    getDbQueryContext(user) {
        return {
            user: user,
            userId: user._id,
            entityService: this.entityService,
            orderService: this.orderService
        }
    }

    @Query('edu_test_admin_recordset')
    async recordset(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const query = this.adminService.query()

        await query
            .addContext(this.getDbQueryContext(user))
            .clientFilterAsync(args.filter, this.model)

        return query
            .withNavPublic(args.nav || {})
            .withRequired()
            .withViewAdmin()
            .getGraph()
    }

    @Query('edu_test_admin_list')
    async list(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const query = this.adminService.query()

        await query
            .addContext(
                {
                    user: user,
                    userId: user._id,
                    entityService: this.entityService
                }
            )
            .clientFilterAsync(args.filter, this.model)

        return query
            .withNavPublic(args.nav || {})
            .withRequired()
            .withViewAdmin()
            .execMany()
    }

    @Query('edu_test_admin_filters')
    async filters(@Args() args, @Info() info) {
        return await this.adminService.getFilters()
    }

    @ResolveField()
    async actions(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id && entity.getAdminActions ? entity.getAdminActions() : []
    }

}
