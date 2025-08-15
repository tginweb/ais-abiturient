import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduAchievementTypeModel as Model} from "./model";
import {EduAchievementTypeQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";

@Injectable()
export class EduAchievementService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
        private entityService: EntityService,
    ) {

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

    modelContext(): any {
        return {
            service: this
        }
    }

    query() {
        return (new ModelQuery(this.model.find())).addModelContext(this.modelContext())
    }

    async getAllById() {
        return (await this.query().execMany()).reduce((map, item)=>{
            map[item.id] = item
            return map
        }, {})
    }
}
