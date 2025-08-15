import {Controller} from '@nestjs/common';
import {EduAisMessageService} from "./service";

@Controller('ais/message')
export class EduAisMessageController {
    constructor(
        private readonly service: EduAisMessageService,
    ) {

    }

}
