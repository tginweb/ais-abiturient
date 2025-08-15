export type TEduDocType = {
    id: EduDocRoleEnum
    title: string
    required: boolean
    haveReq: boolean
    epgu: boolean
    epguRootCats: any
    epguDefaultDocTypeId: number
    epguCats: any
    multiple: boolean
    canDelete: boolean
    group: string
    achievements: boolean
    internal: boolean
}


export enum EduDocRoleEnum {
    PASSPORT = 'passport',
    EDU = 'education',
    ACHIEVEMENT = 'achievement',
    LGOT = 'lgot',
    APP = 'app',
    CONSENT = 'consent',
    CONSENT_DIST = 'consent_dist',
    PHOTO = 'photo',
    TARGET = 'target',
    KVITOK = 'kvitok',
    RASPISKA = 'raspiska',
    OPIS = 'opis',
    COMPATRIOT = 'compatriot',
    PACKET = 'packet',
    OTHER = 'other',
}

export const EduDocRoles = {
    [EduDocRoleEnum.PASSPORT]: {
        title: 'Документы удостоверяющие личность',
        required: true,
        haveReq: true,
        epgu: true,
        epguRootCats: null,
        epguCats: [1],
        multiple: true,
        canDelete: true,
    },
    [EduDocRoleEnum.EDU]: {
        title: 'Документы об образовании',
        required: true,
        haveReq: true,
        epgu: true,
        epguRootCats: null,
        epguCats: [13,9,10],
        multiple: true,
        canDelete: true,
        achievements: true
    },
    [EduDocRoleEnum.ACHIEVEMENT]: {
        title: 'Документы индивидуальных достижений',
        required: true,
        haveReq: true,
        epgu: true,
        epguRootCats: null,
        epguCats: [4,5,15,18],
        multiple: true,
        canDelete: true,
        achievements: true
    },
    [EduDocRoleEnum.LGOT]: {
        title: 'Документы о льготах особого права',
        required: true,
        haveReq: true,
        epgu: true,
        epguRootCats: [7],
        epguCats: null,
        multiple: true,
        canDelete: true
    },
    [EduDocRoleEnum.COMPATRIOT]: {
        title: 'Документы подтверждающие статус соотечественника',
        required: true,
        haveReq: true,
        epgu: true,
        epguRootCats: [8],
        epguCats: null,
        multiple: true,
        canDelete: true
    },
    [EduDocRoleEnum.TARGET]: {
        title: 'Целевой договор',
        required: false,
        haveReq: false,
        multiple: true,
        canDelete: true
    },
    [EduDocRoleEnum.PACKET]: {
        title: 'Документы заявления',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
    },
    [EduDocRoleEnum.APP]: {
        title: 'Заявление на поступление',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true
    },
    [EduDocRoleEnum.CONSENT]: {
        title: 'Согласие о персональных данных',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true
    },
    [EduDocRoleEnum.CONSENT_DIST]: {
        title: 'Согласие на распространение персональных данных',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true
    },
    [EduDocRoleEnum.PHOTO]: {
        title: 'Фотография абитуриента',
        required: true,
        haveReq: false,
        multiple: true,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true
    },
    [EduDocRoleEnum.KVITOK]: {
        title: 'Квиток',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true,
        abitHidden: true
    },
    [EduDocRoleEnum.OPIS]: {
        title: 'Опись документов',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true,
        abitHidden: true
    },
    [EduDocRoleEnum.RASPISKA]: {
        title: 'Расписка в получении документов',
        required: true,
        haveReq: false,
        multiple: false,
        canDelete: false,
        parent: EduDocRoleEnum.PACKET,
        internal: true,
        abitHidden: true
    },
    [EduDocRoleEnum.OTHER]: {
        title: 'Другое',
        required: false,
        haveReq: true,
        epgu: true,
        multiple: true,
        canDelete: true
    },
}


export const EduDocRolesList: TEduDocType[] = Object.keys(EduDocRoles).map(id => ({
    ...EduDocRoles[id],
    id: id
}))

export const EduDocRolesMap: Record<string, TEduDocType> = EduDocRolesList.reduce((map, item) => {
    map[item.id] = item
    return map
}, {})


export type TEduDocStatus = {
    id?: EduDocStatusEnum
    title: string
    required?: boolean
    epguId?: number
    selectable?: boolean
    final?: boolean
}

export enum EduDocStatusEnum {
    NEW = 'new',
    PENDING = 'pending',
    NOT_CHECKED = 'not_checked',
    APPROVED_VUZ = 'approved_vuz',
    APPROVED_FRDO = 'approved_frdo',
    APPROVED_EGPU = 'approved_epgu',
    APPROVED_FIS = 'approved_fis',
    DENY = 'deny',
}

export const EduDocStatus: Record<EduDocStatusEnum, TEduDocStatus> = {
    [EduDocStatusEnum.NEW]: {
        title: 'новый',
        epguId: 10,
        selectable: true
    },
    [EduDocStatusEnum.PENDING]: {
        title: 'на рассмотрении',
        epguId: 11,
        selectable: true
    },
    [EduDocStatusEnum.NOT_CHECKED]: {
        title: 'не проверен',
        epguId: 1,
        selectable: true
    },
    [EduDocStatusEnum.DENY]: {
        title: 'проверен и НЕ подтвержден',
        epguId: 2,
        selectable: true
    },
    [EduDocStatusEnum.APPROVED_VUZ]: {
        title: 'подтверджен ВУЗом',
        epguId: 4,
        selectable: true
    },
    [EduDocStatusEnum.APPROVED_FRDO]: {
        title: 'подтверджен ФРДО',
        epguId: 3,
        selectable: false,
        final: true
    },
    [EduDocStatusEnum.APPROVED_EGPU]: {
        title: 'подтверджен ЕПГУ',
        epguId: 5,
        selectable: false,
        final: true
    },
    [EduDocStatusEnum.APPROVED_FIS]: {
        title: 'подтверджен ФИС',
        epguId: 6,
        selectable: false,
        final: true
    },

}

export const EduDocStatusList: TEduDocStatus[] = Object.keys(EduDocStatus).map(id => ({
    ...EduDocStatus[id],
    id: id
}))

export const EduDocStatusMap: Record<string, TEduDocStatus> = EduDocStatusList.reduce((map, item) => {
    map[item.id] = item
    return map
}, {})

export const EduDocStatusByEpguId: Record<string, TEduDocStatus> = EduDocStatusList.reduce((map, item) => {
    map[item.epguId] = item
    return map
}, {})
