import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";

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
export class ApplicationListAll extends EduEpguMessageModel {

    get epguEntityType() {
        return 'ApplicationList'
    }

    get epguAction() {
        return 'Get'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {
        const entity: EduAdmissionModel = await this.getArgEntity()

        let IdObject = 1

        let objects = []

        const object = {
            IdObject: IdObject++,
            OgrnOwnerOrganization: 1023801756120,
            KppOwnerOrganization: 381201001,
        }
        objects.push(object)

        return {
            'ApplicationList': {
                'Application': objects
            }
        }
    }

    async onProcessResult() {

        const payload: any = this.response.payload

        const apps = payload?.SuccessResultList?.Application

        if (apps) {
            for (const app of apps) {
                await this.context.service.eduSSAppService.ensureServiceApp(app)
            }
        }

        return true
    }

}


