import {forwardRef, Inject, Injectable} from '@nestjs/common'
import {EduAisService} from "~modules/edu-ais/edu-ais.service"
import {EduAdmissionService} from "../../admission/core/service"
import {EduDirectionService} from "../../direction/core/service"
import {EduSSEntrantService as ModelCoreService} from "./../core"
import {EduSSEntrantModel as Model} from '../core/model';
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {abitOrderStatusList} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {EduEpguMessageService} from "~modules/edu-epgu/modules/edu-epgu-message/entity/message";
import {EduSSAppService} from "~modules/edu-org/modules/ss-app/core";
import {epguAppStatusListById} from "~modules/edu-org/modules/epgu/core/enum/epgu-app-status";
import {AbitAppStatusStage} from "~modules/edu-org/modules/abit/core/app/enum";
import {EduAisEntrantService} from "~modules/edu-org/modules/ais-entrant";
import {aisStudentStatusById} from "~modules/edu-org/enum/ais-student-status";


@Injectable()
export class EduSSEntrantAdminService {

    constructor(
        @InjectModel(Model) private readonly model: ReturnModelType<typeof Model> | any,
        private readonly coreService: ModelCoreService,
        private readonly aisService: EduAisService,
        private readonly admissionService: EduAdmissionService,
        private readonly directionService: EduDirectionService,
        private readonly entityService: EntityService,
        private readonly eduAdminService: EduAdminService,
        @Inject(forwardRef(() => EduEpguMessageService))
        private epguMessageService: EduEpguMessageService,
        private readonly eduSSAppService: EduSSAppService,
        private readonly eduAisEntrantService: EduAisEntrantService,
    ) {
        this.entityService.entityTypeAddContext('edu_ss_entrant', this.eduAdminService.getContext())
    }

    async importExcellFile(content): Promise<any> {


    }

    async getFiltersTree(): Promise<any> {

        const schema = [
            {
                type: 'boolean',
                label: 'По направлениям из ЕПГУ есть внутренние испытания',
                path: 'haveExams',
                op: 'eq',
            },
            {
                type: 'group',
                path: 'statusGroup',
                label: 'Статус',
                children: [
                    {
                        type: 'string',
                        path: 'status',
                        control: 'options',
                        multitple: true,
                        op: 'in',
                        options: abitOrderStatusList.map((item) => ({
                            value: item.code,
                            label: item.titleAdmin
                        }))
                    },
                ]
            },
            {
                type: 'group',
                label: 'Персона',
                path: 'entrant',
                children: [
                    {
                        type: 'number',
                        path: 'id',
                        label: 'ID',
                        op: 'eq'
                    },
                    {
                        type: 'string',
                        path: 'snils',
                        label: 'СНИЛС',
                        op: 'like'
                    },
                    {
                        type: 'string',
                        path: 'fio',
                        label: 'ФИО',
                        op: 'like'
                    },
                ]
            },

            {
                type: 'group',
                label: 'Достижения',
                path: 'achievements',
                children: [
                    {
                        control: 'checkbox',
                        path: 'achievementsExists',
                        label: 'Есть достижения',
                    },
                ]
            },

            {
                type: 'group',
                label: 'Согласие',
                path: 'agreement',
                children: [
                    {
                        control: 'checkbox',
                        path: 'haveEpguAgreement',
                        label: 'Есть согласие на ЕПГУ',
                    },
                    {
                        control: 'checkbox',
                        path: 'haveAisAgreement',
                        label: 'Есть согласие на АИС',
                    },
                ]
            },
        ]

        return schema
    }

    async entityAction(action, entity: Model, params = {}) {
        this.entityService.entityAddContext(entity)
        return this['entityAction_' + action](entity)
    }

    async entityAction_delete(entity: Model, params = {}) {
        return this.coreService.model.deleteOne({_id: entity._id})
    }


    async entityActionMultiple_epgu_status_send(epguEntrants: Model[], params = {}) {

        const apps = []

        for (const epguEntrant of epguEntrants) {

            Array.prototype.push.apply(apps, await this.entityActionData_epgu_status_send(epguEntrant.snils))
        }

        await this.epguMessageService.createMessageFromArgs('EditApplicationStatusList', {
            params: {
                apps: apps
            }
        })
    }

    async entityAction_epgu_status_send(entity: Model, params = {}) {

        const apps = await this.entityActionData_epgu_status_send(entity.snils)

        if (apps.length) {
            await this.epguMessageService.createMessageFromArgs('EditApplicationStatusList', {
                params: {
                    apps: apps
                }
            })
        }

        return
    }

    async entityActionData_epgu_status_send(snils: string, params = {}) {

        snils = snils + ''

        //if (snils !== '16012031589') return ;


        const epguApps = await this.eduSSAppService.find({snils: snils, cstatus: {$in: [1,2]}})
        //const aisEntrants = await this.eduAisEntrantService.find({snils: snils})

        const aisEntrants = []

        const aisMemberCompets = {}
        const result = []

        for (const aisEntrant of aisEntrants) {

            const aisEntrantStatus = aisStudentStatusById[aisEntrant.state]

            if (aisEntrantStatus.stage === AbitAppStatusStage.MEMBER) {

                for (const aisEntrantApp of aisEntrant.apps) {

                    aisMemberCompets[aisEntrantApp.cadmission + '.' + aisEntrantApp.csource] = true
                }
            }
        }


        for (const epguApp of epguApps) {


            const statusInfo = epguAppStatusListById[epguApp.cstatus]


            if ([1,2].indexOf(epguApp.cstatus) === -1) {
                continue;
            }

            if (epguApp.agreement) {
                continue;
            }

            if (statusInfo.stage !== AbitAppStatusStage.PENDING) {
                //continue
            }

            const competUid = epguApp.cadmission + '.' + epguApp.csource

            if (!aisMemberCompets[competUid]) {
                //continue
            }

            let newStatus


            switch (epguApp.cstatus) {
                case 1:
                    newStatus = 2
                    break;
                case 2:
                    newStatus = 4
                    break;
            }

            newStatus = 4


            // statusId - 2 - получено вузом
            // statusId - 4 - рассмотрение заявления
            // statusId - 8 - участвует в конкурсе 8

            if (epguApp.uid) {

                result.push({
                    uidChoice: epguApp.epguUidChoice,
                    uidEpgu: epguApp.uidEpgu,
                    uid: epguApp.uid,
                    statusId: newStatus,
                    agreement: epguApp.agreement
                })
            }
        }

        return result
    }


    async entityAction_changes_epgu_commit(entity: Model, params = {}) {

        const apps = await this.entityService.find('edu_ss_app', {snils: entity.snils})


        for (const app of apps) {
            app.changed = false
            await app.savePromise()
        }

        entity.changedEpgu = false
        await entity.savePromise()
    }

    async entityAction_changes_ais_commit(entity: Model, params = {}) {

        /*
        const apps = await this.entityService.find('edu_ais_entrant', {snils: entity.snils})

        for (const app of apps) {
            app.changed = false
            await app.savePromise()
        }

         */

        entity.changedAis = false
        await entity.savePromise()
    }
}
