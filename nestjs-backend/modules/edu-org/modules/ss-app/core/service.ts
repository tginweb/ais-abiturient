import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EpguCompetitionGroup, EduSSAppModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduSSAppQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {EduAdminService} from "~modules/edu-org/admin/service";
import {EduSSEntrantService} from "~modules/edu-org/modules/ss-entrant/core/service";

@Injectable()
export class EduSSAppService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        private readonly aisService: EduAisService,
        private readonly eduAdminService: EduAdminService,
        @Inject(forwardRef(() => EduSSEntrantService))
        private readonly eduSSEntrantService: EduSSEntrantService,
    ) {
        this.entityService.registerEntityType('edu_ss_app', {
            label: 'EduSSApp',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            query: this.query.bind(this)
        })


    }

    async find<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model[]> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    async findOne<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .findOne()
            .exec()
    }

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

    query() {
        return (new ModelQuery(this.model.find()))
    }

    async ensureServiceApp(serviceApp: any): Promise<Model> {

        let app = await this.query().where({
            guid: serviceApp.Guid
        }).execOne()

        if (!app) {
            app = this.createModel({})
            app.guid = serviceApp.Guid
        }

        const entrant = await this.eduSSEntrantService.query().where({guid: serviceApp.GuidEntrant}).execOne()

        if (!entrant)
            return ;

        app.fio = entrant.fio
        app.snils = entrant.snils

        app.guidEntrant = serviceApp.GuidEntrant
        app.registrationDate = new Date()
        app.isBudget = serviceApp.IsBudget
        app.fields = serviceApp
        app.stageAdmissionId = parseInt(serviceApp.IdStageAdmission)

        if (app.stageAdmissionId === 4) {
            entrant.isdop = true
            await entrant.savePromise()
        }

        let compets = serviceApp.CompetitiveGroupList.CompetitiveGroup

        if (compets) {
            compets = Array.isArray(compets) ? compets : [compets]

            for (const compet of compets) {
                let competApp = app.apps.find(item => item.competitionUid === compet.UidCompetition)
                if (!competApp) {
                    competApp = <EpguCompetitionGroup>{
                        competitionUid: compet.UidCompetition,
                    }
                }
                competApp.statusId = compet.IdStatus
                competApp.priorityOther = compet.Priority.PriorityOther
                competApp.priorityTarget = compet.Priority.PriorityTarget
                if (!competApp['_id'])
                    app.apps['push'](competApp)
            }

        } else {
            console.log(serviceApp)
        }

        await app.savePromise()

        return app
    }
}
