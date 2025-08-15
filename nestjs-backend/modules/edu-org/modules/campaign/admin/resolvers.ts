import {Args, Info, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduCampaignAdminService as ModelAdminService} from "./service"
import {EduCampaignModel as Model} from "../core/model"
import {EduCampaignService as ModelCoreService} from "../core/service"
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduCampaign')
export class EduCampaignAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_campaign_admin_syncWithAis')
    async syncWithAis(@Args() args, @Info() info) {

        let result = new Response();

        try {
            await this.adminService.syncWithAis()
        } catch (e) {

        }

        return result.getJson()
    }

    @ResolveField()
    async urlAdmin(
        @Parent() parent,
        @Info() info
    ) {
        return {
            view: '/admin/edu/campaign/entity/' + parent.id + '/view'
        }
    }
}
