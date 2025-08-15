import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduDirectionModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduDirectionQuery as ModelQuery} from "./query";

@Injectable()
export class EduDirectionService {

    constructor(
        @InjectModel(Model) public readonly model: ReturnModelType<typeof Model>,
        private readonly aisService: EduAisService,
    ) {
    }

    find<T>(filter: any = null, nav: any = null, view = 'default'): any {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter(filter)
            .withNav(nav)
            .withView(view)
            .exec()
    }

    async findOneBy<T>(by: string, val: any, view = 'default'): Promise<any> {
        const query = new ModelQuery(this.model.find())
        return query
            .withFilter({[by]: val})
            .withView(view)
            .findOne()
            .exec()
    }

    createModel<T>(data: any): Model {
        return new this.model(data)
    }

}
