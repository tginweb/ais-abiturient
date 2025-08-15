import {Info, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";

import {EduRatingModel as Model} from "./model"
import {EduRatingService as ModelService} from "./service"
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
const path = require('path')

@Resolver('EduRating')
export class EduRatingResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly modelService: ModelService,
        public appService: AbitAppService,
    ) {
    }

    @ResolveField()
    async competitions(
        @Parent() entity,
        @Info() info
    ) {
        return entity.loadDataFile()
    }
}
