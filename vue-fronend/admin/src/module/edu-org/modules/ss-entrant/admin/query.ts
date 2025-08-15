import {EduSSEntrantQuery} from "~modules/edu-org/modules/ss-entrant/core/query";

export class EduSSEntrantAdminQuery extends EduSSEntrantQuery {

    withViewPublic() {

        //this.query.withView('public')
        this.query.populate('epguDocs.category')
        this.query.populate('fac')
        this.query.populate('operator')

        return this
    }


    filtersSchema() {
        return {
            changedEpgu: async (result, cond) => {
                if (cond) {

                    result.$and.push(
                        {
                            changedEpgu: true
                        },
                    )
                }
            },
            changedAis: async (result, cond) => {
                if (cond) {

                    result.$and.push(
                        {
                            changedAis: true
                        },
                    )
                }
            },
            haveEpguAgreement: async (result, cond) => {
                if (cond) {

                    const apps = await this.context.entityService.find('edu_ss_app', {agreement: true})

                    result.$and.push(
                        {
                            'snils': {$in: apps.map(app => app.snils)}
                        },
                    )
                }
            },
            haveAisAgreement: async (result, cond) => {
                if (cond) {

                    const apps = await this.context.entityService.find('edu_ais_entrant', {
                        $and: [
                            {'apps.agreement': true},
                            {state: {$ne: 8}}
                        ]
                    })

                    result.$and.push(
                        {
                            'snils': {$in: apps.map(app => app.snils)}
                        },
                    )
                }
            },
            achievementsExists: (result, cond) => {
                if (cond)
                    result.$and.push(
                        {
                            'epguDocs.type': 'achievement'
                        },
                    )
            },
            mode: async (result, cond) => {

                switch (cond) {

                    case 'fac':

                        const user = this.context.user

                        if (user.instituteNids) {

                            const admissions = await this.context.entityService.service('edu_admission').model
                                .find({cfac: user.instituteNids})
                                .select('id')

                            console.log({
                                'cfac': {$in: user.instituteNids}
                            })

                            result.$and.push(
                                {
                                    'cfac': {$in: user.instituteNids}
                                }
                            )
                        }

                        break

                }
            },
        }
    }
}


