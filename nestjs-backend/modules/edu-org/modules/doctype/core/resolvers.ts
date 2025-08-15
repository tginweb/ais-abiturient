import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDoctypeModel as Model} from "./model"
import {EduDoctypeQuery as ModelQuery} from "./query";
import {EduDoctypeService as ModelService} from "./service";

@Resolver('EduDoctype')
export class EduDoctypeResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }

    @Query('edu_doctype_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @ResolveField()
    async id(
        @Parent() entity,
        @Info() info
    ) {
        return entity.nid
    }

}
