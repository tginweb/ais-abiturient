import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {EduVolumeModel} from "~modules/edu-org/modules/volume/core/model";

export class EduVolumeQuery extends MongooseQueryWrapper<EduVolumeModel> {

    withViewPublic() {

        this.query.populate('direction')
        this.query.populate('level')
        this.query.populate('campaign')

        return this
    }

}
