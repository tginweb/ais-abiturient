import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduRatingModel, EduRatingModel as Model} from "./model";
import {EduRatingQuery as ModelQuery} from './query'
import {EntityService} from "~modules/entity/entity.service";
import {EduDirectionService} from "~modules/edu-org/modules/direction/core/service";
import {EduAdmissionService} from "~modules/edu-org/modules/admission/core/service";
import {EduSourceService} from "~modules/edu-org/modules/source/core/service";
import {AbitAppService} from "~modules/edu-org/modules/abit/core/app/service";
import {AbitOrderService} from "~modules/edu-org/modules/abit/core/order/service";
import {EduSubjectService} from "~modules/edu-org/modules/subject/core/service";
import {EduCompetitionService} from "~modules/edu-org/modules/competition/core";
import * as fs from "fs"
const path = require('path')

@Injectable()
export class EduRatingService {

    public allCache = null
    public allIndexedCache = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private entityService: EntityService,
        public serviceEduDirection: EduDirectionService,
        public serviceEduAdmission: EduAdmissionService,
        public serviceEduFob: EduSourceService,
        public serviceEduSource: EduSourceService,
        @Inject(forwardRef(() => AbitOrderService))
        public orderService: AbitOrderService,
        @Inject(forwardRef(() => AbitAppService))
        public appService: AbitAppService,
        public subjectService: EduSubjectService,
        public competitionService: EduCompetitionService,
    ) {
        this.entityService.registerEntityType('edu_rating', {
            label: '',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            service: this,
            query: this.query.bind(this),
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

    getQueryContext(user) {
        return {
            serviceEduDirection: this.serviceEduDirection,
            entityService: this.entityService,
            user: user
        }
    }

    modelContext(): any {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    async generateDataFile(rating: EduRatingModel) {

        rating.generateStartAt = new Date()
        rating.generateEndAt = null

        await rating.savePromise()

        const competitions = await this.competitionService.query().where({}).execMany()

        const res = []

        for (const competition of competitions) {

            const ratingApps = await this.competitionService.getRatingApps(competition.id, false)
            const source = await competition.getSource()

            res.push({
                _id: competition._id,
                id: competition.id,
                name: competition.name,
                cadmission: competition.cadmission,
                csource: source.id,
                sourceName: source.name,
                celevOrgName: competition.celevOrgName,
                admissionNumber: competition.admissionNumber,
                ratingApps: ratingApps
            })
        }

        await fs.promises.writeFile(rating.dataFilePath, JSON.stringify(res))

        rating.generateEndAt = new Date()

        await rating.savePromise()
    }
}
