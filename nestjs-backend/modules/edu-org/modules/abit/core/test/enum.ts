export enum AbitTestPassingTypeEnum {
    EGE = 'ege',
    INTERNAL = 'internal',
    OLIMP = 'olimp',
    GIA = 'gia',
}

export type TEduTestPassingType = {
    id: AbitTestPassingTypeEnum
    name: string
}

export const abitTestPassingTypeList: TEduTestPassingType[] = [
    {
        id: AbitTestPassingTypeEnum.EGE,
        name: 'Свидетельство ЕГЭ',
    },
    {
        id: AbitTestPassingTypeEnum.INTERNAL,
        name: 'Внутреннее испытание ОУ',
    },
    {
        id: AbitTestPassingTypeEnum.OLIMP,
        name: 'Диплом победителя-призера олимпиады',
    },
    {
        id: AbitTestPassingTypeEnum.GIA,
        name: 'Справка ГИА',
    }
]

export const abitTestPassingTypeById: Record<string, TEduTestPassingType> = abitTestPassingTypeList.reduce((map, o) => (map[o.id] = o, map), {})

