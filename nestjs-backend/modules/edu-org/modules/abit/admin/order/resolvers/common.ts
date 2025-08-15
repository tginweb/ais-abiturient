import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {Response} from "~lib/response";

import {EntityService} from "~modules/entity/entity.service";
import {MailService} from "~modules/mail/mail.service";

import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {UserService} from "~modules/user/core/user.service";

import {ReturnModelType} from "@typegoose/typegoose";

import {AbitOrderModel, AbitOrderModel as Model} from "../../../core/order/model"
import {AbitOrderService as ModelCoreService} from "../../../core/order/service"
import {AbitOrderAdminService as ModelAdminService} from "../service"

import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";

import {abitOrderStatusList} from "../../../core/order/statics/status";
import {AbitOrderCollection} from "~modules/edu-org/modules/abit/core/order/collection";
import {EduEpguDictionaryService} from "~modules/edu-org/modules/epgu-dictionary/core/service";
import {AbitTestService} from "~modules/edu-org/modules/abit/core/test/service";
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import * as mongoose from "mongoose";

import {promisify} from "util";
import * as fs from "fs";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "~modules/user/core/guards/userRolesAdminGuard";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core";
import {AbitAppGroupService} from "~modules/edu-org/modules/abit/core/app-group";

const readFile = promisify(fs.readFile)
const path = require('path')
const mime = require('mime')

