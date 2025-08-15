
export type TAbitWorkplace = {
    id: string
    title: string
    required: boolean
}

export enum AbitWorkplaceEnum {
    CIS_ABIT = 'cis_abit',
    CIS_ADMIN = 'cis_admin',
    CIS_SYSTEM = 'cis_system',
    AIS = 'ais',
    EPGU = 'epgu',
}

export const AbitWorkplace = {
    [AbitWorkplaceEnum.CIS_ABIT]: {
        title: 'Абитуриентом в ЛК'
    },
    [AbitWorkplaceEnum.CIS_ADMIN]: {
        title: 'Вузом'
    },
    [AbitWorkplaceEnum.EPGU]: {
        title: 'Абитуриентом в ЕПГУ'
    },
    [AbitWorkplaceEnum.AIS]: {
        title: 'АИС'
    },
    [AbitWorkplaceEnum.CIS_SYSTEM]: {
        title: 'Автоматически'
    },
}

export const AbitWorkplaceList: TAbitWorkplace[] = Object.keys(AbitWorkplace).map(id => ({
    ...AbitWorkplace[id],
    id: id
}))

export const AbitWorkplaceMap: Record<string, TAbitWorkplace> = AbitWorkplaceList.reduce((map, item) => {
    map[item.id] = item
    return map
}, {})
