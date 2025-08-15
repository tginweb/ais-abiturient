import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderTypeModel as Model} from "./../../core/order-type/model"
import {EduOrderTypePublicQuery as ModelPublicQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../user/core/guards/userRolesAdminGuard";


@Resolver('EduOrderType')
export class AbitOrderTypePublicResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
    ) {
    }

    @Query('edu_orderType_public_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelPublicQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }
}
