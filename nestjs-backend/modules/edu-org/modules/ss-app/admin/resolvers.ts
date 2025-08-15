import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduSSAppAdminService as ModelAdminService} from "./service"
import {EduSSAppModel as Model} from "../core/model"
import {EduSSAppService as ModelCoreService} from "../core/service"
import {EduSSAppAdminQuery as ModelQuery} from "./query";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@UseGuards(UserRolesAdminGuard)
@Resolver('EduSSApp')
export class EduSSAppAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Query('edu_ssApp_admin_listRecordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())

        const res: any = await query
            .clientFilter(args.filter, this.model)
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()

        return res
    }

    @Mutation('edu_ssApp_admin_importAppsExcell')
    async importAppsExcell(@Args() args, @Info() info) {

        let result = new Response();


        return result.getJson()
    }


    @Query('edu_ssApp_admin_filtersTree')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Mutation('edu_ssApp_admin_actionMultiple')
    async actionMultiple(@Args() args, @Info() info) {

        let result = new Response();
        try {

            for (const doc of await this.coreService.find({_id: {$in: args.ids}}))
                await this.adminService.entityAction(args.action, doc)

            result.addSuccess('Обработано', {notify: true})

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_ssApp_admin_action')
    async action(@Args() args, @Info() info) {

        let result = new Response();
        try {
            const doc = await this.coreService.findOne({id: args.id})
            result.counterAddResult(doc && await this.adminService.entityAction(args.action, doc))
            result.addSuccess('Обработано ' + args.action + ' ' + result.counters.success, {notify: true})
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @ResolveField()
    async actions(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAdminActions(user)
    }
}
