import {Info, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitAppGroupModel as Model} from "./model"
import {AbitAppGroupService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {EduAppCollection} from "~modules/edu-org/modules/abit/core/app/collection";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../../user/core/guards/userRolesAdminGuard";


@Resolver('EduAppGroup')
export class AbitAppGroupResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: AbitAppGroupService,
    ) {
    }


    @ResolveField()
    async apps(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getApps ? await parent.getApps() : parent.apps
    }

    getAppsCollection(order: Model) {
        return new EduAppCollection(order.apps || [], this.service.abitAppService.model, order, this.service.abitAppService.modelContext())
    }

    @ResolveField()
    async appsActive(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        if (parent.getActiveAppsCollection) {
            return (await parent.getActiveAppsCollection()).all()
        } else {
            return this.getAppsCollection(parent).getActiveItems().all()
        }
    }

    @ResolveField()
    async appsCanceled(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        if (parent.getCanceledAppsCollection) {
            return (await parent.getCanceledAppsCollection()).all()
        } else {
            return this.getAppsCollection(parent).getCanceledItems().all()
        }
    }
}



