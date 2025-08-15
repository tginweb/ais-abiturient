import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter"

import {EduAdmissionModel as Model} from "./model"
import {EduAdmissionQuery as ModelQuery} from './query'
import {EduAdmissionService as ModelService} from "./service"
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";


@Resolver('EduAdmission')
export class EduAdmissionResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: ModelService,
    ) {
    }

    @Query('edu_admission_recordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        await query
            .addContext(this.modelService.getQueryContext())
            .withFilterAsync(generateClientFilter(args.filter, this.model), args.filter || {})
        return query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_admission_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_admission_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @ResolveField()
    async fob(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getFob ? await parent.getFob() : parent.fob
    }
}
