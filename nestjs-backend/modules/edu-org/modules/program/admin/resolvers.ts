import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduProgramAdminService as ModelAdminService} from "./service"
import {EduProgramModel as Model} from "../core/model"
import {EduProgramService as ModelCoreService} from "../core/service"
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@UseGuards(UserRolesAdminGuard)
@Resolver('EduProgram')
export class EduProgramAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_program_admin_syncWithAdmissions')
    async syncWithAdmissions(@Args() args, @Info() info) {

        let result = new Response();

        try {
            await this.adminService.syncWithAdmissions(args.ids)
        } catch (e) {

        }

        return result.getJson()
    }

    @Query('edu_program_admin_filtersTree')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Mutation('edu_program_admin_actionMultiple')
    async actionMultiple(@Args() args, @Info() info) {

        let result = new Response();
        try {
            for (const doc of await this.coreService.find({id: args.ids}))
                result.counterAddResult(await this.adminService.entityAction(args.action, doc))
            result.addSuccess('Обработано ' + args.action + ' ' + result.counters.success, {notify: true})
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_program_admin_action')
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
}
