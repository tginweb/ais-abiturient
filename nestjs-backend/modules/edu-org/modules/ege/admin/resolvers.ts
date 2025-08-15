import {Args, Info, Mutation, Query, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {Response} from "~lib/response";
import {EduEgeAdminService as ModelAdminService} from "./service"
import {EduEgeModel, EduEgeModel as Model} from "../core/model"
import {EduEgeService as ModelCoreService} from "../core/service"
import {EduEgeAdminQuery as ModelQuery} from "./query";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {AbitOrderService, TOrderPassport} from "~modules/edu-org/modules/abit/core/order/service";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

const dayjs = require('dayjs')

@UseGuards(UserRolesAdminGuard)
@Resolver('EduEgeAdmin')
export class EduEgeAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly orderService: AbitOrderService,
        private readonly subjectService: EduSubjectService,
        private readonly testService: AbitTestService,
    ) {
    }

    @Mutation('edu_ege_admin__action')
    async action(@Args() args, @Info() info) {

        let result = new Response();
        try {

            let docs: EduEgeModel[]

            if (args.selectAll) {
                console.log('FILTER: ' + JSON.stringify(args.selectFilter))

                const query = new ModelQuery(this.model.find())
                await query.clientFilterAsync(args.filter, this.model)

                docs = await query.withViewPublic().execMany()
            } else {
                docs = await this.coreService.query().filterIds(args).execMany()
            }

            console.log(docs.length)

            let stat = {}

            for (const doc of docs) {
                //const res = await this.adminService.entityAction(args.action, doc)

                const res = 'ss'

                if (!stat[res])
                    stat[res] = 0

                stat[res]++
            }

            console.log(stat)

            result.addSuccess('Обработано', {notify: true})
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }


    @Mutation('edu_ege_admin__packet_result_process')
    async packetResultProcess(@Args() args, @Info() info) {

        let result = new Response();


        const egeSubjects = await this.subjectService.getEgeSubjectsNormalized()

        const egeSubjectsByName = egeSubjects.reduce((map, subject) => {
            map[subject.name] = subject
            return map
        }, {})


        const ordersPassports = await this.orderService.getEgePassportsAll()


        const ordersPassportsById: Record<string, [TOrderPassport]> = ordersPassports.reduce((map, item) => {
            if (!map[item.id]) {
                map[item.id] = []
            }
            map[item.id].push(item)
            return map
        }, {})


        const lines = args.packet.split("\n")

        for (const line of lines) {

            const fields = line.split(';')

            let subjectName = (fields[6] || '').toLowerCase()

            if (!subjectName)
                continue;

            if (subjectName === 'математика профильная') {
                subjectName = 'математика'
            }

            if (subjectName === 'информатика и икт') {
                subjectName = 'информатика'
            }

            if (subjectName === 'английский язык') {
                subjectName = 'иностранный язык'
            }


            const data = {
                lastName: fields[0].toUpperCase(),
                firstName: fields[1].toUpperCase(),
                secondName: fields[2].toUpperCase(),
                passportSer: fields[3],
                passportNum: fields[4],
                date: fields[5],
                subjectName: subjectName,
                mark: fields[7],
            }

            if (!data.lastName) {
                continue;
            }

            let ege = await this.coreService.query().where({
                lastName: data.lastName,
                firstName: data.firstName,
                secondName: data.secondName,
                passportSer: data.passportSer,
                passportNum: data.passportNum,
                subjectName: subjectName,
                dateStr: data.date
            }).execOne()

            if (!ege) {
                ege = this.coreService.createModel({})
                ege.lastName = data.lastName
                ege.firstName = data.firstName
                ege.secondName = data.secondName
                ege.passportSer = data.passportSer
                ege.passportNum = data.passportNum
                ege.subjectName = subjectName
                ege.date = dayjs(data.date, 'DD.MM.YYYY').toDate()
                ege.dateStr = data.date

                const subject = egeSubjectsByName[subjectName]

                if (subject)
                    ege.csubject = subject.id
            }

            ege.mark = parseInt(data.mark)
            await ege.savePromise()

            if (ege.csubject) {
                const foundOrderPassports = ordersPassportsById[ege.hash]

                if (foundOrderPassports && foundOrderPassports.length) {
                    for (const orderPassport of foundOrderPassports) {
                        await this.testService.ensureEgeForOrder(ege, orderPassport)
                    }
                }
            }

        }
        result.addSuccess('Успешно обработано', {notify: true})

        return result.getJson()
    }

    @Query('edu_ege_admin__packet_generate')
    async packetGenerate(@Args() args, @Info() info) {

        let result = new Response();

        try {
            result.setPayload(await this.adminService.paketGenerate(args.ids))
        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Query('edu_ege_admin_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .filterIds(args)
            .clientFilter(args.filter, this.model)
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }

    @Query('edu_ege_admin_listRecordset')
    async listGraph(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }
}
