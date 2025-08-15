import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSourceModel as Model} from "./model"
import {EduSourceQuery as ModelQuery} from "./query";
import {EduSourceService} from "./service";

@Resolver('EduSource')
export class EduSourceResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: EduSourceService,
    ) {
    }

    @Query('edu_source_listRecordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_source_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_source_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

}
