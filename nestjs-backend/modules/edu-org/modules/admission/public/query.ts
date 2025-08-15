
import {EduAdmissionQuery} from "~modules/edu-org/modules/admission/core/query";

export class EduAdmissionPublicQuery extends EduAdmissionQuery {

    withViewPublic() {

        //this.query.withView('public')
        this.query.populate('subjects.subject')
        this.query.populate('direction')
        this.query.populate('level')
        this.query.populate('campaign')
        this.query.populate('fob')
        this.query.populate('competitions.source')
        return this
    }

}

