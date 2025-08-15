import MongooseQueryWrapper from "~lib/db/mongoose/query/query-wrapper"
import {FileModel} from "~modules/file/core/model";

export class FileQuery extends MongooseQueryWrapper<FileModel> {
    withRequired() {
        this.where({deleted: false})
        return this
    }

    withViewAdmin(detail = false) {
        this.withRequired()
        return this
    }

    withViewPublic(detail = false) {
        this.withRequired()
        return this
    }

}




