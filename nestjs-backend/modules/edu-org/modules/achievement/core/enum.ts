export enum AchivementStatusEnum {
    NEW = 'new',
    PENDING = 'pending',
    NOT_CHECKED = 'not_checked',
    APPROVED_VUZ = 'approved_vuz',
    DENY = 'deny',
}

export type TAchievementStatus = {
    id?: AchivementStatusEnum
    title: string
    selectable?: boolean
    final?: boolean
}

export const AchievementStatus: Record<AchivementStatusEnum, TAchievementStatus> = {
    [AchivementStatusEnum.NEW]: {
        title: 'новый',
    },
    [AchivementStatusEnum.PENDING]: {
        title: 'на рассмотрении',
    },
    [AchivementStatusEnum.NOT_CHECKED]: {
        title: 'не проверен',
    },
    [AchivementStatusEnum.DENY]: {
        title: 'проверен и НЕ подтвержден',
    },
    [AchivementStatusEnum.APPROVED_VUZ]: {
        title: 'подтверджен ВУЗом',
    },
}

export const AchievementStatusList: TAchievementStatus[] = Object.keys(AchievementStatus).map(id => ({
    ...AchievementStatus[id],
    id: id
}))

export const AchievementStatusMap: Record<string, TAchievementStatus> = AchievementStatusList.reduce((map, item) => {
    map[item.id] = item
    return map
}, {})
