export default function () {
    return {
        pageStep: null,
        app: {
            statuses: [],
            appStatuses: [],
            orderTypes: [],
            eduTypes: []
        },
        user: {
            order: null,
            orderAvailableAdmissions: []
        },

        orderFormSections: [
            {
                eduLevel: [1, 2, 3, 4, 5],
                label: 'Персональные данные',
                labelShort: 'Персональные',
                id: 'personal',
                next: 'address',
                com: 'section-personal',
                props: {}
            },
            {
                eduLevel: [1, 2, 3, 4, 5],
                label: 'Адрес и контакты',
                labelShort: 'Адрес и контакты',
                id: 'address',
                next: 'education',
                com: 'section-address',
                props: {}
            },
            {
                eduLevel: [1, 2, 3, 4, 5],
                label: 'Образование',
                labelShort: 'Образование',
                id: 'education',
                next: 'target',
                com: 'section-education',
                props: {}
            },
            {
                eduLevel: [1, 2, 3, 4, 5],
                label: 'Целевое направление',
                labelShort: 'Целевое направление',
                id: 'target',
                next: 'family',
                com: 'section-target',
                props: {}
            },
            {
                eduLevel: [1, 2, 3, 4, 5],
                label: 'Родственники',
                labelShort: 'Родственники',
                id: 'family',
                next: 'other',
                com: 'section-family',
                props: {}
            },
        ],
    }
}
