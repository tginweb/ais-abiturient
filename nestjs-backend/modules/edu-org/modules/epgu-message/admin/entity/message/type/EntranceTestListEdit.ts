import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";
import {EduCompetitionTestModel} from "~modules/edu-org/modules/admission/core/model/competion-test";

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
export class EntranceTestListEdit extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EntranceTestList'
    }

    get epguAction() {
        return 'Edit'
    }

    getArgs(): DocArgs {
        return this.args
    }

    async generatePayload() {
        const entity: EduAdmissionModel = await this.getArgEntity()

        const levels = {
            1: 3,
            2: 2,
        }

        const fobs = {
            1: 1,
            2: 3,
        }

        const placeTypes = {
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
        }
        /*


         */

        const result = []

        let IdObject = 1

        for (const competition of entity.competitions) {

            const competUid = competition.celevOrg ? 'adm:' + entity.id + '.' + competition.csource + '-' + competition.celevOrg :  'adm:' + entity.id + '.' + competition.csource

            if (competition.admissionNumber) {

                const tests = [...competition.tests]

                const testsByPriority = {}

                for (const test of tests) {
                    test.optionalId = null

                    if (!testsByPriority[test.priority])
                        testsByPriority[test.priority] = []

                    testsByPriority[test.priority].push(test)
                }

                for (const test of tests) {
                    if (testsByPriority[test.priority].length <= 1) continue;

                    const parentTestEge: EduCompetitionTestModel = testsByPriority[test.priority].find(item => item.isEge)

                    if (parentTestEge) {
                        if (parentTestEge !== test) {
                            test.optionalId = parentTestEge.subjectId
                        }
                    } else {
                        const parentTest: EduCompetitionTestModel = testsByPriority[test.priority][0]
                        if (parentTest !== test) {
                            test.optionalId = parentTest.subjectId
                        }
                    }
                }


                for (const test of tests) {

                    let data = {}

                    const subject: EduSubjectModel = test.subject as EduSubjectModel

                    data['IdObject'] = IdObject++
                    data['Uid'] = 'test:' + entity.id + '.' + competition.csource + '.' + subject.id
                    data['IdEntranceTestType'] = test.epguIDEntranceTestType

                    const epguId = subject.epguId

                    if (!epguId)
                        continue;

                    data['IdSubject'] = epguId
                    data['MinScore'] = test.minimal
                    data['Priority'] = test.priority

                    if (test.optionalId) {
                        const uid = data['Uid'].split('.')
                        uid[uid.length - 1] = test.optionalId
                        data['UidReplaceEntranceTest'] = uid.join('.')
                    }

                    result.push(data)
                }
            }
        }


        return {
            'EntranceTestList': {
                'EntranceTest': result
            }
        }
    }

    async onProcessResult() {

        let admission: EduAdmissionModel = await this.getArgEntity()

        //await admission.savePromise()

        return true
    }

}


