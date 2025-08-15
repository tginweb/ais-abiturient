import {EduSSAppQuery} from "~modules/edu-org/modules/ss-app/core/query";

export class EduSSAppAdminQuery extends EduSSAppQuery {

    filtersSchema() {
        return {
            statusId: (result, cond) => {
                cond && result.$and.push(
                    {apps: {$elemMatch: {statusId: {$in: cond.in}}}},
                )

                console.log(result)
            },
        }
    }
}


