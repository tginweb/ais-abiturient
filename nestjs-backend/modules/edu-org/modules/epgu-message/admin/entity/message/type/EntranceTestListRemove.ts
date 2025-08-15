import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";

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
export class EntranceTestListRemove extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EntranceTestList'
    }

    get epguAction() {
        return 'Remove'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {
        const entity: EduAdmissionModel = await this.getArgEntity()


        const tests = []

        let IdObject = 1

        for (const competition of entity.competitions) {

            if (competition.admissionNumber) {

                if (!competition.celevOrg) {
                    continue;
                }

                for (const test of competition.tests) {

                    let data = {}

                    const subject: EduSubjectModel = test.subject as EduSubjectModel

                    const comUid = competition.celevOrg ? entity.id + '.' + competition.csource + '.cel.' + competition.celevOrg :  entity.id + '.' + competition.csource

                    data['Uid'] = 'test:' + comUid + '.' + subject.id
                    data['IdObject'] = IdObject++

                    tests.push(data)
                }
            }
        }

        return {
            'EntranceTestList': {
                'EntranceTest': tests
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


