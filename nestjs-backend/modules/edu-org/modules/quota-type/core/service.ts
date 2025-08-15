import {Injectable} from '@nestjs/common';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {EduQuotaTypeModel as Model} from "./model";
import {EduAisService} from "~modules/edu-ais/edu-ais.service";
import {EduQuotaTypeQuery as ModelQuery} from "./query";

@Injectable()
export class EduQuotaTypeService {

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
}
