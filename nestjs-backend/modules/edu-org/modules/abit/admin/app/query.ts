import {AbitAppQuery} from "~modules/edu-org/modules/abit/core/app/query";
import {AppStatusEnum} from "~modules/edu-org/modules/abit/core/app/enum";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";

export class EduAppAdminQuery extends AbitAppQuery {

    filtersSchema() {
        return {

            isDoubleImport: async (result, cond) => {

                if (cond.eq === true) {
                    const apps = await this.context.appService.model.find({}, ['_id', 'statusId', 'competitionId', 'orderId'])

                    const map: Record<string, (Record<string, AbitAppModel[]>)> = apps.reduce((map, app: AbitAppModel) => {
                        if (!app.isCanceled)
                            return map
                        if (!map[app.orderId]) {
                            map[app.orderId] = {}
                        }
                        const competUid = app.competitionId + '.' + app.statusId
                        if (!map[app.orderId][competUid]) {
                            map[app.orderId][competUid] = []
                        }
                        map[app.orderId][competUid].push(app)
                        return map
                    }, {})

                    let appsIds = {}

                    for (let [orderId, compets] of Object.entries(map)) {

                        for (let [competitionId, competitionApps] of Object.entries(compets)) {

                            if (competitionApps.length > 1) {
                                let wasMember = false


                                for (let app of competitionApps) {
                                    if (app.isCanceled) {
                                        appsIds[app.id] = app._id
                                    }
                                }
                            }
                        }
                    }

                    result.$and.push({
                        '_id': {$in: Object.values(appsIds)}
                    })

                } else if (cond.eq === false) {

                }
            },
            mode: async (result, cond) => {

                switch (cond) {

                    case 'fac.member':
                    case 'fac.all':

                        const user = this.context.user

                        if (user.instituteNids) {

                            let instituteNid = user.instituteNids.map((item) => {
                                return typeof item === 'object' ? item['$numberInt'] : item
                            })

                            if (user._id.toString() === '5eff00bc2355ff6d6f478c14') { // MAG
                                result.$and.push({eduType: {$in: [55]}})
                            } else if (user._id.toString() === '5eff00bc2355ff6d6f478c17') { // foreign
                                result.$and.push({'anket.personal.citizenship': 'ddddd'})
                            } else if (user._id.toString() === '5f02966871919ee3693b699b') { // cms
                                result.$and.push({eduType: {$in: [55]}})
                            } else if (user._id.toString() === '5f0430807f9b332dcad32712') { // mrcpk

                            } else {
                                result.$and.push({cfac: {$in: instituteNid}})
                            }
                        }

                        if (cond === 'fac.member') {
                            result.$and.push({
                                statusId: AppStatusEnum.COMPET_MEMBER
                            })
                        } else if (cond === 'fac.all') {


                        }

                        break

                }
            },
        }
    }
}


