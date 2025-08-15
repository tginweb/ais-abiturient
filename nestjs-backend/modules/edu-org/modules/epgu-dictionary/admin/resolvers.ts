import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduEpguDictionaryModel as Model} from "./model"
import {EduEpguDictionaryAdminService as ModelService} from "./service";
import {EduEpguDictionaryService as ModelCoreService} from "../core/service";
import {Response} from "~lib/response";
import {EduEpguDictionaryQuery as ModelQuery} from "~modules/edu-org/modules/epgu-dictionary/core/query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduEpguDictionary')
export class EduEpguDictionaryAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
        private readonly coreService: ModelCoreService,
    ) {
    }

    @Mutation('edu_epgu_dictionary_admin_sync_with_epgu')
    async syncWithEpgu(@Args() args, @Info() info) {
        let result = new Response();

        try {
            await this.service.syncWithEpgu()
        } catch (e) {

            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_epgu_dictionary_admin_term_action_multiple')
    async actionMultiple(@Args() args, @Info() info) {

        let result = new Response();

        try {

            let ids, modelsById = {}

            if (args.models) {
                ids = args.models.map(model => model._id)
                modelsById = args.models.reduce((map, model: any) => (map[model._id] = model, map), {})
            } else {
                ids = args.ids
            }

            for (const doc of await this.coreService.find({_id: ids})) {

                const r = await this.service.entityAction(
                    args.action,
                    doc,
                    {
                        ...args,
                        model: modelsById[doc._id]
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

    @Query('edu_epgu_dictionary_term_filters')
    async filters(@Args() args, @Info() info) {
        return this.service.getFiltersTree()
    }

}
