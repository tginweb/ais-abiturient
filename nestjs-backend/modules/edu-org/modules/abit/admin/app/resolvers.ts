import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {AbitAppService as ModelCoreService} from "../../core/app/service"
import {AbitAppModel as Model} from "../../core/app/model"
import {AbitAppAdminService as ModelAdminService} from "./service"
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UserService} from "~modules/user/core/user.service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";

import {EntityService} from "~modules/entity/entity.service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core";
import {Response} from "~lib/response";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduApp')
export class EduAppAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly userService: UserService,
        private readonly entityService: EntityService,
        private readonly epguDictionaryService: EduEpguDictionaryService,
    ) {
    }

    @Query('edu_app_admin_single')
    async single(@Args() args, @Info() info) {
        const query = this.adminService.query()
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()

    }

    @Query('edu_app_admin_recordset')
    async recordset(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {

        const query = this.adminService.query()
        await query
            .addContext(this.getQueryContext(user))
            .clientFilterAsync(args.filter, this.model)
        return query
            .withNavPublic(args.nav || {})
            .sort({
                orderNid: -1,
                competitionId: -1,
                statusId: -1,
            })
            .withViewAdmin()
            .getGraph()
    }

    async getQueryContext(user) {
        return {
            user: user,
            userId: user._id,
            entityService: this.entityService,
            appService: this.coreService,
        }
    }

    @Query('edu_app_admin_filters')
    async filters(@Args() args, @Info() info) {
        return await this.adminService.getFilters()
    }

    @ResolveField()
    async order(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getOrder()
    }

    @ResolveField()
    async actions(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAdminActions()
    }

    @Mutation('edu_app_admin_actionMultiple')
    async action(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response()

        try {

            let docs: Model[]

            if (args.selectAll) {

                const query = this.adminService.query()
                await query
                    .addContext(this.getQueryContext(user))
                    .clientFilterAsync(args.selectFilter, this.model)

                docs = await query.withViewAdmin().execMany()
            } else {
                docs = await this.coreService.query().filterIds(args).withViewAdmin().execMany()
            }

            let index = 1

            for (const doc of docs) {
                await this.adminService['entityAction_' + args.action](doc, args.params)
            }

            response.addSuccess('Заявление обновлены ' + docs.length, {notify: true})

        } catch (e) {
            console.log(e)
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }

    @Mutation('edu_app_admin_set_predzach')
    async setPerdzach(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response()

        try {

            const app = await this.coreService.query().withViewAdmin().getById(args.id)

            if (app) {
                app.predZach = args.status
                await app.savePromise()
            }

            response.addSuccess('Установлен статус предзачисления', {notify: true})

        } catch (e) {
            console.log(e)
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }
}
