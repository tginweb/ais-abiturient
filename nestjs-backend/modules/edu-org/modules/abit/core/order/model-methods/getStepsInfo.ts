import {AbitOrderModel} from "~modules/edu-org/modules/abit/core/order/model";
import {EduAppCollection} from "~modules/edu-org/modules/abit/core/app/collection";

export default function getStepsInfo() {

    const self: AbitOrderModel = this

    var fetchStepCanEdit = (step) => {
        let stateStatusInfo = this.getStateStatusInfo()

        if (stateStatusInfo.canEdit === true) return true;
        if (stateStatusInfo.canEdit === false) return false;
        if (Array.isArray(stateStatusInfo.canEdit)) {
            return stateStatusInfo.canEdit.indexOf(step) > -1
        }
        return false;
    }

    return [
        {
            index: 1,
            code: 'anket',
            title: 'Анкета',
            next: {strategy: 'auto', step: 'education'},
            enable: (fetchedSteps) => {
                return fetchStepCanEdit('anket');
            },
            access: (errors = [], fetchedSteps) => {
                return true;
                //step.done(order, step, errors);
            },
            done: async (errors = [], fetchedSteps) => {

                const personalData = this.anket.personal;
                const educationData = this.anket.education;
                const entranceData = this.anket.entrance;

                let eduTypeSlug = this.eduTypeSlug

                if (!personalData.firstName)
                    errors.push('Не заполнено Имя')

                if (!personalData.lastName)
                    errors.push('Не заполнена Фамилия')

                if (!personalData.birthday)
                    errors.push('Не заполнена Дата рождения')

                if (!personalData.birthplace)
                    errors.push('Не заполнено Место рождения')

                if (!personalData.gender)
                    errors.push('Не указан Пол')

                if (!personalData.citizenship)
                    errors.push('Не указано гражданство')


                if (!personalData.addressReg || !personalData.addressReg['name'])
                    errors.push('Не заполнен Адрес регистрации')

                if (!personalData.addressEqual &&
                    (!personalData.addressLive || !personalData.addressLive['name']))
                    errors.push('Не заполнен Адрес проживания')

                if (!personalData.phone)
                    errors.push('Не указан Телефон')

                if (!personalData.email)
                    errors.push('Не указан Email')


                if (personalData.citizenship !== 'other') {
                    if (!educationData.docCity || !educationData.docCity['name'])
                        errors.push('Не указан Город или нас. пункт образовательной организации')
                }

                if (eduTypeSlug !== 'mag' || !educationData.irnituEdu2020) {
                    //if (!educationData.doc.date) errors.push('Не указана Дата документа об образовании')
                    //if (!educationData.doc.number) errors.push('Не указан Номер документа об образовании')
                }

                if (typeof personalData.needFlat !== 'boolean')
                    errors.push('Не указана необходимость в общежитии')


                switch (eduTypeSlug) {
                    case 'spo':
                        if (!personalData.family.length)
                            errors.push('Не указаны родственники или официальные представители абитуриента')

                        break;

                    case 'bak':
                        break;
                    case 'mag':
                    case 'asp':
                        break;
                }

                if (!educationData.prevEduLevel)
                    errors.push('Не указан Тип предыдущего образования')

                return errors.length == 0
            }
        },
        {
            index: 2,
            code: 'entrance',
            title: 'Вступительные испытания',
            next: {strategy: 'auto', step: 'applications'},
            enable: (fetchedSteps) => {
                return fetchStepCanEdit('entrance');
            },
            access: (errors = [], fetchedSteps) => {
                Array.prototype.push.apply(errors, fetchedSteps.anket.doneErrors);
                return fetchedSteps.anket.done;
            },
            done: async (errors = [], fetchedSteps) => {

                return errors.length == 0;
            },
        },
        {
            index: 3,
            code: 'applications',
            title: 'Заявления',
            next: {strategy: 'auto', step: 'upload'},
            enable: (fetchedSteps) => {
                return fetchStepCanEdit('applications');
            },
            access: (errors = [], fetchedSteps) => {
                Array.prototype.push.apply(errors, fetchedSteps.anket.doneErrors);
                return fetchedSteps.anket.done;
            },
            done: async (errors = [], fetchedSteps) => {

                const appGroups = await this.getAppGroups()

                const applications: EduAppCollection = await this.getAppsCollection()

                let appsActiveAll = 0

                for (const appGroup of appGroups) {
                    const apps = await appGroup.getActiveAppsCollection()
                    appsActiveAll += apps.length
                    if (appGroup.getActiveAppsCollection().length > this.eduTypeAppsLimit) {
                        errors.push('Количество выбранных направлений больше допустимого для уровня образования')
                        break;
                    }
                }

                if (appsActiveAll === 0) errors.push('Не выбраны направления подготовки')

                return errors.length == 0;
            },
        },
        {
            index: 4,
            code: 'upload',
            title: 'Печать и загрузка',
            next: {strategy: 'auto', step: 'send'},
            enable: (fetchedSteps) => {
                return fetchStepCanEdit('upload');
            },
            done: async (errors = [], fetchedSteps) => {

                this.allFiles.forEach((item) => {

                    if (item.type==='group') {

                        let haveErrors = false
                        item.children.forEach((subitem) => {

                            if (subitem.required && (!subitem.file || (Array.isArray(subitem.file) && !subitem.file.length)))
                                haveErrors = true
                        });

                        if (haveErrors)
                            errors.push('Не загружены файлы: ' + item.title)
                    } else {


                        if (item.required && (!item.file || (Array.isArray(item.file) && !item.file.length)))
                            errors.push('Не загружены файлы: ' + item.title)
                    }
                })

                return errors.length == 0;
            },
            access: (errors = [], fetchedSteps) => {
                Array.prototype.push.apply(errors, fetchedSteps.anket.doneErrors);
                Array.prototype.push.apply(errors, fetchedSteps.applications.doneErrors);
                return !!fetchedSteps.anket.done && !!fetchedSteps.applications.done;
            },
        },
        {
            index: 5,
            code: 'send',
            title: 'Отправка заявления',
            next: {strategy: 'approve', step: 'payment'},
            fields: [],
            enable: (fetchedSteps) => {
                return fetchStepCanEdit('send');
            },
            access: (errors = [], fetchedSteps) => {
                Array.prototype.push.apply(errors, fetchedSteps.anket.doneErrors);
                Array.prototype.push.apply(errors, fetchedSteps.applications.doneErrors);
                Array.prototype.push.apply(errors, fetchedSteps.upload.doneErrors);
                return !!fetchedSteps.anket.done && !!fetchedSteps.applications.done && !!fetchedSteps.upload.done;
            },
        },

    ]

}
