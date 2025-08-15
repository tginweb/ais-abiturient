export const AisSchoolTypes = {
    1: 'Школа',
    2: 'Лицей',
    4: 'ВУЗ',
    500465: 'Гимназия',
    502172: 'Вечерняя школа',
    502450: 'Профессиональный лицей',
    502451: 'Профессиональное училище',
    502452: 'Среднее спец. учебное заведение',
    530003: 'Центр образования',
    530746: 'Школа-интернат',
    650843: 'Учебный комплекс',
    650845: 'Кадетский корпус',
    650846: 'Колледж',
    650847: 'Техникум',
}

export enum AisEduTypeEnum {
    SCHOOL_11 = 1,
    SCHOOL_9 = 500473,
    SPO_NACH = 2,
    SPO = 3,
    HIGH_PROF = 4,
    HIGH = 500466,
    SCHOOL_NEPOLN = 500467,
    HIGH_MAG = 500468,
    HIGH_SPEC = 500469,
    HIGH_BAK = 500471,
    DIPLOM = 500475
}


export const aisEduTypeList = [
    {
        id: AisEduTypeEnum.SCHOOL_11,
        title: 'Среднее (полном) общее - 11 класов',
        epguDocTypeId: 213007,
        cisEduLevel: 7
    },
    {
        id: AisEduTypeEnum.SCHOOL_9,
        title: 'Основное общее - 9 классов',
        epguDocTypeId: 1000001,
        cisEduLevel: 8
    },
    {
        id: AisEduTypeEnum.SPO_NACH,
        title: 'начальное профессиональное',
        epguDocTypeId: 209010,
        cisEduLevel: 4
    },
    {
        id: AisEduTypeEnum.SPO,
        title: 'среднее профессиональное',
        epguDocTypeId: 209009,
        cisEduLevel: 4
    },
    {
        id: AisEduTypeEnum.HIGH_PROF,
        title: 'высшее профессиональное',
        epguDocTypeId: 210073,
        cisEduLevel: 2
    },
    {
        id: AisEduTypeEnum.HIGH,
        title: 'высшее',
        epguDocTypeId: 210073,
        cisEduLevel: 2
    },
    {
        id: AisEduTypeEnum.SCHOOL_NEPOLN,
        title: 'неполное среднее',
        epguDocTypeId: 213007,
        cisEduLevel: 7
    },
    {
        id: AisEduTypeEnum.HIGH_MAG,
        title: 'магистратура',
        epguDocTypeId: 210074,
        cisEduLevel: 3
    },
    {
        id: AisEduTypeEnum.HIGH_SPEC,
        title: 'специалитет',
        epguDocTypeId: 210074,
        cisEduLevel: 1
    },
    {
        id: AisEduTypeEnum.HIGH_BAK,
        title: 'бакалавриат',
        epguDocTypeId: 210073,
        cisEduLevel: 2
    },
    {
        id: AisEduTypeEnum.DIPLOM,
        title: 'дипломированный специалист',
        epguDocTypeId: 210074,
        cisEduLevel: 3
    },
]

export const aisEduTypeById = aisEduTypeList.reduce((map, o) => (map[o.id] = o, map), {})

