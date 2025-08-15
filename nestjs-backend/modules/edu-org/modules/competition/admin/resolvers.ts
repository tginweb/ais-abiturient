import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduCompetitionAdminQuery as ModelQuery} from "./query"
import {EduCompetitionModel as Model} from "../core/model"
import {EduCompetitionService as ModelCoreService} from "../core/service"
import {EduCompetitionAdminService as ModelAdminService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";
import {Response} from "~lib/response";
import {EduAdmissionAdminService} from "~modules/edu-org/modules/admission/admin";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduCompetition')
export class EduCompetitionAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly admissionAdminService: EduAdmissionAdminService,
    ) {

    }

    @Mutation('edu_competition_admin_recalc_places')
    async recalcPlaces(@Args() args: any, @Info() info) {
        let response = new Response();

        try {
            let admissionIds: number[] | null = null

            const query = this.adminService.query()

            if (args.ids && args.ids.length) {
                query.filterIds(args.ids)
                const competitions = await query.execMany()
                admissionIds = Object.values(competitions.reduce((map, item) => {
                    map[item.cadmission] = item.cadmission
                    return map
                }, {}))
            }

            await this.admissionAdminService.recalcPlaces(admissionIds)

            response.addSuccess('Пересчитано', {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }


    @Mutation('edu_competition_admin_makeZachisl')
    async makeZachisl(@Args() args: any, @Info() info) {
        let response = new Response();

        const query = this.adminService.query().filterIds(args)

        await query.clientFilterAsync(args.filter, this.model)

        await query
            .withViewPublic()
            .execMany()


        try {

        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }

    @Query('edu_competition_admin_filtersTree')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Query('edu_competition_admin_listGraph')
    async listGraph(@Args() args, @Info() info, @UserCurrent() user: UserModel) {
        const query = this.adminService.query().addContext(this.coreService.getQueryContext(user))

        await query.clientFilterAsync(args.filter, this.model)

        query.where({
            //csource: {$nin: [3,6]},
            //clevel: {$in: [3]},
            //id: {$in: [832]}
        })

        const res = await query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()

        return res
    }

    @Query('edu_competition_admin_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .clientFilter(args.filter, this.model)
            .execOne()
    }

    @ResolveField()
    async actions(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id && entity.getAdminActions ? entity.getAdminActions() : []
    }


}
