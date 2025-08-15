import Collection from "~lib/collection"
import {AbitAppGroupModel} from "./model"

export class AbitAppGroupCollection extends Collection<AbitAppGroupModel> {

    async getActiveBudgetApps() {
        let group = this.items.find(item => item.isBudget === true)
        return group ? await group.getActiveAppsCollection() : null
    }

    async getActivePaidApps() {
        let group = this.items.find(item => item.isBudget === false)
        return group ? await group.getActiveAppsCollection() : null
    }

    async getFirstApp() {
        const budgetApps = await this.getActiveBudgetApps()
        const paidApps = await this.getActivePaidApps()

        if (budgetApps && budgetApps.length)
            return budgetApps.findFirstApp()

        if (paidApps && paidApps.length)
            return paidApps.findFirstApp()
    }
}




