import {EduDocQuery} from "~modules/edu-org/modules/doc/core/query";

export class EduDocAdminQuery extends EduDocQuery {

    withRequired() {
        super.withRequired()
        this.query.populate('order')
        return this
    }
}

