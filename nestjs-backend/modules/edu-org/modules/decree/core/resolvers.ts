import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDecreeModel as Model} from "./model"
import {EduDecreeQuery as ModelQuery} from "./query";
import {EduDecreeService} from "./service";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

@Resolver('EduDecree')
export class EduDecreeResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: EduDecreeService,
        private readonly orderService: AbitOrderService,
    ) {
    }

    @Query('edu_decree_listRecordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .withRequired()
            .getGraph()
    }

    @Query('edu_decree_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .withRequired()
            .exec()
    }

    @Query('edu_decree_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .withRequired()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @ResolveField()
    async ordersCount(
        @Parent() entity,
        @Info() info
    ) {
        return await this.orderService.query().where({
            decreeNid: entity.nid,
        }).countDocuments()
    }

    @ResolveField()
    async actions(@Parent() parent, @Info() info, @UserCurrent() user: UserModel) {
        return parent.getActions()
    }
}
