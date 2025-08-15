import {abitOrderStatusList} from "~modules/edu-org/modules/abit/core/order/statics/status";
import {AbitOrderAdminService} from "../service";
import {AbitWorkplaceList} from "~modules/edu-org/enum/source-workplace";
import {aisCitizenTypeList} from "~modules/edu-org/enum/ais-student-status";
import {appStatusList} from "~modules/edu-org/modules/abit/core/app/enum";

export default async function (this: AbitOrderAdminService) {

    const eduLevels = await this.eduLevelService.find()
    const eduCampaigns = await this.eduCampaignService.find()
    const eduFobs = await this.eduFobService.find()
    const eduAdmissions = await this.eduAdmissionService.find()
    const eduOrderTypes = await this.abitOrderTypeService.find()
    const eduOrderTypesById = eduOrderTypes.reduce((map, o) => (map[o.id] = o, map), {})

    const eduInstitute = await this.eduInstituteService.find()
    const eduQuotaTypes = await this.eduQuotaTypeService.find()

    const subjects = await this.subjectService.find()
    const countries = await this.countryService.find()

    const eduAchievements = await this.eduAchievementService.find()

    const operators = await this.userService.find({roles: 'operator'})

    const eduSources = await this.eduSourceService.query().execMany()

    const decrees = await this.decreeService.find()

    const schema = [
        {
            label: 'К ЗАЧИСЛЕНИЮ',
            path: 'prezachExists',
            control: 'dropdown',
            op: 'eq',
            options: [
                {label: 'ДА', value: true},
                {label: 'НЕТ', value: false},
            ]
        },
        {
            label: 'Допнабор',
            path: 'dopnabExists',
            control: 'dropdown',
            op: 'eq',
            options: [
                {label: 'ДА', value: 'all'},
                {label: 'Без отклоненных', value: 'active'},
            ]
        },
        {
            label: 'Приказ',
            path: 'decree',
            control: 'select',
            multiple: true,
            op: 'in',
            useChips: true,
            options: [
                {
                    label: 'нет',
                    value: false
                },
                ...decrees.map(item => ({
                    label: item.nameFull,
                    value: item.nid,
                }))
            ]
        },
        {
            type: 'number',
            path: 'nid',
            label: 'ID',
            op: 'eq'
        },
        {
            type: 'number',
            path: 'regnum',
            label: 'Рег. номер',
            op: 'eq'
        },

        {
            type: 'string',
            path: 'anket.personal.lastName',
            label: 'Фамилия',
            op: 'like'
        },
        {
            type: 'string',
            path: 'anket.personal.firstName',
            label: 'Имя',
            op: 'like'
        },
        {
            type: 'string',
            path: 'anket.personal.doc.serial',
            label: 'Документ серия',
            op: 'like'
        },
        {
            type: 'string',
            path: 'anket.personal.doc.number',
            label: 'Документ номер',
            op: 'like'
        },
        {
            type: 'string',
            path: 'anket.personal.snils',
            label: 'СНИЛС',
            op: 'like'
        },
        {
            type: 'boolean',
            label: 'ПОДЛИННИК док. обр.',
            path: 'eduOriginal',
            control: 'dropdown',
            op: 'eq',
            options: [
                {label: 'Есть любой', value: true},
                {label: 'Печатный', value: 'print'},
                {label: 'Элеттронный ЕПГУ', value: 'epgu'},
            ]
        },
        {
            type: 'group',
            label: 'Организация подлинника',
            path: 'podl',
            children: [
                {
                    label: 'Организация подлинника',
                    path: 'podldocOrgExists',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'есть', value: true},
                        {label: 'нет', value: false},
                    ]
                },
            ]
        },
        {
            type: 'group',
            label: 'Заявления',
            path: 'apps',
            children: [
                {
                    label: 'БВИ',
                    path: 'bvi',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'Есть БВИ', value: true},
                        {label: 'Нет БВИ', value: false},
                    ]
                },

                {
                    label: 'Ошибки заявлений',
                    path: 'appsErrorsType',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'Любые', value: 'any'},
                        {label: 'В порядке приоритетов', value: 'disordered'},
                        {label: 'В наборе конкурсов', value: 'dismatch'},
                    ]
                },
            ]
        },
        {
            type: 'group',
            label: 'Гражданство',
            path: 'citizenshipGroup',
            children: [
                {
                    type: 'string',
                    path: 'anket.personal.citizenship',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: aisCitizenTypeList.map(item => ({
                        label: item.name,
                        value: item.code
                    }))
                },
                {
                    type: 'number',
                    label: 'Страна гражданства',
                    path: 'anket.personal.citizenshipCountry',
                    control: 'select',
                    multiple: true,
                    useChips: true,
                    op: 'in',
                    options: countries.map(item => ({
                        label: item.title,
                        value: item.nid
                    }))
                },
            ]
        },
        {
            type: 'group',
            label: 'Тип',
            path: 'orderTypeGroup',
            children: [
                {
                    type: 'number',
                    path: 'eduType',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: eduOrderTypes.map((row) => {
                        return {
                            value: row.id,
                            label: row.name,
                        }
                    })
                },
            ]
        },

        {
            type: 'group',
            path: 'statusGroup',
            label: 'Статус абитуриента (ЦЕЛИКОМ)',
            children: [
                {
                    type: 'string',
                    path: 'state.status',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: abitOrderStatusList.map((item) => ({
                        value: item.code,
                        label: item.titleAdmin
                    }))
                },
            ]
        },
        {
            type: 'group',
            path: 'appStatusGroup',
            label: 'Статус конкурсов',
            children: [
                {
                    type: 'string',
                    path: 'appStatus',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: appStatusList.map((item) => ({
                        value: item.id,
                        label: item.title
                    }))
                },
                {
                    label: 'Включено в приказ',
                    path: 'appInorder',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'Бакспец - весь бюджет', value: 'bak_budget_all'},
                        {label: 'Бакспец - бюджет', value: 'bak_budget'},
                        {label: 'Бакспец - целевые', value: 'bak_target'},
                        {label: 'Бакспец - квота', value: 'bak_quota'},
                        {label: 'Бакспец - отдельая квота', value: 'bak_specquota'},
                        {label: 'Бакспец - коммерция', value: 'bak_commerce'},
                        {label: 'Бакспец допнабор - бюджет', value: 'bakdop_budget'},
                        {label: 'Бакспец допнабор - квотники', value: 'bakdop_budget_quota'},
                        {label: 'Магистратура - бюджет', value: 'mag_budget'},
                    ]
                },
            ]
        },
        {
            type: 'group',
            label: 'Персона',
            path: 'person',
            children: [
                {
                    label: 'Дубль',
                    path: 'haveDouble',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'СНИЛС', value: 'snils'},
                        {label: 'Паспорт', value: 'passport'},
                        {label: 'Паспорт', value: 'passport'},
                    ]
                },
                {
                    type: 'string',
                    path: 'anket.personal.inn',
                    label: 'ИНН',
                    op: 'like'
                },
                {
                    type: 'string',
                    path: 'anket.personal.email',
                    label: 'E-mail',
                    op: 'like'
                },
                {
                    type: 'string',
                    path: 'anket.personal.phone',
                    label: 'Телефон',
                    op: 'like'
                },
                {
                    type: 'string',
                    path: 'anket.personal.birthplace',
                    label: 'Место рождения',
                    op: 'like'
                },
                {
                    type: 'boolean',
                    path: 'isdopChecked',
                    label: 'Допнабор сверен',
                    op: 'eq'
                },
            ]
        },
        {
            type: 'group',
            path: 'adm',
            label: 'Наборы ',
            children: [
                {
                    label: 'Набор №1',
                    path: 'firstApp.cadmission',
                    control: 'select',
                    op: 'in',
                    multiple: true,
                    options: eduAdmissions.map((row) => {
                        return {
                            value: row.id,
                            label: row.name,
                        }
                    })
                },
                {
                    label: 'Набор любой',
                    path: 'cadmissions',
                    control: 'select',
                    op: 'in',
                    multiple: true,
                    options: eduAdmissions.map((row) => {
                        return {
                            value: row.id,
                            label: row.name,
                        }
                    })
                },

            ]
        },
        {
            type: 'group',
            path: 'institute',
            label: 'Факультет ',
            children: [
                {
                    label: 'Передать на другой фак',
                    path: 'cinstituteChanged',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Дело на факультете',
                    type: 'string',
                    path: 'cinstitute',
                    control: 'select',
                    useChips: true,
                    multiple: true,
                    op: 'in',
                    options: eduInstitute.filter(item => item.meta.realfac === 't').map((item) => ({
                        value: item.id,
                        label: item.name
                    }))
                },
                {
                    label: 'Факультет высшего приоритета',
                    type: 'string',
                    path: 'firstApp.cfac',
                    control: 'select',
                    useChips: true,
                    multiple: true,
                    op: 'in',
                    options: eduInstitute.filter(item => item.meta.realfac === 't').map((item) => ({
                        value: item.id,
                        label: item.name
                    }))
                },
            ]
        },
        {
            type: 'group',
            label: 'Основа',
            path: 'csourcesGroup',
            children: [
                {
                    type: 'number',
                    path: 'csourceList',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: eduSources.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))
                },
            ]
        },
        {
            type: 'group',
            label: 'Образование',
            path: 'edu',
            children: [
                {
                    type: 'number',
                    path: 'anket.education.prevEduLevel',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: eduLevels.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }))
                },
            ]
        },
        {
            type: 'group',
            label: 'Источник',
            path: 'source',
            children: [
                {
                    type: 'string',
                    path: 'cordersource',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: AbitWorkplaceList.map(item => ({
                        label: item.title,
                        value: item.id
                    }))
                },
            ]
        },


        {
            type: 'group',
            label: 'Чат',
            path: 'chat',
            children: [
                {
                    label: 'Есть непрочитанные сообщения от абитуриента',
                    path: 'haveUnreadedByCompanyMessages',
                    control: 'checkbox',
                },
                {
                    label: 'Есть сообщения от абитуриента',
                    path: 'haveClientMessages',
                    control: 'checkbox',
                },
            ]
        },
        {
            type: 'group',
            label: 'Вступительные испытания',
            path: 'entrance',
            children: [
                {
                    label: 'Есть неп ЕГЭ',
                    path: 'haveEgeNotVerified',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Есть ЕГЭ',
                    path: 'haveEgeTests',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Есть внутренние',
                    path: 'haveInternalTests',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Предметы',
                    path: 'haveInternalTestsSubjects',
                    control: 'select',
                    multiple: true,
                    op: 'in',
                    options: subjects.map(item => ({
                        label: item.name,
                        value: item.id,
                    }))
                },
            ]
        },
        {
            type: 'group',
            label: 'ЛК абитуриента',
            path: 'lk',
            children: [
                {
                    label: 'Есть ЛК',
                    path: 'lkExists',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Портированы со старого',
                    path: 'lkPorted',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
            ]
        },
        {
            type: 'group',
            label: 'АИС',
            path: 'ais',
            children: [
                {
                    label: 'АИС ФИО не совпадает',
                    path: 'aisFioNotEqual',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Есть в АИС',
                    path: 'aisExists',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    type: 'number',
                    path: 'ais.aisId',
                    label: 'АИС ID',
                    op: 'eq'
                },
            ]
        },
        {
            type: 'group',
            label: 'ЕПГУ',
            path: 'epgu',
            children: [
                {
                    label: 'Есть на ЕПГУ',
                    path: 'epguExists',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'да', value: true},
                        {label: 'нет', value: false},
                    ]
                },
                {
                    label: 'Заявления на ЕПГУ',
                    path: 'epguAppGroupExists',
                    control: 'dropdown',
                    op: 'eq',
                    options: [
                        {label: 'есть пропущенные', value: 'have_skiped'},
                        {label: 'есть пропущенные допнабора', value: 'have_skiped_dopnabor'},
                    ]
                },
                {
                    type: 'string',
                    path: 'epgu.guid',
                    label: 'ЕПГУ ID',
                    op: 'eq'
                },
            ]
        },

        {
            type: 'group',
            path: 'achievements',
            label: 'Достижения',
            children: [
                {
                    label: 'Есть достижения',
                    path: 'achievementsExists',
                    op: 'eq',
                    control: 'checkbox',
                },
                {
                    type: 'string',
                    path: 'anket.entrance.achievements.achievementType',
                    control: 'select',
                    multitple: true,
                    op: 'in',
                    options: eduAchievements.map((item) => ({
                        value: item.id,
                        label: eduOrderTypesById[item.fields['eduType']].nameShort + ': ' + item.name
                    }))
                },
            ]
        },
        {
            type: 'group',
            path: 'user',
            label: 'Оператор',
            children: [
                {
                    label: 'Не задан',
                    path: 'nooperator',
                    control: 'checkbox',
                },
                {
                    type: 'string',
                    path: 'coperator',
                    control: 'options',
                    multitple: true,
                    op: 'in',
                    options: operators.map((item) => ({
                        value: item._id,
                        label: item.lastName + ' ' + item.firstName
                    }))
                },
            ]
        },

    ]

    return schema
}
