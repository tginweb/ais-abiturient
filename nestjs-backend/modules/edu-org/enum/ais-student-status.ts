import {AppStatusEnum} from '../modules/abit/core/app/enum';

export enum cisCitizenTypeEnum {
    RUSSIA = 'russia',
    SNG = 'sng',
    FOREIGNER = 'other',
    COMPATRIOT = 'compatriot',
}

export enum aisCitizenTypeEnum {
    RUSSIA = 1,
    SNG = 2,
    FOREIGNER = 3,
    COMPATRIOT = 4,
}

export const aisCitizenTypeList = [
    {
        id: aisCitizenTypeEnum.RUSSIA,
        name: 'россиянин',
        code: cisCitizenTypeEnum.RUSSIA
    },
    {
        id: aisCitizenTypeEnum.SNG,
        name: 'СНГ',
        code: cisCitizenTypeEnum.SNG
    },
    {
        id: aisCitizenTypeEnum.FOREIGNER,
        name: 'иностранец',
        code: cisCitizenTypeEnum.FOREIGNER
    },
    {
        id: aisCitizenTypeEnum.COMPATRIOT,
        name: 'соотечественник',
        code: cisCitizenTypeEnum.COMPATRIOT
    },
]

export const aisCitizenTypeByCode = aisCitizenTypeList.reduce((map, o) => (map[o.code] = o, map), {})
export const aisCitizenTypeById = aisCitizenTypeList.reduce((map, o) => (map[o.id] = o, map), {})

export enum aisStudentStatusEnum {
    STUDENT = 1,
    ABIT = 2,
    ERROR_INPUT = 3,
    CANCELED_ABIT = 20,
    CANDIDAT = 4,
    DELETED = 8,
}

export const aisStudentStatusList = [
    {
        id: 1,
        title: 'студент',
        member: true,
        appStatusId: AppStatusEnum.COMPET_MEMBER
    },
    {
        id: 2,
        title: 'абитуриент',
        member: true,
        appStatusId: AppStatusEnum.COMPET_MEMBER
    },
    {
        id: 3,
        title: 'ошибочный ввод',
        cancel: true,
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 4,
        title: 'кандидат',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 5,
        title: 'в академ. отпуске',
        cancel: true,
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 6,
        title: 'задолжник',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 7,
        title: 'передача документов',
        cancel: true,
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 8,
        title: 'удален',
        cancel: true,
        appStatusId: AppStatusEnum.CANCELED_ORG
    },
    {
        id: 9,
        title: 'провалил вступительные экзамены',
        cancel: true,
        appStatusId: AppStatusEnum.CANCELED_ENROLL
    },
    {
        id: 10,
        title: 'магистрант',
        member: true,
        appStatusId: AppStatusEnum.STUDENT
    },
    {
        id: 11,
        title: 'переведен',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 12,
        title: 'защитился',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 13,
        title: 'отчислен',
        cancel: true,
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 14,
        title: 'зачислен',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 15,
        title: 'допущен к занятиям',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 16,
        title: 'умер',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 17,
        title: 'старые',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 18,
        title: 'слушатель',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 19,
        title: 'не поступил',
        appStatusId: AppStatusEnum.CANCELED_ENROLL
    },
    {
        id: 20,
        title: 'забрал документы',
        cancel: true,
        appStatusId: AppStatusEnum.CANCELED_ABIT
    },
    {
        id: 21,
        title: 'аспирант',
        member: true,
        appStatusId: AppStatusEnum.COMPET_MEMBER
    },
    {
        id: 22,
        title: 'докторант',
        appStatusId: AppStatusEnum.COMPET_MEMBER
    },
    {
        id: 23,
        title: 'соискатель',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 24,
        title: 'выпущен',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 24,
        title: 'поступающий',
        member: true,
        appStatusId: AppStatusEnum.COMPET_MEMBER
    },
    {
        id: 24,
        title: 'выпущен',
        appStatusId: AppStatusEnum.PENDING
    },
    {
        id: 37,
        title: 'отчислен',
        cancel: true,
        appStatusId: AppStatusEnum.CANCELED_ORG
    },
]

export const aisStudentStatusById = aisStudentStatusList.reduce((map, o) => (map[o.id] = o, map), {})

