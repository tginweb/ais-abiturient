import {Args, Info, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from '~lib/db/mongoose/query/generate-client-filter';
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAdmissionModel as Model} from "../core/model"
import {EduAdmissionService as ModelCoreService} from "../core/service"

import {EduAdmissionPublicQuery as ModelPublicQuery} from "./query";

@Resolver('EduAdmission')
export class EduAdmissionPublicResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
    ) {
    }

    @Query('edu_admission_public_list')
    async listRecordset(@Args() args, @Info() info) {
        const query = new ModelPublicQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

}
