import {AbitOrderQuery} from "../../core/order/query"
import {AbitTestPassingTypeEnum} from "~modules/edu-org/modules/abit/core/test/enum";
import * as mongoose from "mongoose";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";

export class AbitOrderAdminQuery extends AbitOrderQuery {


    filtersSchema() {
        return {
            decree: async (result, cond) => {

                if (cond.in) {
                    if (cond.in.indexOf(false) > -1) {
                        result.$and.push({
                            $or: [
                                {'decreeNid': {$exists: false}},
                                {'decreeNid': null}
                            ]
                        })
                    }

                    const decreeNids = cond.in.filter(item => !!item)
                    if (decreeNids.length) {
                        result.$and.push({
                            decreeNid: {$in: decreeNids}
                        })
                    }
                }
            },

            haveEgeNotVerified: async (result, cond) => {

                if (cond.eq === true) {

                    const tests = await this.context.abitTestService.model.find({
                        passingType: AbitTestPassingTypeEnum.EGE,
                        resultVerified: {$ne: true}
                    }, ['_id', 'orderId'])


                    const orderIds = tests.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })
                } else if (cond.eq === false) {

                    const tests = await this.context.abitTestService.model.find({
                        abitPassingType: AbitTestPassingTypeEnum.EGE,
                        resultVerified: {$ne: true}
                    }, ['_id', 'orderId'])

                    const orderIds = tests.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$nin: orderIds}
                    })
                }
            },

            isdopChecked: async (result, cond) => {

                if (cond.eq === true) {
                    result.$and.push({
                       isdop: true
                    })
                } else if (cond.eq === false) {
                    result.$and.push({
                       isdop: {$ne: true}
                    })
                }
            },
            dopnabExists: async (result, cond) => {

                if (cond.eq === 'all') {

                    const apps = await this.context.appService.model.find({
                        competitionUid: {
                            $regex: new RegExp('dopadm', "i")
                        }
                    }, ['_id', 'orderId'])

                    const orderIds = apps.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })

                } else if (cond.eq === 'active') {

                    const apps = await this.context.appService.model.find({
                        competitionUid: {
                            $regex: new RegExp('dopadm', "i")
                        },
                        statusId: {$nin: [12,14,15]}
                    }, ['_id', 'orderId'])

                    const orderIds = apps.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })
                }
            },


            prezachExists: async (result, cond) => {

                if (cond.eq === true) {
                    result.$and.push({
                        $and: [
                            {'prezachCompetitionId': {$gt: 0}},
                        ]
                    })
                } else if (cond.eq === false) {
                    result.$and.push({
                        $and: [
                            {'prezachCompetitionId': {$exists: false}},
                        ]
                    })
                }
            },

            podldocOrgExists: async (result, cond) => {

                if (cond.eq === true) {

                    result.$and.push({
                        $and: [
                            {'podldocOrg': {$exists: true}},
                            {'podldocOrg': {$ne: ''}}
                        ]
                    })

                } else if (cond.eq === false) {
                    result.$and.push({
                        $or: [
                            {'podldocOrg': {$exists: false}},
                            {'podldocOrg': {$eq: ''}}
                        ]
                    })
                }
            },

            aisFioNotEqual: async (result, cond) => {

                if (cond.eq === true) {

                    const orders = await this.context.orderService.model.find({
                        'ais.aisId': {$gt: 0},
                        'deleted': {$ne: true}
                    }, ['_id', 'anket.personal.lastName', 'ais.state.lname'])

                    const orderIds = orders.filter(order => {
                        return order.anket.personal.lastName.trim().toLowerCase() !== order.ais.state.lname.trim().toLowerCase()
                    })

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })

                } else if (cond.eq === false) {

                }
            },

            eduOriginal: async (result, cond) => {

                if (cond.eq === true) {

                    result.$and.push({
                        '$or': [
                            {podldoc: true},
                            {podldocEpgu: true},
                        ]
                    })

                } else if (cond.eq === 'print') {
                    result.$and.push({
                        podldoc: true
                    })
                } else if (cond.eq === 'epgu') {
                    result.$and.push({
                        podldocEpgu: true
                    })
                }
            },

            bvi: async (result, cond) => {

                if (cond.eq === true) {

                    const apps = await this.context.appService.model.find({
                        bvi: true
                    }, ['_id', 'orderId'])

                    const orderIds = apps.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })

                } else if (cond.eq === false) {

                    const apps = await this.context.appService.model.find({
                        $or: [
                            {bvi: false},
                            {bvi: {$exists: false}},
                        ]
                    }, ['_id', 'orderId'])

                    const orderIds = apps.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })

                }
            },

            epguAppGroupExists: async (result, cond) => {

                if (cond.eq === 'have_skiped') {

                    const appGroups = await this.context.appGroupService.model.find({
                        epguGuid: {$exists: false}
                    }, ['_id', 'orderId'])

                    const orderIds = appGroups.map(item => mongoose.Types.ObjectId(item.orderId))

                    result.$and.push({
                        $or: [
                            {'_id': {$in: orderIds}},
                        ]
                    })
                } else if (cond.eq === 'have_skiped_dopnabor') {

                    const appGroups = await this.context.appGroupService.model.find({
                        epguGuid: {$exists: false},
                        isDopnabor: true
                    }, ['_id', 'orderId'])

                    const orderIds = appGroups.map(item => mongoose.Types.ObjectId(item.orderId))

                    result.$and.push({
                        $or: [
                            {'_id': {$in: orderIds}},
                        ]
                    })
                }

            },

            appInorder: async (result, cond) => {

                if (cond.eq) {

                    let clevel, csource

                    let additFilter: any = {}

                    switch (cond.eq) {
                        case 'bak_budget_all':
                            clevel = [1,2]
                            csource = [1,2,4,5]
                            break;
                        case 'bak_budget':
                            clevel = [1,2]
                            csource = [1]
                            break;
                        case 'bak_target':
                            clevel = [1,2]
                            csource = [4]
                            break;
                        case 'bak_quota':
                            clevel = [1,2]
                            csource = [2]
                            break
                        case 'bak_specquota':
                            clevel = [1,2]
                            csource = [5]
                            break
                        case 'bak_commerce':
                            clevel = [1,2]
                            csource = [3]
                            break;
                        case 'mag_budget':
                            clevel = [3]
                            csource = [1]
                            break
                        case 'bakdop_budget':
                            clevel = [1,2]
                            csource = [1]
                            additFilter.competitionUid = {
                                $regex: new RegExp('dopadm', "i")
                            }
                            break
                        case 'bakdop_budget_quota':
                            clevel = [1,2]
                            csource = [2,4,5,7,8]
                            additFilter.competitionUid = {
                                $regex: new RegExp('dopadm', "i")
                            }
                            break
                    }

                    const admissions = await this.context.admissionService.model.find({
                        clevel: {$in: clevel}
                    }, ['id'])

                    const apps = await this.context.appService.model.find({
                        statusId: AppStatusEnum.INORDER,
                        csource: csource,
                        cadmission: {$in: admissions.map(item => item.id)},
                        ...additFilter
                    }, ['_id', 'orderId'])

                    const orderIds = apps.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        $or: [
                            {'_id': {$in: orderIds}},
                        ]
                    })
                }

            },

            appStatus: async (result, cond) => {

                if (cond.in) {

                    const apps = await this.context.appService.model.find({
                        statusId: {$in: cond.in}
                    }, ['_id', 'orderId'])

                    const orderIds = apps.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        $or: [
                            {'_id': {$in: orderIds}},
                        ]
                    })

                }
            },

            cinstituteChanged: async (result, cond) => {

                if (cond.eq === true) {
                    result.$and.push({
                        cinstitute: {$gt: 0},
                        'firstApp.cfac': {$gt: 0},
                        $expr: {$ne: ["$cinstitute", "$firstApp.cfac"]}
                    })
                } else {

                }
            },

            haveInternalTestsSubjects: async (result, cond) => {

                if (cond.in) {

                    const tests = await this.context.abitTestService.model.find({
                        $and: [
                            {
                                csubject: cond.in
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

                    result.$and.push({
                        $or: [
                            {'_id': {$in: orderIds}},
                        ]
                    })

                }
            },
            haveInternalTests: async (result, cond) => {
                if (cond.eq) {

                    const tests = await this.context.abitTestService.model.find({
                        $or: [
                            {abitPassingType: AbitTestPassingTypeEnum.INTERNAL},
                            {passingType: AbitTestPassingTypeEnum.INTERNAL}
                        ]
                    }, ['_id', 'orderId'])

                    const orderIds = tests.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        $or: [
                            {'anket.education.prevEduLevel': 4},
                            {'_id': {$in: orderIds}},
                        ]
                    })

                }
            },
            haveEgeTests: async (result, cond) => {

                if (cond.eq === true) {

                    const tests = await this.context.abitTestService.model.find({
                        $or: [
                            {abitPassingType: AbitTestPassingTypeEnum.EGE},
                            {passingType: AbitTestPassingTypeEnum.EGE}
                        ]
                    }, ['_id', 'orderId'])

                    const orderIds = tests.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })
                } else if (cond.eq === false) {

                    const tests = await this.context.abitTestService.model.find({
                        $or: [
                            {abitPassingType: AbitTestPassingTypeEnum.EGE},
                            {passingType: AbitTestPassingTypeEnum.EGE}
                        ]
                    }, ['_id', 'orderId'])

                    const orderIds = tests.map(test => mongoose.Types.ObjectId(test.orderId))

                    result.$and.push({
                        '_id': {$in: orderIds}
                    })
                }
            },
            achievementsExists: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'anket.entrance.achievements': {$exists: true, $ne: []}},
                        {'anket.entrance.achievements': {$elemMatch: {ball: {$gt:0}}}},
                    )
            },
            aisExists: (result, cond) => {
                if (cond.eq)
                    result.$and.push(
                        {'ais.aisId': {$gt: 0}},
                    )
                else
                    result.$and.push(
                        {'ais.aisId': {$exists: false}},
                    )
            },
            lkPorted: (result, cond) => {
                if (cond.eq)
                    result.$and.push(
                        {'lk.portedLast': true},
                    )
                else
                    result.$and.push(
                        {'lk.portedLast': false},
                    )
            },
            appsErrorsType: (result, cond) => {
                switch (cond.eq) {
                    case 'any':
                        result.$and.push(
                            {
                                $and: [
                                    {appsErrors: {$ne: []}},
                                    {appsErrors: {$exists: true}}
                                ],
                            },
                        )
                        break;
                    case 'disordered':
                        result.$and.push(
                            {'appsErrors': {$elemMatch: {type: 'disordered'}}},
                        )
                        break;
                    case 'dismatch':
                        result.$and.push(
                            {'appsErrors': {$elemMatch: {type: 'dismatch'}}},
                        )
                        break;
                }

            },
            epguExists: (result, cond) => {
                if (cond.eq)
                    result.$and.push(
                        {'epgu.guid': {$exists: true}},
                    )
                else
                    result.$and.push(
                        {'epgu.guid': {$exists: false}},
                    )
            },
            lkExists: (result, cond) => {
                if (cond.eq)
                    result.$and.push(
                        {'userId': {$exists: true}},
                    )
                else
                    result.$and.push(
                        {'userId': {$exists: false}},
                    )
            },

            haveAgreementFile: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'send.agreementDocFile.0': {$exists: true}},
                    )
            },
            nooperator: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {
                            $or: [
                                {coperator: {$exists: false}},
                                {coperator: {$eq: null}}
                            ],
                        },
                    )
            },
            haveCompanyMessages: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'chat.companyCount': {$gt: 0}},
                    )
            },
            haveClientMessages: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'chat.clientCount': {$gt: 0}},
                    )
            },
            haveUnreadedByCompanyMessages: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'chat.unreadedByCompany': {$gt: 0}},
                    )
            },
            subjectsHaveStatusInternal: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'anket.entrance.subjects.status': {$eq: 'internal'}},
                    )
            },
            mailNotSend: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {'mail.sendDate': {$exists: false}},
                    )
            },

            mode: async (result, cond) => {

                switch (cond) {

                    case 'admin.mailingFor':

                        result.$and.push(
                            {
                                userId: {$exists: true},
                                'state.status': {$in: ['draft', 'fix_apps', 'fix_anket']},
                                eduType: 2
                            }
                        )

                        break

                    case 'epgu.all':

                        result.$and.push(
                            {
                                onEpgu: true
                            }
                        )
                        break


                    case 'fac.taken':
                    case 'fac.primary':
                    case 'fac.russian':
                    case 'fac.foreign':
                    case 'fac.candidate':
                    case 'fac.all':


                        if (cond === 'fac.russian') {
                            result.$and.push(
                                {
                                    'anket.personal.citizenship': {$eq: 'russia'}
                                }
                            )
                        }

                        if (cond === 'fac.foreign') {
                            result.$and.push(
                                {
                                    'anket.personal.citizenship': {$in: ['sng', 'compatriot', 'other']}
                                }
                            )
                        }

                        if (cond === 'fac.candidate') {
                            result.$and.push(
                                {
                                    'state.status': {$eq: 'candidate'}
                                }
                            )
                        }

                        const user = this.context.user

                        if (cond === 'fac.taken') {

                            if (user.instituteNids) {

                                let instituteNid = user.instituteNids.map((item) => {
                                    return typeof item === 'object' ? item['$numberInt'] : item
                                })

                                if (user._id.toString() === '5eff00bc2355ff6d6f478c14') { // MAG
                                    result.$and.push(
                                        {
                                            $or: [
                                                {
                                                    eduType: {$in: [3]}
                                                }
                                            ]
                                        }
                                    )

                                } else if (user._id.toString() === '5f02966871919ee3693b699b') { // cms
                                    result.$and.push(
                                        {
                                            $or: [
                                                {'anket.personal.citizenship': {$ne: 'russia'}}
                                            ]
                                        }
                                    )
                                } else if (user._id.toString() === '5f0430807f9b332dcad32712') { // mrcpk

                                } else {
                                    result.$and.push(
                                        {
                                            $or: [
                                                {
                                                    cinstitute: {$in: instituteNid}
                                                }
                                            ]
                                        },
                                    )
                                }
                            }

                        } else if (cond === 'fac.primary') {

                            if (user._id.toString() === '5eff00bc2355ff6d6f478c14') { // MAG
                                result.$and.push(
                                    {
                                        $or: [
                                            {
                                                eduType: {$in: [3]}
                                            }
                                        ]
                                    }
                                )
                            } else if (user._id.toString() === '5f02966871919ee3693b699b') { // cms
                                result.$and.push(
                                    {
                                        $or: [
                                            {'anket.personal.citizenship': {$ne: 'russia'}}
                                        ]
                                    }
                                )
                            } else if (user._id.toString() === '5f0430807f9b332dcad32712') { // mrcpk

                            } else if (user.instituteNids) {

                                result.$and.push(
                                    {
                                        'firstApp.cfac': {$in: user.instituteNids}
                                    }
                                )
                            }
                        }

                        break

                    case 'operator.active':

                        result.$and.push(
                            {
                                $or: [
                                    {'anket.personal.citizenship': {$ne: 'other'}},
                                    {aisPortedByOperator: true}
                                ]
                            },
                            {
                                coperator: this.context.userId
                            },
                            {
                                $or: [
                                    {cinstitute: {$exists: false}},
                                    {cinstitute: {$eq: null}},
                                    {aisPortedByOperator: true}
                                ]
                            }
                        )

                        break

                    case 'operator.queue':

                        result.$and.push(
                            {
                                $or: [
                                    {
                                        $and: [
                                            {'anket.personal.citizenship': {$ne: 'other'}},
                                            {
                                                $or: [
                                                    {'state.status': {$in: ['sended']}},
                                                    {'state.changedFromEpgu': true}
                                                ],
                                            },
                                            {
                                                $or: [
                                                    {cinstitute: {$exists: false}},
                                                    {cinstitute: {$eq: null}}
                                                ],
                                            }
                                        ],
                                    },
                                    {
                                        $and: [
                                            {aisPortedByOperator: true},
                                            {aisPorted: {$exists: false}}
                                        ],
                                    }
                                ]
                            },
                            {
                                $or: [
                                    {coperator: {$exists: false}},
                                    {coperator: {$eq: null}}
                                ]
                            }
                        )

                        break

                    case 'operator.archive':

                        result.$and.push(
                            {
                                coperator: this.context.userId
                            },
                            {
                                $or: [
                                    {cinstitute: {$exists: true}},
                                ]
                            },
                        )

                        break

                    case 'operator.all':


                        break
                }
            },
        }
    }
}


