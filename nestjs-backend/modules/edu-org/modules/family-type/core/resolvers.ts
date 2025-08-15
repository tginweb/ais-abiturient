import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduFamilyTypeModel as Model} from "./model"
import {EduFamilyTypeQuery as ModelQuery} from "./query";
import {EduFamilyTypeService as ModelService} from "./service";

@Resolver('EduFamilyType')
export class EduFamilyTypeResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }

    @Query('edu_familyType_list')
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
