import {Args, Info, Mutation, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduSubjectModel as Model} from "./../core/model";
import {EduSubjectService as ModelCoreService} from "./../core/service";
import {EduSubjectAdminService as ModelAdminService} from "./service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduSubject')
export class EduSubjectAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelCoreService: ModelCoreService,
        private readonly modelAdminService: ModelAdminService,
    ) {
    }

    @Mutation('edu_subject_admin_syncWithAis')
    async syncWithAis(@Args() args, @Info() info) {

        let result = new Response();

        try {
            await this.modelAdminService.syncWithAis()
        } catch (e) {

        }

        return result.getJson()
    }

    @Mutation('edu_subject_action')
    async action(@Args() args, @Info() info) {

        let result = new Response();

        try {

            const id = args.model ? args.model.id : args.id

            const doc = await this.modelCoreService.findOne({id: id})

            if (doc) {
                const r = await this.modelAdminService.entityAction(
                    args.action,
                    doc,
                    args
                )
                result.addSuccess('Обработано ' + args.action, {notify: true})
            }

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }


    @Mutation('edu_subject_actionMultiple')
    async actionMultiple(@Args() args, @Info() info) {

        let result = new Response();

        try {

            let ids, modelsById = {}

            if (args.models) {
                ids = args.models.map(model => model.id)
                modelsById = args.models.reduce((map, model: any) => (map[model.id] = model, map), {})
            } else {
                ids = args.ids
            }

            for (const doc of await this.modelCoreService.find({id: ids})) {

                const r = await this.modelAdminService.entityAction(
                    args.action,
                    doc,
                    {
                        ...args,
                        model: modelsById[doc.id]
                    }
                )

                result.counterAddResult(r)
            }

            result.addSuccess('Обработано ' + args.action + ' ' + result.counters.success, {notify: true})

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
        return entity.getAdminActions ? entity.getAdminActions() : []
    }

    @ResolveField()
    async adminActions(
        @Parent() entity,
        @Info() info
    ) {
        return entity.getAdminActions ? entity.getAdminActions() : []
    }


}
