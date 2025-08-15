import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduInstituteAdminService as ModelAdminService} from "./service"
import {EduInstituteModel as Model} from "../core/model"
import {EduInstituteService as ModelCoreService} from "../core/service"
import {EduInstituteAdminQuery as ModelQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduInstituteAdmin')
export class EduInstituteAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_institute_admin_syncWithAis')
    async syncWithAis(@Args() args, @Info() info) {

        let result = new Response();

        try {
            await this.adminService.syncWithAis()
        } catch (e) {

        }

        return result.getJson()
    }

    @Query('edu_institute_admin_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .filterIds(args)
            .clientFilter(args.filter, this.model)
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_institute_admin_listRecordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }
}
