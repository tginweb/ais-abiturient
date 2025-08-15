import {Controller} from '@nestjs/common';
import {EduSSAppAdminService} from './service'

@Controller('ss-app')
export class EduSSAppAdminController {
    constructor(
        private readonly adminService: EduSSAppAdminService,
    ) {

    }


}
