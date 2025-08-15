import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EntityService} from "~modules/entity/entity.service";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

import {EduSSEntrantAdminService as ModelAdminService} from "./service"
import {EduSSEntrantModel as Model, EduSSEntrantService as ModelCoreService} from "../core"
import {EduSSEntrantAdminQuery as ModelQuery} from "./query";

import {EduSSAppService} from "~modules/edu-org/modules/ss-app/core/service";

import {AbitOrderAdminService} from "~modules/edu-org/modules/abit/admin/order/service";
import {AbitAppAdminService} from "~modules/edu-org/modules/abit/admin/app/service";
import {EduAisEntrantService} from "~modules/edu-org/modules/ais-entrant/service";

@Resolver('EduSSEntrant')
export class EduSSEntrantAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly entityService: EntityService,
        private readonly abitOrderAdminService: AbitOrderAdminService,
        private readonly abitAppAdminService: AbitAppAdminService,
        private readonly eduAisEntrantService: EduAisEntrantService,
        private readonly eduSSAppService: EduSSAppService,
    ) {
    }

    @Query('edu_ssEntrant_admin_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @Query('edu_ssEntrant_admin_listRecordset')
    async listGraph(@Args() args, @Info() info, @UserCurrent() user: UserModel) {

        const query = new ModelQuery(this.model.find())
        await query
            .addContext(
                {
                    user: user,
                    userId: user._id,
                    entityService: this.entityService
                }
            )
            .withFilterAsync(generateClientFilter(args.filter, this.model), args.filter || {})

        return query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .where({
                createSource: 'epgu'
            })
            .getGraph()
    }

    @Query('edu_ssEntrant_admin_filtersTree')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Mutation('edu_ssEntrant_admin_actionMultiple')
    async actionMultiple(@Args() args, @Info() info) {

        let result = new Response();
        try {
            console.log('111')

            await this.adminService.entityActionMultiple_epgu_status_send(await this.coreService.find())
            //await this.adminService.entityActionMultiple_epgu_status_send(await this.coreService.find({_id: args.ids}))

            //for (const doc of await this.coreService.find({})) await this.adminService.entityAction_epgu_status_send(doc)
            console.log('222')

            result.addSuccess('Обработано ' + args.action + ' ' + result.counters.success, {notify: true})
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_ssEntrant_admin_action')
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

    @Mutation('edu_ssEntrant_admin_memberChangedProcessed')
    async memberChangedProcessed(@Args() args, @Info() info) {

        let result = new Response();
        try {
            const doc = await this.coreService.findOne({id: args.id})

            console.log(doc)

            result.addSuccess('Обработано', {notify: true})
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }


    @ResolveField()
    async adminActions(@Parent() parent, @Info() info, @UserCurrent() user: UserModel) {
        return parent.getAdminActions(user)
    }

    @ResolveField()
    async actions(@Parent() parent, @Info() info, @UserCurrent() user: UserModel) {
        return parent.getAdminActions(user)
    }

    @ResolveField()
    async appsEpgu(@Parent() entity, @Info() info) {
        return []
        return await this.eduSSAppService.find({snils: entity.snils})
    }

    @ResolveField()
    async appsAis(@Parent() entity, @Info() info) {
        return this.eduAisEntrantService.find({snils: entity.snils})
    }

    @ResolveField()
    async appsOnline(@Parent() entity: Model, @Info() info) {
        return []
        return this.abitOrderAdminService.query().where({'anket.personal.snils': entity.snils}).withRequired().exec()
    }

}
