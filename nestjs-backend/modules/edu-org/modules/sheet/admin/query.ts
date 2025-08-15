import {EduSheetQuery} from "../core/query";

export class EduSheetAdminQuery extends EduSheetQuery {
    filtersSchema() {
        return {}
    }

    withTests() {
        this.query.populate({
            path: 'tests.test',
            populate: ['order', 'subject']
        })
        return this
    }
}


