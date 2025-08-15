import {Controller} from '@nestjs/common';
import {EduFisMessageService} from "./service";


@Controller('fis/message')
export class EduFisMessageController {
    constructor(
        private readonly service: EduFisMessageService,
    ) {

    }

}
