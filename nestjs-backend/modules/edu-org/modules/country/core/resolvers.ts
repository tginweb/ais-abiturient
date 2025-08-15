import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduCountryModel as Model} from "./model"
import {EduFobQuery as ModelQuery} from "./query";
import {EduCountryService as ModelService} from "./service";

@Resolver('EduCountry')
export class EduCountryResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }


    @Query('edu_country_list')
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

    @ResolveField()
    async name(
        @Parent() entity,
        @Info() info
    ) {
        return entity.title
    }
}
