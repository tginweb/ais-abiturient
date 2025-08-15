import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";

import {EduAdmissionModel} from "../core/model"
import {EduAdmissionModel as Model} from "../core/model"
import {EduAdmissionQuery as ModelQuery} from "../core/query"
import {EduAdmissionService as ModelCoreService} from "../core/service"


import {EduAdmissionAdminService as ModelAdminService} from "./service";
import {EduAdminService} from "../../../admin/service";

import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";

import * as mongoose from "mongoose";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduAdmission')
export class EduAdmissionAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly eduAdminService: EduAdminService,
    ) {

    }

    @Query('edu_admission_admin_filters')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Query('edu_admission_admin_recordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .addContext(this.coreService.getQueryContext())
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Mutation('edu_admission_admin_syncWithAis')
    async syncWithAis(@Args() args, @Info() info) {

        let result = new Response();

        try {
            await this.adminService.syncWithAis()
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_admission_admin_epguExport')
    async epguExport(@Args() args, @Info() info) {

        let result = new Response();

        console.log(args)
        result.addSuccess('Export ', {notify: true})

        try {

            const docs: EduAdmissionModel[] = await this.coreService.query().filterIds({
                ids: args.ids.map(id => mongoose.Types.ObjectId(id))
            }).withView('public').exec()

            for (const doc of docs) {
                console.log(doc)
                doc.epguExport = !doc.epguExport
                await doc.savePromise()
            }


        } catch (e) {

        }

        return result.getJson()
    }

    @Mutation('edu_admission_admin_fill')
    async fill(@Args() args, @Info() info) {

        let result = new Response();

        result.addSuccess('Заполнено ', {notify: true})

        try {

            const docs: EduAdmissionModel[] = await this.coreService.query().filterIds({
                ids: args.ids.map(id => mongoose.Types.ObjectId(id))
            }).withView('public').exec()

            for (const doc of docs)
                result.counterAddResult(await this.adminService.fillEntity(doc))

            result.addSuccess('Заполнено ' + result.counters.success, {notify: true})

        } catch (e) {
            result.addError(e.message, {notify: true})
        }

        return result.getJson()
    }

    @Mutation('edu_admission_admin_fill_gosline')
    async fillGosline(@Args() args, @Info() info) {

        let result = new Response();

        result.addSuccess('Заполнено ', {notify: true})

        try {

            const docs: EduAdmissionModel[] = await this.coreService.query().filterIds({
                ids: args.ids.map(id => mongoose.Types.ObjectId(id))
            }).withView('public').exec()

            for (const doc of docs)
                result.counterAddResult(await this.adminService.fillEntityGosline(doc))

            result.addSuccess('Заполнено ' + result.counters.success, {notify: true})

        } catch (e) {
            result.addError(e.message, {notify: true})
        }

        return result.getJson()
    }

    @ResolveField()
    async subdocsTree(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id ? entity.getSubdocsTree() : []
    }

    @ResolveField()
    async actions(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id ? entity.getActions() : []
    }
}
