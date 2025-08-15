import {prop, Ref} from "@typegoose/typegoose";
import {FileModel} from "~modules/file/core/model";
import {OrderModelDataDoc} from "../../_doc";
import {EduAchievementTypeModel} from "~modules/edu-org/modules/achievement/core/type/model";
import {ObjectID} from "mongodb";
import {EduDocStatusMap} from "~modules/edu-org/modules/doc/core/enum";
import {AchivementStatusEnum} from "~modules/edu-org/modules/achievement/core/enum";

export class Achievement {

    _id: ObjectID

    @prop({cfilter: true})
    public achievementType: number;

    @prop({
        default: ''
    })
    public desc: string;

    @prop({
        default: false
    })
    public haveDoc: boolean;

    @prop({
        _id: false,
        default: {
            doc: {},
        }
    })
    public doc: OrderModelDataDoc


    @prop({})
    public docFile: string[];

    @prop({ref: () => FileModel, localField: "docFile", foreignField: "_id"})
    public docFileModel: Ref<FileModel>[];


    @prop({})
    public docId: string

    @prop({default: AchivementStatusEnum.NEW})
    public statusId: AchivementStatusEnum

    @prop({})
    public ball: number


    /* VIRTUALS */

    @prop({ref: EduAchievementTypeModel, localField: "achievementType", foreignField: "id", justOne: true})
    public achievementTypeDoc?: Ref<EduAchievementTypeModel>;

    /* /VIRTUALS */

    get id() {
        return this._id.toString()
    }

    get status() {
        return EduDocStatusMap[this.statusId]
    }

    get canDelete() {
        if (!!this.ball || this.statusId !== AchivementStatusEnum.NEW) {
            return false
        }
        return true
    }

    get canDeleteAdmin() {
        return this.canDelete
    }

    get canDeleteAbit() {
        return this.canDelete
    }

    get achievementFisUid() {
        switch (this.achievementType) {
            case 1: return 1;
            case 2: return 1;
        }
    }

    get isDiplom() {
        switch (this.achievementType) {
            case 1:
            case 1:
                return true
        }
    }

    get isGto() {
        switch (this.achievementType) {
            case 1:
            case 1:
                return true
        }
    }

    get isOlympic() {
        switch (this.achievementType) {
            case 1:
            case 1:
                return true
        }
    }

    get isPublications() {
        switch (this.achievementType) {
            case 1:
            case 1:
                return true
        }
    }

    get isSport() {
        switch (this.achievementType) {
            case 1:
            case 1:
                return true
        }
    }
}