async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@UseGuards(UserRolesAdminGuard)
@Resolver('EduOrder')
export class AbitOrderAdminCommonResolvers {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly adminService: ModelAdminService,
        private readonly userService: UserService,
        private readonly entityService: EntityService,
        private readonly epguDictonaryService: EduEpguDictionaryService,
        private readonly eduSubjectService: EduSubjectService,
        private mailService: MailService,
        private abitTestService: AbitTestService,
        protected readonly subjectService: EduSubjectService,
        protected readonly appService: AbitAppService,
        protected readonly admissionService: EduAdmissionService,
        protected readonly appGroupService: AbitAppGroupService,
    ) {
    }


    @Query('edu_order_admin_users_options')
    async usersOptions(@Args() args, @Info() info) {

        const res = []

        const query = this.userService.query().limit(20)

        if (args.filter && args.filter.query) {
            query.where({
                lastName: {$regex: new RegExp(args.filter.query, "i")}
            })
        } else if (args.id) {
            query.where({
                _id: args.id
            })
        }

        const users = await query.execMany()

        for (const user of users) {
            res.push({
                id: user._id,
                label: user.fio,
            })
        }

        return res
    }

    @Query('edu_order_admin_single')
    async single(@Args() args, @Info() info) {
        const query = this.adminService.query()
        await query
            .withViewAdmin(true)
            .findOne()
            .clientFilterAsync(args.filter, this.model)

        return query.execOne()
    }

    @Query('edu_order_admin_moodle_recordset')
    async moodleRecordset(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {


        const query = this.adminService.query()

        query
            .limit(20000)
            .withViewAdmin()

        const csubjects = args.filter.subjects ? args.filter.subjects.in : []

        if (args.filter.subjects?.in && args.filter.subjects?.in.length) {

            const tests = await this.abitTestService.model.find({
                $and: [
                    {
                        csubject: csubjects
                    },
                    {
                        $or: [
                            {abitPassingType: AbitTestPassingTypeEnum.INTERNAL},
                            {passingType: AbitTestPassingTypeEnum.INTERNAL}
                        ]
                    }
                ]
            }, ['_id', 'orderId'])

            const orderIds = tests.map(test => mongoose.Types.ObjectId(test.orderId))

            query.where({
                $and: [
                    {
                        _id: orderIds,
                        'firstApp.competitionId': {$exists: true}
                    },
                    {
                        $or: [
                            {cinstitute: {$exists: true}},
                            {'state.status': {$in: ['sended', 'fix_apps', 'fix_anket', 'sended_fixed', 'accepted']}},
                        ]
                    }
                ]
            })

        } else {

            query.where({nid: -100})
        }

        const orders: AbitOrderModel[] = await query.execMany()

        const result = []


        const subjectsById = (await this.subjectService.query().execMany()).reduce((map, item) => {
            map[item.id] = item
            return map
        }, {})

        for (const order of orders) {
            const tests = await order.getTests()
            for (const csubject of csubjects) {
                for (const test of tests) {
                    if (
                        test.csubject === csubject &&
                        (
                            test.abitPassingType === AbitTestPassingTypeEnum.INTERNAL ||
                            test.passingType === AbitTestPassingTypeEnum.INTERNAL
                        )
                    ) {
                        result.push({
                            csubject: csubject,
                            subjectName: subjectsById[csubject].name,
                            order: order,
                            subject: {}
                        })
                    }
                }
            }
        }

        return result
    }

    @Query('edu_order_admin_listRecordset')
    async recordset(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const query = this.adminService.query()
        await query
            .addContext(this.getDbQueryContext(user))
            .addContext({
                abitTestService: this.abitTestService,
                appService: this.appService,
                orderService: this.coreService,
                admissionService: this.admissionService,
                appGroupService: this.appGroupService
            })
            .clientFilterAsync(args.filter, this.model)




        query.where({
            // nid: {$gt: 108769}
            // nid: nids.split("\n")
            // 'anket.personal.snils': {$in: snilses}
        })

        return query
            .withNavPublic(args.nav || {})
            .withViewAdmin()
            .getGraph()
    }


    @Query('edu_order_admin_list_sverka')
    async list_sverka(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const filepath = path.join(process.cwd(), '/sverka.json')

        let nodes

        try {
            nodes = JSON.parse(await readFile(filepath, 'utf8'));
        } catch (e) {

        }

        return nodes
    }

    getDbQueryContext(user) {
        return {
            user: user,
            userId: user._id,
            entityService: this.entityService
        }
    }

    @Query('edu_order_admin_list')
    async list(
        @Args() args,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        const query = this.adminService.query()
        await query
            .addContext(this.getDbQueryContext(user))
            .filterIds(args)
            .clientFilterAsync(args.filter, this.model)

        return query
            .withNavPublic(args.nav || {})
            .withViewAdmin()
            .exec()
    }

    @Query('edu_order_admin_statusList')
    async statusList(@Args() args, @Info() info) {
        return abitOrderStatusList
    }

    @Query('edu_order_admin_appStatusList')
    async appStatusList(@Args() args, @Info() info) {

        const items = await this.epguDictonaryService.find({taxonomy: 'ApplicationStatus'}, {
            sortField: 'id',
            sortAscending: true
        })

        return items.map(item => {
            const res = item

            if ([2, 3, 8, 12].indexOf(item.id) > -1) {
                res.selectable = true
            }

            return res
        })
    }

    @Query('edu_order_admin_listFilters')
    async listFilters(@Args() args, @Info() info) {
        return await this.adminService.getFiltersTree()
    }

    @Query('edu_order_admin_moodle_filters')
    async moodleFilters(@Args() args, @Info() info) {
        const subjects = await this.subjectService.find()

        const res = [
            {
                label: 'Предметы',
                path: 'subjects',
                control: 'dropdown',
                multiple: true,
                op: 'in',
                useChips: true,
                options: subjects.map(item => ({
                    label: item.name,
                    value: item.id,
                }))
            },
        ]

        return res
    }


    @ResolveField()
    async actions(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAdminPerms ? require('./../model-methods/getActions').default.call(parent, user) : []
    }

    @ResolveField()
    async perms(
        @Parent() parent: AbitOrderModel,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return parent.getAdminPerms ? parent.getAdminPerms(user) : {}
    }

    @Mutation('edu_order_admin_change_user')
    async changeUser(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response();

        try {
            let order = await this.coreService.query().getByIdOrNid(args.id)
            order.userId = args.userId
            await order.savePromise()
            response.addSuccess('Пользователь изменен', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }

    @Mutation('edu_order_admin_action')
    async action(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response();

        try {

            let docsCollection: AbitOrderCollection
            let docs: AbitOrderModel[]

            if (args.selectAll) {

                const query = this.adminService.query()
                await query
                    .addContext(this.getDbQueryContext(user))
                    .addContext({
                        abitTestService: this.abitTestService,
                        appService: this.appService,
                        admissionService: this.admissionService
                    })
                    .clientFilterAsync(args.selectFilter, this.model)

                //query.where({'lk.portedLast': true})

                docs = await query.withView('admin').execMany()
            } else {
                docsCollection = await this.coreService.query().filterIds(args).withView('admin').execCollection(AbitOrderCollection)
                docs = docsCollection.checkIds(args).all()
            }

            let index = 1

            for (const doc of docs) {
                await this.adminService['entityAction_' + args.action](doc, args.params, user)
            }

            response.addSuccess('Заявление обновлены ' + docs.length, {notify: true})

        } catch (e) {
            response.addError(e.message, {notify: true})
        }

        return response.getJson()
    }


    @Mutation('edu_order_admin_set_predzach_status')
    async set_predzach_status(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response();

        try {
            let order = await this.coreService.query().getById(args.id)

            if (order) {
                order.prezachStatus = args.status
            }
            await order.savePromise()
            response.addSuccess('Статус изменен', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }

    @Mutation('edu_order_admin_set_predzach_compet')
    async set_predzach_compet(
        @Args() args: any,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        let response = new Response();

        try {
            let order = await this.coreService.query().getById(args.id)

            if (order) {
                order.prezachCompetitionId = args.competitionId
                await order.savePromise()
            }

            response.addSuccess('Абитуриент внесен в список КГ', {notify: true})
        } catch (e) {
            response.addError(e.message, {notify: true})
        }
        return response.getJson()
    }
}
