import {Args, Info, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter"

import {EduCompetitionModel as Model} from "./model"
import {EduCompetitionQuery as ModelQuery} from './query'
import {EduCompetitionService as ModelService} from "./service"
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";

@Resolver('EduCompetition')
export class EduCompetitionResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: ModelService,
        public appService: AbitAppService,
    ) {
    }

    @Query('edu_competition_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_competition_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .withDetails()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @ResolveField()
    async admission(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAdmission ? await parent.getAdmission() : parent.admission
    }

    @ResolveField()
    async source(
        @Parent() parent: Model,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getSource ? await parent.getSource() : parent.source
    }

    @ResolveField()
    async ratio(
        @Parent() entity,
        @Info() info
    ) {
        const appsCount = await this.appService.query().where({
            competitionId: entity.id,
            statusId: {
                $in: [
                    AppStatusEnum.COMPET_MEMBER,
                ]
            }
        }).countDocuments()
        return entity.admissionNumberTotal ? (appsCount / entity.admissionNumberTotal).toFixed(3) : 0
    }

    @ResolveField()
    async appsCount(
        @Parent() entity,
        @Info() info
    ) {
        return await this.appService.query().where({
            competitionId: entity.id,
            statusId: {
                $in: [
                    AppStatusEnum.COMPET_MEMBER,
                ]
            }
        }).countDocuments()
    }

    @ResolveField()
    async appsRating(
        @Parent() entity,
        @Info() info
    ) {
        return await this.modelService.getRatingApps(entity.id, true, false, false, true, true)
    }

    @ResolveField()
    async name(
        @Parent() entity,
        @Info() info
    ) {
        return entity.name.replace(/\-23/gi, '')
    }


}
