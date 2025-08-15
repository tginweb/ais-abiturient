import {EduCompetitionQuery} from "../core/query";

export class EduCompetitionAdminQuery extends EduCompetitionQuery {


    filtersSchema() {
        return {
            haveDopnabor: async (result, cond) => {
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
            mode: async (result, cond) => {

                switch (cond) {

                    case 'fac.own':

                        const user = this.context.user

                        if (user.instituteNids) {

                            let instituteNid = user.instituteNids.map((item) => {
                                return typeof item === 'object' ? item['$numberInt'] : item
                            })

                            if (user._id.toString() === '5eff00bc2355ff6d6f478c14') { // MAG
                                result.$and.push({
                                    clevel: 3
                                })
                            } else if (user._id.toString() === '5f02966871919ee3693b699b') { // cms

                            } else if (user._id.toString() === '5f0430807f9b332dcad32712') { // mrcpk

                            } else {
                                result.$and.push({
                                    cfac: {$in: instituteNid}
                                })
                            }
                        }


                        break
                }
            },
        }
    }
}

