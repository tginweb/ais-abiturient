import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduAchievementItemModel as Model} from "./model";
import {EduAchievementItemQuery as ModelQuery} from "./query";
import {EntityService} from "~modules/entity/entity.service";
import {EduAchievementService} from "~modules/edu-org/modules/achievement/core/type";
import {EduDocService} from "~modules/edu-org/modules/doc/core/service";

@Injectable()
export class EduAchievementItemService {

    public servType = 'EduAchievementItemService'

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
        private entityService: EntityService,
        public achievementService: EduAchievementService,
        @Inject(forwardRef(() => EduDocService))
        public docService: EduDocService,
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
}
