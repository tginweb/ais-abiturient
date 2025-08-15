import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSubjectModel as Model} from "./model"
import {EduSubjectQuery as ModelQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {Response} from "~lib/response";
import {EduSubjectService} from "./service";

@Resolver('EduSubject')
export class EduSubjectResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: EduSubjectService,
    ) {
    }

    @Query('edu_subject_listRecordset')
    async listRecordset(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_subject_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_subject_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }
}
