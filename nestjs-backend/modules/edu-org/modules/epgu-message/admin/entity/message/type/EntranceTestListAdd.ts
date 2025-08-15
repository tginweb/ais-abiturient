import {modelOptions} from "@typegoose/typegoose";
import {EduEpguMessageModel} from "~modules/edu-org/modules/epgu-message/admin/entity/message";
import {EduAdmissionModel} from "~modules/edu-org/modules/admission/core/model";
import {EduSubjectModel} from "~modules/edu-org/modules/subject/core/model";
import {EduCompetitionTestModel} from "~modules/edu-org/modules/admission/core/model/competion-test";
import {EduCompetitionModel} from "~modules/edu-org/modules/competition/core";

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

        const result = []

        const competitions: EduCompetitionModel[] = await this.getArgEntities()

        let IdObject = 1

        for (const competition of competitions) {

            const admission = await this.service.admissionService.query().withViewPublic().where({id: competition.cadmission}).execOne()

            if (competition.isdop) {

                const admCompet = admission.competitions.find(item => {
                    return (!competition.isdop || item.isdop) && (item.csource === competition.csource)
                })

                const tests = [...admCompet.tests]

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
                    data['Uid'] = 'test:' + competition.uid + '.' + subject.id
                    data['UidCompetition'] = competition.uid
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
                        oviData['Uid'] = 'test:' + competition.uid + '.' + subject.id + '.ovi'
                        oviData['UidCompetition'] = competition.uid
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


