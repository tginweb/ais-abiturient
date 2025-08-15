import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {EduEpguDictionaryModel as Model} from "./model"
import {EduEpguDictionaryQuery as ModelQuery} from "./query";
import {EduEpguDictionaryService as ModelService} from "./service";

@Resolver('EduEpguDictionaryTerm')
export class EduEpguDictionaryResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }

    @Query('edu_epgu_dictionary_term_recordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_epgu_dictionary_term_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .where({
                actual: true,
                id: {
                    $nin: [
                        12,
                        213101,
                        213102,
                        209108,
                        209108,
                        209072,
                        209072,
                        209111,
                        209110,
                        209109,
                        209071,
                        209112,
                        209070,
                        209147,
                        210098,
                        210145,
                        210092,
                        210095,
                        210097,
                        210093,
                        210094,
                        210087,
                        210088,
                        210089,
                        210091
                    ]
                }
            })
            .sort({name: 1})
            .withViewPublic()
            .exec()
    }

    @Query('edu_epgu_dictionary_term_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @ResolveField()
    async taxonomyLabel(
        @Parent() parent,
        @Info() info
    ) {
        const dictTypes = this.service.getDictionaryTypesByCode()
        return dictTypes[parent.taxonomy] && dictTypes[parent.taxonomy].label
    }


}
