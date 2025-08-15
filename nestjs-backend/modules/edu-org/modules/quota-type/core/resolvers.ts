import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduQuotaTypeModel as Model} from "./model"
import {EduQuotaTypeQuery as ModelQuery} from "./query";
import {EduQuotaTypeService as ModelService} from "./service";

@Resolver('EduQuotaType')
export class EduQuotaTypeResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: ModelService,
    ) {
    }

    @Query('edu_quotaType_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {sortField: 'weight', sortAscending: true})
            .withViewPublic()
            .exec()
    }


}
