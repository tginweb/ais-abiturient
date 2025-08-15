import {Controller, Get, Query} from '@nestjs/common'
import * as fs from 'fs'
import {InjectModel} from "nestjs-typegoose"
import {EduAisEntrantModel as Model} from "~modules/edu-org/modules/ais-entrant/model"
import {ReturnModelType} from "@typegoose/typegoose"
import {EduSheetService} from "~modules/edu-org/modules/sheet/core/service";

const path = require('path')

@Controller('sheet/admin')
export class EduSheetAdminController {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: EduSheetService,
    ) {

    }
}
