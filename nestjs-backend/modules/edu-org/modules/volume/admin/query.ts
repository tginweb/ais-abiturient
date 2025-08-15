import {EduVolumeQuery} from "~modules/edu-org/modules/volume/core/query";

export class EduVolumeAdminQuery extends EduVolumeQuery {

    withViewPublic() {

        //this.query.withView('public')
        this.query.populate('subjects.subject')
        this.query.populate('direction')
        this.query.populate('edulevel')
        return this
    }
}


