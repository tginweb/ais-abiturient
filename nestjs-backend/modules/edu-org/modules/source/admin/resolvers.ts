import {Args, Info, Mutation, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduSourceAdminService as ModelAdminService} from "./service"
import {EduSourceModel as Model} from "../core/model"
import {EduSourceService as ModelCoreService} from "../core/service"
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduSourceAdmin')
export class EduSourceAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_source_admin_syncWithAis')
    async syncWithAis(@Args() args, @Info() info) {

        let result = new Response();

        try {
            await this.adminService.syncWithAis()
        } catch (e) {

        }

        return result.getJson()
    }
}
