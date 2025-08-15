
export const abitOrderFileTypes = [
    {
        role: 'passport',
        path: 'anket.personal.docFile',
        label: 'Паспорт',
        multiple: true
    },
    {
        role: 'education',
        path: 'anket.education.docFile',
        label: 'Документ об образовании',
        multiple: true
    },
    {
        role: 'agreement',
        path: 'send.agreementDocFile',
        label: 'Согласие',
        multiple: true
    },
    {
        role: 'agreement-deny',
        path: 'send.agreementDenyDocFile',
        label: 'Отказ от согласия',
        multiple: true
    },
    {
        role: 'app',
        path: 'send.orderDocFile',
        label: 'Заявление',
        multiple: true
    },
    {
        role: 'compatriot-birth',
        path: 'send.compatriotBirthDocFile',
        label: 'Статус соотечественника',
        multiple: true
    },
    {
        role: 'compatriot-parent',
        path: 'send.compatriotParentDocFile',
        label: 'Статус соотечественника',
        multiple: true
    },
    {
        role: 'consent',
        path: 'send.consentDocFile',
        label: 'Соглашение о персональных данных',
        multiple: true
    },
    {
        role: 'consent-dist',
        path: 'send.consentDistDocFile',
        label: 'Соглашение о распостранении персональных данных',
        multiple: true
    },
    {
        role: 'target-contract',
        path: 'send.targetContractDocFile',
        label: 'Договор о целевом обучении',
        multiple: true
    },
    {
        role: 'photo',
        path: 'send.photoFile',
        label: 'Фотография',
        multiple: false
    },
    {
        role: 'achievement',
        path: 'anket.entrance.achievements.:id.docFile',
        roleMatch: (file) => {
            return file.relDocPath.match(/achievements/i)
        },
        label: 'Документ индивидуального достижения',
        multiple: true
    },
    {
        role: 'benefit',
        path: 'anket.benefits.quotes.:id.docFile',
        roleMatch: (file) => {
            return file.relDocPath.match(/quotes/i)
        },
        label: 'Документ особого права',
        multiple: true
    },
]

export const abitOrderFileTypesByRole = abitOrderFileTypes.reduce((map, o) => (map[o.role] = o, map), {})
export const abitOrderFileTypesByPath = abitOrderFileTypes.reduce((map, o) => (map[o.path] = o, map), {})
