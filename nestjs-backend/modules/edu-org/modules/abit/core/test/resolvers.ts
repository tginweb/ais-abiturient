import {Info, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitTestModel as Model} from "./model"
import {AbitTestService} from "./service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../user/core/guards/userRolesAdminGuard";

@Resolver('AbitTest')
export class AbitTestResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: AbitTestService,
    ) {
    }

    @ResolveField()
    async subject(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.getSubject ? entity.getSubject() : null
    }

}



