import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitOrderTypeModel as Model} from "./model"
import {AbitOrderTypeService as ModelService} from "./service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../user/core/guards/userRolesAdminGuard";


@Resolver('AbitOrderType')
export class AbitOrderTypeResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }

    @Query()
    async edu_order_types(@Args() args, @Info() info) {
        return await this.model.find().exec()
    }
}

