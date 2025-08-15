import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduVolumeModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EntityService} from "~modules/entity/entity.service";
import {EduVolumeQuery as ModelQuery} from "./query";

@Injectable()
export class EduVolumeService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
        private readonly entityService: EntityService,
    ) {
        this.entityService.registerEntityType('edu_volume', {
            label: '',
            find: this.find.bind(this),
            findOne: this.findOne.bind(this),
            query: this.query.bind(this),
        })
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    modelContext(): any {
        return {
            service: this
        }
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
}
