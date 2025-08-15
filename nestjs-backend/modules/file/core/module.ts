import {Module} from '@nestjs/common';
import {FileService} from './service';
import {FileModel} from './model';
import {FileResolvers} from './resolvers'
import {TypegooseModule} from "nestjs-typegoose";
import {EntityModule} from "~modules/entity/entity.module";
import {FileController} from "./controller";

@Module({
    imports: [
        EntityModule,
        TypegooseModule.forFeature([
            FileModel,
        ]),
    ],
    controllers: [
        FileController
    ],
    providers: [
        FileService,
        FileResolvers
    ],
    exports: [FileService],
})
export class FileModule {
}
