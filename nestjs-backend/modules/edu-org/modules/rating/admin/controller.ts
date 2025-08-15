import {Controller, Get, Query} from '@nestjs/common'
import * as fs from 'fs'
import {InjectModel} from "nestjs-typegoose"
import {EduAisEntrantModel as Model} from "~modules/edu-org/modules/ais-entrant/model"
import {ReturnModelType} from "@typegoose/typegoose"
import {EduRatingService} from "~modules/edu-org/modules/rating/core/service";

const path = require('path')

@Controller('sheet/admin')
export class EduRatingAdminController {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: EduRatingService,
    ) {

    }
}
