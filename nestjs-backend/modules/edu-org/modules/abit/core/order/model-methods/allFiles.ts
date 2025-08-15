import {AbitOrderModel} from '../model'

export default function allFiles(d) {

    const self: AbitOrderModel = this

    var subitems;
    let result: any[] = [];


    Array.prototype.push.apply(result, [
        {
            type: 'field',
            doctype: 7,
            title: 'Фотография',
            file: self.send.photoFile,
            fileDoc: self.send.photoFileModel,
            path: 'send.photoFile',
            required: true,
            accept: '.jpg, .jpeg, .png',
            help: {
                popupText: `
                    <p>
                       <strong>Требования к фотографии:</strong>
                    </p>
                   
                    <div class="row" style="max-width: 550px;">
                        <div class="col-24 col-md-16">
                          <ul>
                            <li>фотография должна иметь качество не ниже 320 х 240 пикселей</li>
                            <li>равномерное освещение лица</li>
                            <li>расположение лица – анфас</li>
                            <li>овал лица должен занимать не менее 50 % и не более 80 % от общего размера снимка</li>
                            <li>формат файла jpg</li>
                          </ul>  
                        </div>
                         <div class="col-24 col-md-8">
                             <img src="/statics/foto-example.png" style="max-width:100%;">   
                        </div>
                    </div>
                 `,
                text: 'Требования'
            }
        },
        {
            type: 'field',
            doctype: 6,
            title: 'Заявление',
            file: self.send.orderDocFile,
            children: self.send.orderDocFileModel,
            path: 'send.orderDocFile',
            multiple: true,
            required: true,
        },
        {
            type: 'field',
            doctype: 9,
            title: 'Согласие на обработку персональных данных',
            file: self.send.consentDocFile,
            children: self.send.consentDocFileModel,
            path: 'send.consentDocFile',
            multiple: true,
            required: true,
        },
        {
            type: 'field',
            doctype: 9,
            title: 'Согласие на распространение персональных данных',
            file: self.send.consentDistDocFile,
            children: self.send.consentDistDocFileModel,
            path: 'send.consentDistDocFile',
            multiple: true,
            required: true,
        },
        {
            type: 'field',
            doctype: 1,
            title: 'Документ удостоверяющий личность',
            file: self.anket.personal.docFile,
            children: self.anket.personal.docFileModel,
            path: 'anket.personal.docFile',
            multiple: true,
            required: true,
        },
        {
            type: 'field',
            doctype: 2,
            title: 'Документ об образовании',
            file: self.anket.education.docFile,
            children: self.anket.education.docFileModel,
            path: 'anket.education.docFile',
            multiple: true,
            required: self.eduTypeSlug !== 'mag' || !self.anket.education.irnituEdu2020,
        },


    ]);


    if (self.eduTypeSlug !== 'spo') {
        Array.prototype.push.apply(result, [
            {
                type: 'field',
                doctype: 8,
                title: 'Согласие на зачисление',
                file: self.send.agreementDocFile,
                children: self.send.agreementDocFileModel,
                path: 'send.agreementDocFile',
                multiple: true,
                required: false,
            },
            {
                type: 'field',
                doctype: 8,
                title: 'Отказ от зачисления',
                file: self.send.agreementDenyDocFile,
                children: self.send.agreementDenyDocFileModel,
                path: 'send.agreementDenyDocFile',
                multiple: true,
                required: false,
                disable: true
            },
        ])
    }

    if (self.appsTypeKeys.target) {
        result.push({
            type: 'field',
            doctype: 5,
            title: 'Целевой договор с организацией',
            file: self.send.targetContractDocFile,
            children: self.send.targetContractDocFileModel,
            path: 'send.targetContractDocFile',
            multiple: true,
            required: true,
        })
    }


    subitems = self.anket.entrance.achievements.map((item) => {
        return {
            type: 'field',
            doctype: 3,
            term: {
                getter: 'edu_achievement/typeById',
                id: item.achievementType,
            },
            file: item.docFile,
            children: item.docFileModel,
            path: 'anket.entrance.achievements.' + item['_id'] + '.docFile',
            multiple: true,
            required: true,
        }
    })

    if (subitems.length) {
        result.push({
            type: 'group',
            path: 'anket.entrance.achievements',
            title: 'Индивидуальные достижения',
            children: subitems
        })
    }

    subitems = self.anket.benefits.quotes.map((item) => {
        return {
            type: 'field',
            doctype: 10,
            term: {
                getter: 'edu_quotaType/byId',
                id: item.quotaType,
            },
            file: item.docFile,
            children: item.docFileModel,
            path: 'anket.benefits.quotes.' + item['_id'] + '.docFile',
            multiple: true,
            required: true,
        }
    })

    if (subitems.length) {
        result.push({
            type: 'group',
            path: 'anket.benefits.quotes',
            title: 'Льготы',
            children: subitems
        })
    }

    if (self.anket.personal.citizenship === 'other') {

        let subitems = [
            {
                type: 'field',
                doctype: 10,
                title: 'Свидетельство о рождении абитуриента',
                file: self.send.compatriotBirthDocFile,
                children: self.send.compatriotBirthDocFileModel,
                path: 'send.compatriotBirthDocFile',
                multiple: true,
                required: false,
            },
            {
                type: 'field',
                doctype: 10,
                title: 'Свидетельство о рождении отца (матери)',
                file: self.send.compatriotParentDocFile,
                children: self.send.compatriotParentDocFileModel,
                path: 'send.compatriotParentDocFile',
                multiple: true,
                required: false,
            },
        ]

        result.push({
            type: 'group',
            path: 'send.compatriotDocs',
            title: 'Документы, подтверждающие статус соотечественника',
            children: subitems
        })
    }

    return result
}
