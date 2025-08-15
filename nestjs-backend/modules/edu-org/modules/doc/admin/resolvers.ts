import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDocAdminService as ModelAdminService} from "./service"
import {EduDocModel, EduDocModel as Model} from "../core/model"
import {EduDocService as ModelCoreService} from "../core/service"
import {EduDocAdminQuery as ModelQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {Response} from "~lib/response";
import {FileService} from "~modules/file/core/service";
import {AbitWorkplaceEnum} from "~modules/edu-org/enum/source-workplace";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduDoc')
export class EduDocAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly fileService: FileService,
    ) {
    }


    @Query('edu_doc_admin_listRecordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .clientFilter(args.filter, this.model)
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_doc_admin_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_doc_admin_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        const e = await query
            .withViewPublic()
            .clientFilter(args.filter, this.model)
            .execOne()
        return e
    }

    @Mutation('edu_doc_admin_update')
    async update(@Args() args, @Info() info) {

        let result = new Response();

        try {

            let doc: EduDocModel

            if (args.action === 'create') {
                doc = this.coreService.createModel({})
                doc.orderId = args.orderId
            } else {
                doc = await this.coreService.query().getById(args.id)
            }

            const model = args.model

            doc.createSource = AbitWorkplaceEnum.CIS_ADMIN
            doc.type = model.type

            doc.docTypeId = model.docTypeId
            doc.docCategoryId = model.docCategoryId

            doc.docSeries = model.docSeries
            doc.docNumber = model.docNumber
            doc.issueDate = model.issueDate
            doc.docOrg = model.docOrg

            doc.fields = model.fields
            doc.files = model.files

            await doc.savePromise()

            if (args.action === 'create') {
                await this.fileService.temporarySetDoc('doc', args.id, doc._id.toString())
            }

            result.setPayloadData('entityId', doc._id)

            result.addSuccess('Документ сохранен')

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_doc_admin_delete')
    async delete(@Args() args, @Info() info) {

        let result = new Response();

        try {
            const doc = await this.coreService.query().getById(args.id)
            doc.deleted = true
            await doc.savePromise()
            result.addSuccess('Документ удален')

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @ResolveField()
    async actions(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id && entity.getAdminActions ? entity.getAdminActions() : []
    }

    @Query('edu_doc_admin_filters')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Mutation('edu_doc_admin_action')
    async action(@Args() args, @Info() info) {

        let result = new Response();
        try {

            const docs = await this.coreService.query().filterIds(args).execMany()

            for (const doc of docs) {
                await this.adminService['action_' + args.action](doc)
            }

            result.addSuccess('Обработано ' + docs.length, {notify: true})

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }
}
