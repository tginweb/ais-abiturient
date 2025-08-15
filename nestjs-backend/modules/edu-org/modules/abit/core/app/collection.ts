import Collection from "~lib/collection"
import {AbitAppModel} from "./model"
import {AbitAppGroupModel} from "~modules/edu-org/modules/abit/core/app-group/model";

export class EduAppCollection extends Collection<AbitAppModel> {

    public model: AbitAppModel
    public parent: AbitAppGroupModel

    async createItemPrepare(data) {
        data.appGroupId = this.parent.id
        data.orderId = this.parent.orderId
        data.orderNid = this.parent.orderNid
        return data
    }

    findByCompetitionId(competitionId: number): AbitAppModel {
        return [...this.items].sort((a, b) => ((a.nid < b.nid) ? 1 : -1)).find(app => app.competitionId === competitionId)
    }

    findByCompetitionUid(competitionUid: string): AbitAppModel {
        return this.items.find(app => app.competitionUid === competitionUid)
    }

    findByCompetition(cadmission: number, csource: number): AbitAppModel {
        return this.items.find(app => app.cadmission === cadmission && app.csource === csource)
    }

    findSameApp(app: AbitAppModel): AbitAppModel {
        return this.findByCompetitionId(app.competitionId)
    }

    getActiveItems() {
        return this.collect(this.items.filter(app => !app.isCanceled))
    }

    getCanceledItems() {
        return this.collect(this.items.filter(app => app.isCanceled))
    }

    sortByPriority() {
        return this.collect(this.items.sort((a, b) => ((a.priority > b.priority) ? 1 : -1)))
    }

    reindexPriority(base = 1) {
        let index = base;
        this.items
            .sort((a, b) => ((a.priority > b.priority) ? 1 : -1))
            .forEach((item) => {
                item.priority = index++;
            })
    }

    setPriority(value) {
        this.items
            .forEach((item) => {
                item.priority = value;
            })
    }

    getMaxPriority(): number {
        return Math.max.apply(null, this.items.map(item => item.priority))
    }

    async getFobsMap(): Promise<Object> {
        const res = {}
        for (const item of this.items) {
            const competition = await item.getCompetition()
            const admission = await competition.getAdmission()
            res[admission.cfob] = true
        }
        return res
    }

    findOchBudget() {
        return false
    }

    findZaochBudget() {
        return false
    }

    reindex() {
        this.getActiveItems().reindexPriority()
        this.getCanceledItems().reindexPriority(100)
    }

    async save() {

        if (this.haveToDelete()) {
            await super.deleteMarked()
        }

        this.reindex()

        await super.save()

        return this
    }

    async onOrderStatusChange(order = null) {

        order = order || this.parent

        const orderStatus = order.getStateStatusInfo()

        for (const app of this.all()) {

            if (order.isCanceled()) {

            }
            if (orderStatus.appStatus) {
                /*
                app.updateState({
                    statusCode: orderStatus.appStatus
                }, EnumSourceWorkplace.ADMIN)

                 */
            }
        }
    }

    findFirstApp() {
        return this.getItemsSortedByPriority()[0]
    }

    getItemsSortedByPriority() {
        return [...this.items].sort((a, b) => ((a.priority > b.priority) ? 1 : -1))
    }
}




