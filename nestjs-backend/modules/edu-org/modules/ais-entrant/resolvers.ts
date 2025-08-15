import {Args, Info, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import generateClientFilter from "~lib/db/mongoose/query/generate-client-filter";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisEntrantModel as Model} from "./model"
import {EduAisEntrantQuery as ModelQuery} from "./query";
import {EduAisEntrantService} from "./service";
import {Response} from "~lib/response";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {EduFobService} from "~modules/edu-org/modules/fob/core/service"
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {UseGuards} from "@nestjs/common";
import {UserRolesAdminGuard} from "../../../user/core/guards/userRolesAdminGuard";
import {AbitOrderTypeService} from "~modules/edu-org/modules/abit/core/order-type/service";
import {aisStudentStatusList} from "~modules/edu-org/enum/ais-student-status";
@UseGuards(UserRolesAdminGuard)
@Resolver('EduAisEntrant')
export class EduAisEntrantResolvers {
    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly service: EduAisEntrantService,
        private readonly eduFobService: EduFobService,
        private readonly eduSourceService: EduSourceService,
        private readonly abitOrderTypeService: AbitOrderTypeService,
    ) {
    }
    @Query('edu_aisEntrant_recordset')
    async recordset(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        await query.clientFilterAsync(args.filter, this.model)

        return query
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .getGraph()
    }

    @Query('edu_aisEntrant_list')
    async list(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(generateClientFilter(args.filter, this.model))
            .withNavPublic(args.nav || {})
            .withViewPublic()
            .exec()
    }
    @Query('edu_aisEntrant_single')
    async single(@Args() args, @Info() info) {
        const query = new ModelQuery(this.model.find())
        return query
            .withViewPublic()
            .findOne()
            .withFilter(generateClientFilter(args.filter, this.model))
            .exec()
    }

    @Query('edu_aisEntrant_filters')
    async filters(@Args() args, @Info() info) {

        const eduFobs = await this.eduFobService.find()
        const eduSources = await this.eduSourceService.find()
        const eduOrderTypes = await this.abitOrderTypeService.find()


        const schema = [
            {
                type: 'boolean',
                label: 'Есть ордера',
                path: 'orderExists',
                op: 'eq',
            },
            {
                type: 'boolean',
                label: 'Есть приказ',
                path: 'haveDecree',
                op: 'eq',
            },
            {
                type: 'group',
                label: 'Статус',
                path: 'stateGroup',
                children: [
                    {
                        type: 'number',
                        path: 'state',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: aisStudentStatusList.map((row) => {
                            return {
                                value: row.id,
                                label: row.title,
                            }
                        })
                    },
                ]
            },
            {
                type: 'group',
                label: 'Тип',
                path: 'eduTypeGroup',
                children: [
                    {
                        type: 'number',
                        path: 'eduType',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: eduOrderTypes.map((row) => {
                            return {
                                value: row.id,
                                label: row.name,
                            }
                        })
                    },
                ]
            },
            {
                type: 'number',
                path: 'id',
                label: 'ID абитуриента',
                op: 'eq'
            },
            {
                type: 'string',
                path: 'lastName',
                label: 'Фамилия',
                op: 'like'
            },
            {
                type: 'string',
                path: 'firstName',
                label: 'Имя',
                op: 'like'
            },
            {
                type: 'string',
                path: 'secondName',
                label: 'Отчество',
                op: 'like'
            },
            {
                type: 'string',
                path: 'snils',
                label: 'СНИЛС',
                op: 'like'
            },
            {
                label: 'Основа',
                type: 'number',
                path: 'cset',
                control: 'options',
                multitple: true,
                op: 'in',
                options: [
                    {
                        label: 'Бюджет',
                        value: 1
                    },
                    {
                        label: 'Целевой',
                        value: 2
                    },
                    {
                        label: 'Коммерция',
                        value: 3
                    },
                ]
            },
            {
                label: 'Источник',
                type: 'number',
                path: 'apps.csource',
                control: 'options',
                multitple: true,
                op: 'in',
                options: eduSources.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                    }
                })
            },
            {
                label: 'Формы',
                type: 'number',
                path: 'apps.cfob',
                control: 'options',
                multitple: true,
                op: 'in',
                options: eduFobs.map(item => {
                    return {
                        value: item.id,
                        label: item.name,
                    }
                })
            },
        ]
        return schema
    }

    @ResolveField()
    apps(
        @Parent() entity: Model,
        @Info() info
    ): any {
        return entity.apps
    }

    @Mutation('edu_aisEntrant_action')
    async action(@Args() args, @Info() info) {

        let result = new Response();
        try {
            const docs = await this.service.find({_id: args.ids})

            let index = 1

            let stat = {}

            for (const doc of docs) {
               const res = await this.service['entityAction_' + args.action](doc)

                if (!stat[res]) {
                    stat[res] = 0
                }
                stat[res]++
                // console.log(index++)
            }

            console.log('done')
            console.log(stat)

            result.addSuccess('Обработано ' + docs.length, {notify: true})
        } catch (e) {
            result.addError(e.message, {notify: true})
        }

        return result.getJson()
    }

    @ResolveField()
    async actions(@Parent() parent, @Info() info, @UserCurrent() user: UserModel) {
        return require('./resolver-methods/getActions').default.call(parent, user)
    }
}

