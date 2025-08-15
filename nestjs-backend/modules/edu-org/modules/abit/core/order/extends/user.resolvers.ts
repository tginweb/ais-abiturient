import {Info, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderModel as Model} from "./../model"
import {AbitOrderService} from "./../service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('User')
export class AbitOrderUserResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: AbitOrderService,
    ) {
    }

    @ResolveField()
    async abitOrders(
        @Parent() parent,
        @Info() info
    ) {
        return this.service.query().where({userId: parent._id}).withRequired().exec()
    }
}



