import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {AbitAppModel} from "~modules/edu-org/modules/abit/core/app";

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
export class CompetitiveGroupListAdd extends EduEpguMessageModel {

    get epguEntityType() {
        return 'CompetitiveGroupListAdd'
    }

    get epguAction() {
        return 'Add'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async getPacket(entity: AbitAppModel, IdObjects) {

        const appGroup = await entity.getAppGroup()

        IdObjects.push(entity)

        const appEpguGuid = appGroup.epguGuid || entity.epgu.guid

        const packet: any = {
            IdObject: IdObjects.length,
            GuidApplication: appEpguGuid,
            UidCompetition: entity.competitionUid,
            IdStatus: entity.statusId,
            Priority: {}
        }

        if (entity.csource === 4) {
            packet.Priority.PriorityTarget = entity.priorityTarget || entity.priority
        } else {
            packet.Priority.PriorityOther = entity.priority
        }

        return packet
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


