import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EntityService} from "~modules/entity/entity.service";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

import {EduSSEntrantAdminService as ModelAdminService} from "./service"
import {EduSSEntrantModel, EduSSEntrantModel as Model} from "../core/model"
import {EduSSEntrantService as ModelCoreService} from "../core/service"
import {EduSSEntrantAdminQuery as ModelQuery} from "./query";

import {EduSSAppService} from "~modules/edu-org/modules/ss-app/core/service";

import {AbitOrderAdminService} from "~modules/edu-org/modules/abit/admin/order/service";
import {AbitAppAdminService} from "~modules/edu-org/modules/abit/admin/app/service";
import {EduAisEntrantService} from "~modules/edu-org/modules/ais-entrant/service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
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

    @Mutation('edu_ssEntrant_admin_actionMultiple')
    async actionMultiple(@Args() args, @Info() info) {


        let result = new Response();
        try {

            let docs: EduSSEntrantModel[]

            if (args.selectAll) {
                console.log('FILTER: ' + JSON.stringify(args.selectFilter))

                const query = new ModelQuery(this.model.find())
                await query
                    .addContext(
                        {
                            entityService: this.entityService
                        }
                    )
                    .withFilterAsync(generateClientFilter(args.filter, this.model), args.filter || {})

                docs = await query
                    .withViewPublic()
                    .execMany()
            } else {
                docs = await this.coreService.query().filterIds(args).execMany()
            }

            console.log(docs.length)

            let stat = {}

            for (const doc of docs) {
                const res = await this.adminService.entityAction(args.action, doc)

                if (!stat[res])
                    stat[res]=0

                stat[res]++
            }

            console.log(stat)

            result.addSuccess('Обработано', {notify: true})
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
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
            .clientFilterAsync(args.filter, this.model)

        return query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_ssEntrant_admin_filtersTree')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
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
