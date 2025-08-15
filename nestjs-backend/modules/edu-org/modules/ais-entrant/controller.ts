import {Controller, Get, Query} from '@nestjs/common'

import {InjectModel} from "nestjs-typegoose"
import {EduAisEntrantModel as Model} from "~modules/edu-org/modules/ais-entrant/model"
import {ReturnModelType} from "@typegoose/typegoose"
import {EduAisEntrantService} from "./service"
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core/service";

import {promisify} from 'util'
import * as fs from 'fs'
const readFile = promisify(fs.readFile)
const path = require('path')
const XLSX = require('xlsx')
const dayjs = require('dayjs')

@Controller('ais-entrant')
export class EduAisEntrantController {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: EduAisEntrantService,
        private readonly competitionService: EduCompetitionService,
    ) {

    }

    @Get('import-cis-set-nid')
    async importCisSetNid(
        @Query('id') id: any,
    ): Promise<any> {

        await this.service.importCisSetNid()

        return {'sss': 1}
    }


    @Get('import-cis')
    async importCis(
        @Query('id') id: any,
    ): Promise<any> {

        const filepath = path.join(process.cwd(), 'import/edu_order_old_test.json')

        const orders = JSON.parse(await readFile(filepath, 'utf8'));

        let count = 0

        for (const order of Object.values(orders)) {

            if (await this.service.importCis(order))
                count++

            break;
        }

        console.log(count, 'cnt res')

        return {'sss': 1}
    }


    @Get('import-from-ais-file')
    async importFromAisFile(
        @Query('id') id: any,
    ): Promise<any> {

        const filepath = path.join(process.cwd(), 'import/ais-students.json')

        const data = JSON.parse(await readFile(filepath, 'utf8'));

        const students = Object.values(data.students)

        let count = 0

        console.log(Object.values(students).length, 'cnt')

        for (const student of Object.values(data.students)) {

            if (await this.service.importEntrantFromAisJson(student))
                count++
        }
        console.log(count, 'cnt res')

        return {'sss': 1}
    }

    excelDateToJSDate(excelDate) {
        const isDate = date => Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime())

        const SECONDS_IN_DAY = 24 * 60 * 60;
        const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000;
        const MAGIC_NUMBER_OF_DAYS = (25567 + 2);

        if (!Number(excelDate)) {
            return null
        }

        const delta = excelDate - MAGIC_NUMBER_OF_DAYS;
        const parsed = delta * MISSING_LEAP_YEAR_DAY;
        const date = new Date(parsed)

        if (!isDate(date)) {
            return null
        }

        return date
    }

}
