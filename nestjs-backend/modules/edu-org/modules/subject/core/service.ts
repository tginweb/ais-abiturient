import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduSubjectModel, EduSubjectModel as Model} from "./model";
import {EduSubjectQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";

@Injectable()
export class EduSubjectService {

    subjectsByName: Record<string, EduSubjectModel> = null

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
        private entityService: EntityService,
    ) {
        this.entityService.registerEntityType('edu_subject', {
            label: '',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this)
        })
    }

    find<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model[]> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    findOne<T>(filter: any = null, nav: any = null, view = 'public'): Promise<Model> {
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

    async getEgeSubjectsNormalized() {
        const list = await this.query().execMany()
        return list.filter(subject => subject.isEge).map((subject) => ({
            ...subject['toJSON'](),
            name: subject.name.toLowerCase()
        }))
    }

    subjectsById: Record<string, EduSubjectModel>

    async getSubjectsById() {
        if (!this.subjectsById) {
            const list = await this.query().execMany()
            this.subjectsById = list.reduce((map, item) => {
                map[item.id] = item
                return map
            }, {})
        }
        return this.subjectsById
    }

    async getSubjectsByName() {
        if (!this.subjectsByName) {
            this.subjectsByName = (await this.query().execMany()).reduce((map, item) => {
                map[item.name.toLowerCase()] = item
                return map
            }, {})
        }
        return this.subjectsByName
    }
}
