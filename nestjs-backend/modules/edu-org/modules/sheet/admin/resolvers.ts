import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduSheetAdminQuery as ModelQuery} from "./query"
import {EduSheetModel, EduSheetModel as Model, EduSheetTest} from "../core/model"
import {EduSheetService as ModelCoreService} from "../core/service"
import {EduSheetAdminService as ModelAdminService} from "./service";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {Response} from "~lib/response";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import {AbitTestModel} from "~modules/edu-org/modules/abit/core/test";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../../user/core/guards/userRolesAdminGuard";

@UseGuards(UserRolesAdminGuard)
@Resolver('EduSheet')
export class EduSheetAdminResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly testService: AbitTestService,
        private readonly orderService: AbitOrderService,
        private readonly subjectService: EduSubjectService,
    ) {

    }

    @Query('edu_sheet_admin_filters')
    async filtersTree(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Query('edu_sheet_admin_recordset')
    async listGraph(@Args() args, @Info() info, @UserCurrent() user: UserModel) {
        const query = this.adminService.query().addContext(this.coreService.getQueryContext(user))
        await query.clientFilterAsync(args.filter, this.model)
        return await query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_sheet_admin_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .clientFilter(args.filter, this.model)
            .execOne()
    }

    @ResolveField()
    async actions(
        @Parent() entity,
        @Info() info
    ) {
        return entity && entity.id && entity.getAdminActions ? entity.getAdminActions() : []
    }

    @Mutation('edu_sheet_admin_update')
    async update(@Args() args, @Info() info) {

        let result = new Response();

        try {

            let doc: EduSheetModel

            if (args.action === 'create') {
                doc = this.coreService.createModel({})
            } else {
                doc = await this.coreService.query().getById(args.id)
            }

            const model = args.model

            console.log(model)

            doc.name = model.name
            doc.excelText = model.excelText

            if (model.tests) {
                for (const inputTest of model.tests) {
                    let test: EduSheetTest = doc.tests['id'](inputTest._id)
                    if (!test) {
                        test = new EduSheetTest()
                        test.testId = inputTest.testId
                        test.ball = inputTest.ball
                        model.tests.push(test)
                    } else {
                        test['set']({
                            ball: inputTest.ball
                        })
                    }
                }
            }

            await doc.savePromise()

            result.setPayloadData('entityId', doc._id)

            result.addSuccess('Документ сохранен')

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Mutation('edu_sheet_admin_tests_add')
    async testsAdd(@Args() args, @Info() info) {

        let result = new Response();

        try {

            const sheet = await this.coreService.query().getById(args.sheetId)

            if (sheet) {
                for (const addTestId of args.testIds) {
                    if (!sheet.tests.find(test => test.testId === addTestId)) {
                        sheet.tests.push({
                            testId: addTestId,
                            ball: null
                        })
                    }
                }
                await sheet.savePromise()
            }

            result.addSuccess('Тесты добавлены')

        } catch (e) {
            console.log(e)
        }

        return result.getJson()
    }

    @Query('edu_sheet_admin_tests_fetch')
    async testsFetch(@Args() args, @Info() info): Promise<EduSheetTest[]> {
        const query = this.adminService.query() as ModelQuery
        const sheet = await query.withTests().getById(args.sheetId)
        return sheet.tests
    }

    @Query('edu_sheet_admin_excel_load')
    async excelTableLoad(@Args() args, @Info() info): Promise<Object> {

        const resultRows = []

        for (const row of args.data) {

            const resultRow: any = {}

            const fio = row.fields['Фамилия'].trim() + ' ' + row.fields['Имя Отчество'].trim()
            const mark = parseInt(row.fields['Оценка'].trim())

            const subjectName = this.orderService.getMoodleNormalizedSubjectName(row.fields['Курс'].trim()).toLowerCase()
            const subject = (await this.subjectService.getSubjectsByName())[subjectName]
            const order = await this.orderService.findOrderByMoodleAisId(row.fields.aisid)

            let test: AbitTestModel

            if (order && subject) {
                test = await this.testService.query().where({
                    orderId: order.id,
                    csubject: subject.id,
                    passingType: AbitTestPassingTypeEnum.INTERNAL
                }).execOne()
            }

            resultRow.fields = row
            resultRow.order = order
            resultRow.test = test

            resultRows.push(resultRow)
        }
        return resultRows
    }
}
