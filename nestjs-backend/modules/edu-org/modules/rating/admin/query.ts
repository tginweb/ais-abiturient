import {EduRatingQuery} from "../core/query";

export class EduRatingAdminQuery extends EduRatingQuery {
    filtersSchema() {
        return {}
    } 

    withTests() {

        return this
    }
}


