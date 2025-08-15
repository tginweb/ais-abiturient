import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSubjectModel as Model} from "../core/model"
import {EduSubjectService as ModelCoreService} from "../core/service"
import {EduSubjectPublicQuery as ModelPublicQuery} from "./query";
import generateClientFilter from '~lib/db/mongoose/query/generate-client-filter';

@Resolver('EduSubject')
export class EduSubjectPublicResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
    ) {
    }

    @Query('edu_subject_public_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelPublicQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }
}
