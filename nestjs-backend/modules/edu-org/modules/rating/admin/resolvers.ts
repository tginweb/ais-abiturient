import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduRatingAdminQuery as ModelQuery} from "./query"
import {EduRatingModel, EduRatingModel as Model} from "../core/model"
import {EduRatingService as ModelCoreService} from "../core/service"
import {EduRatingAdminService as ModelAdminService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {Response} from "~lib/response";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduRating')
export class EduRatingAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly testService: AbitTestService,
        private readonly orderService: AbitOrderService,
        private readonly subjectService: EduSubjectService,
    ) {

    }

    @Query('edu_rating_admin_filters')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Query('edu_rating_admin_list')
    async list(@Args() args, @Info() info, @UserCurrent() user: UserModel) {
        const query = this.adminService.query().addContext(this.coreService.getQueryContext(user))
        await query.clientFilterAsync(args.filter, this.model)
        return await query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .execMany()
    }

    @Query('edu_rating_admin_recordset')
    async recordset(@Args() args, @Info() info, @UserCurrent() user: UserModel) {
        const query = this.adminService.query().addContext(this.coreService.getQueryContext(user))
        await query.clientFilterAsync(args.filter, this.model)
        return await query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_rating_admin_single')
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

    @Mutation('edu_rating_admin_create')
    async create(@Args() args, @Info() info) {
        let result = new Response();
        try {
            const doc = this.coreService.createModel({})
            await doc.savePromise()
            result.addSuccess('Создан конкурсный список, откройте для генерации', {notify: true})
        } catch (e) {
            console.log(e)
        }
        return result.getJson()
    }

    @Mutation('edu_rating_admin_update')
    async update(@Args() args, @Info() info) {

        let result = new Response();

        try {

            let doc: EduRatingModel

            if (args.action === 'create') {
                doc = this.coreService.createModel({})
            } else {
                doc = await this.coreService.query().getById(args.id)
            }

            const model = args.model
            await doc.savePromise()

            result.setPayloadData('entityId', doc._id)

            result.addSuccess('Документ сохранен')

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_rating_admin_generate')
    async generate(@Args() args, @Info() info) {
        let result = new Response();
        try {
            const doc = await this.coreService.query().getById(args.id)
            this.coreService.generateDataFile(doc)
            result.addSuccess('Генерация запущена')
        } catch (e) {
            console.log(e)
        }
        return result.getJson()
    }

    @Mutation('edu_rating_admin_actionMultiple')
    async actionMultiple(@Args() args, @Info() info) {
        let result = new Response();
        try {
            const docs = await this.coreService.query().filterIds(args).execMany()
            for (const doc of docs) {
                await this.adminService['entityAction_' + args.action](doc)
            }
            result.addSuccess('Обработано', {notify: true})
        } catch (e) {
            console.log(e)
        }
        return result.getJson()
    }

    @Mutation('edu_rating_admin_make_actual')
    async makeActual(@Args() args, @Info() info) {
        let result = new Response();
        try {
            const docs = await this.coreService.query().execMany()
            for (const doc of docs) {
                if (doc.id === args.id) {
                    if (doc.generated) {
                        doc.actual = true
                        await doc.savePromise()
                    }
                } else if (doc.actual) {
                    doc.actual = false
                    await doc.savePromise()
                }
            }
        } catch (e) {
            console.log(e)
        }
        return result.getJson()
    }

    @Query('edu_rating_admin_rating_fetch')
    async testsFetch(@Args() args, @Info() info): Promise<Object> {
        const query = this.adminService.query() as ModelQuery
        const sheet = await query.withTests().getById(args.id)
        return []
    }

}
