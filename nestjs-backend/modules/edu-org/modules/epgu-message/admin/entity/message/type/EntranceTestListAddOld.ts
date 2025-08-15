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
export class EntranceTestListAdd extends EduEpguMessageModel {

    get epguEntityType() {
        return 'EntranceTestList'
    }

    get epguAction() {
        return 'Add'
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

            const comUid = competition.celevOrg ? entity.id + '.' + competition.csource + '-' + competition.celevOrg :  entity.id + '.' + competition.csource

            const competUid =  'adm:' + comUid

            if (competition.admissionNumber || competition.csource === 4) {

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
                    data['Uid'] = 'test:' + comUid + '.' + subject.id
                    data['UidCompetition'] = competUid
                    data['IdEntranceTestType'] = test.epguIDEntranceTestType

                    const epguId = subject.epguId

                    if (test.optionalId) {
                        const uid = data['Uid'].split('.')
                        uid[uid.length - 1] = test.optionalId
                        data['UidReplaceEntranceTest'] = uid.join('.')
                    }

                    data['IdSubject'] = epguId
                    data['MinScore'] = test.minimal
                    data['Priority'] = test.priority

                    data['LanguageList'] = {
                        IdEntranceTestLanguage: 1
                    }

                    result.push(data)

                    if (test.isEge) {
                        let oviData = {}
                        oviData['IdObject'] = IdObject++
                        oviData['Uid'] = 'test:' + comUid + '.' + subject.id + '.ovi'
                        oviData['UidCompetition'] = competUid
                        oviData['IdEntranceTestType'] = 1
                        oviData['UidReplaceEntranceTest'] = data['Uid']
                        oviData['IdSubject'] = subject.epguId
                        oviData['MinScore'] = test.minimal
                        oviData['Priority'] = test.priority
                        result.push(oviData)
                    }
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


