import {Info, Parent, ResolveField, Resolver} from '@nestjs/graphql';
import {InjectModel} from "nestjs-typegoose";
import {ReturnModelType} from "@typegoose/typegoose";
import {FileModel, FileService,} from "./index";
import {UserCurrent} from "~modules/user/core/user.decorator";
import {UserModel} from "~modules/user/core/model/user.model";
import {
    abitOrderFileTypes,
    abitOrderFileTypesByPath,
    abitOrderFileTypesByRole
} from "~modules/edu-org/modules/abit/core/order/statics/file-type";

@Resolver('File')
export class FileResolvers {

    constructor(
        @InjectModel(FileModel) private readonly fileModel: ReturnModelType<typeof FileModel> | any,
        private readonly fileService: FileService,
    ) {

    }



    @ResolveField()
    async downloadUrl(
        @Parent() parent,
        @Info() info,
        @UserCurrent() user: UserModel
    ) {
        return '/api/file/download?id=' + parent._id
    }
}
