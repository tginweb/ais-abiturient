import {BadRequestException, Controller, Get, Header, NotFoundException, Query, Response} from '@nestjs/common';
import {AbitOrderService} from "../../core/order/service";
import * as fs from "fs";
import {FileService} from "~modules/file/core/service";
import {AbitOrderAdminService as ModelAdminService} from "./service";
import {promisify} from "util";
import {EduDecreeService} from "~modules/edu-org/modules/decree/core/service";
import * as os from "os";

const readFile = promisify(fs.readFile)

const path = require('path')
const mime = require('mime')

@Controller('abit/order/admin/ais')
export class AbitOrderAdminAisController {
    constructor(
        private readonly orderService: AbitOrderService,
        private readonly fileService: FileService,
        private readonly modelAdminService: ModelAdminService,
        private readonly decreeService: EduDecreeService,
    ) {

    }

    @Header('Content-Type', 'text/plain')
    @Get('applicationFind')
    async applicationFind(
        @Query('id') id: any,
        @Query('passport_ser') docSerial: string,
        @Query('passport_num') docNumber: string,
        @Query('lname') lname: string,
        @Query('fname') fname: string,
        @Query('mname') mname: string,
        @Query('authkey') authkey: string
    ): Promise<any> {

        if (authkey !== 'EpWAKfGSLwBNJrnFVI3fOEemitsjYAoG') throw new BadRequestException();

        const input: any = {
            filter: {}
        }

        if (id)
            input.filter.nid = parseInt(id)

        if (docSerial)
            input.filter['personal.docSerial'] = docSerial

        if (docNumber)
            input.filter['personal.docNumber'] = docNumber

        if (lname)
            input.filter['personal.lastName'] = lname

        if (fname)
            input.filter['personal.firstName'] = fname

        if (mname)
            input.filter['personal.secondName'] = mname

        const orders = await this.orderService.model.find(input).limit(5).exec()

        // @ts-ignore
        return orders.map((order) => {
            return {
                id: order.nid,
                lname: order.anket.personal.lastName.trim(),
                fname: order.anket.personal.firstName.trim(),
                mname: order.anket.personal.secondName.trim(),
                passport_ser: order.anket.personal.doc.serial.trim(),
                passport_num: order.anket.personal.doc.number.trim(),
            }
        })
    }

    @Header('Content-Type', 'text/plain')
    @Get('get-decrees')
    async getDecrees(
        @Query('authkey') authkey: string
    ): Promise<any> {
        try {
            if (authkey !== 'nSWDvK292wF2zs22q') throw new BadRequestException('Ошибка доступа')

            const entities = await this.decreeService.model.find()

            const rows: any = [
                [
                    'id',
                    'name',
                    'aisNumber',
                    'aisId',
                ].join("\t")
            ]

            for (const entity of entities) {
                const row = [
                    entity.nid,
                    entity.name,
                    entity.aisNumber,
                    entity.aisId,
                ]
                rows.push(row.join("\t"))
            }
            return rows.join(os.EOL)
        } catch (e) {
            return e.message
        }
    }

    @Header('Content-Type', 'text/plain')
    @Get('get-decree')
    async getDecree(
        @Query('id') id: number,
        @Query('aisId') aisId: number,
        @Query('aisNumber') aisNumber: number,
        @Query('authkey') authkey: string
    ): Promise<any> {
        try {
            if (authkey !== 'nSWDvK292wF2zs22q') throw new BadRequestException('Ошибка доступа')

            const filter: any = {}

            if (id) {
                filter.nid = id
            }
            if (aisId) {
                filter.aisId = aisId
            }
            if (aisNumber) {
                filter.aisNumber = aisNumber
            }

            const decree = await this.decreeService.model.findOne(filter)

            const rows: any = [
                [
                    'id',
                    'fio',
                    'snils',
                    'cadmission',
                    'competition',
                    'aisId',
                ].join("\t")
            ]

            if (decree) {
                const orders = await this.modelAdminService.query().where({'decreeNid': decree.nid}).withRequired().execMany()

                for (const order of orders) {
                    const row = [
                        order.nid,
                        order.fio,
                        order.snilsReal,
                        order.prezachCompetition ? order.prezachCompetition.cadmission : '',
                        order.prezachCompetition ? order.prezachCompetition.name : '',
                        order.ais.aisId,
                    ]
                    rows.push(row.join("\t"))
                }
            }

            return rows.join(os.EOL)

        } catch (e) {
            return e.message
        }
    }


    @Header('Content-Type', 'text/plain')
    @Get('get-abit')
    async getAbit(
        @Query('id') id: number,
        @Query('authkey') authkey: string
    ): Promise<any> {
        try {
            if (authkey !== 'nSWDvK292wF2zs22q')
                throw new BadRequestException('Ошибка доступа')
            if (!id)
                throw new BadRequestException('Не задан ID абитуриента');
            const order = await this.modelAdminService.query().where({'nid': id}).withRequired().execOne()
            return order.aisGenerate(this)
        } catch (e) {
            return e.message
        }
    }


    @Get('applicationFileDownload')
    async applicationFileDownload(
        @Query('appId') appId: number,
        @Query('fileId') fileId: number,
        @Query('authkey') authkey: string,
        @Response() response) {

        if (authkey !== 'EpWAKfGSLwBNJrnFVI3fOEemitsjYAoG') throw new BadRequestException();

        let fileEntity = await this.fileService.findOneBy('nid', fileId);

        if (!fileEntity) throw new NotFoundException();

        try {

            let filepath = path.join(process.cwd(), 'uploads/' + fileEntity.filename)

            await fs.promises.access(filepath);

            const data = fs.createReadStream(filepath);

            response.setHeader("Content-Type", mime.lookup(filepath));

            data.pipe(response);

        } catch (e) {

            throw new NotFoundException();
        }

    }

    @Get('aisEntrantsImport')
    async aisEntrantsImport(@Response() response) {

        const filepath = path.join(process.cwd(), 'import/ais-students.json')

        const data = JSON.parse(await readFile(filepath, 'utf8'));

        const students = Object.values(data.students)

        console.log(students)

        let count = 0

        for (const student of Object.values(data.students)) {
            //await this.service.importEntrantFromAisJson(student)
            //await this.abitOrderAdminService.aisUpdateEntrant(student)
        }

        return {ok: true}

    }

}
