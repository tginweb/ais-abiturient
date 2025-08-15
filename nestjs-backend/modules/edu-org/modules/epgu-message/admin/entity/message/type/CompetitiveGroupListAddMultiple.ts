import {modelOptions} from "@typegoose/typegoose";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";
import {
    CompetitiveGroupListAdd
} from "~modules/edu-org/modules/epgu-message/admin/entity/message/type/CompetitiveGroupListAdd";

interface DocArgs {
    snils: string
    guid: string
}

@modelOptions({
    schemaOptions: {
        collection: "epgu_message",
        discriminatorKey: "type",
    }
})
export class CompetitiveGroupListAddMultiple extends CompetitiveGroupListAdd {

    get epguEntityType() {
        return 'CompetitiveGroupListAddMultiple'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {

        const apps: AbitAppModel[] = await this.getArgEntities()

        let packets = []
        let IdObjects = []

        for (const app of apps) {
            packets.push(this.getPacket(app, IdObjects))
        }

        return {
            'CompetitiveGroupList': {
                'CompetitiveGroup': packets
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


