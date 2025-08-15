import {InjectConfig} from "nestjs-config";
import {MailerService} from "@nestjs-modules/mailer";

export class MailService {

    constructor(
        @InjectConfig() private readonly config,
        private readonly mailerService: MailerService,
    ) {
    }

    async sendNotify(user, message, context: any = {}): Promise<void | any> {

        this.sendTemplate('newmessage', {
            'subject': 'Извещение о событии в кабинете абитуриента',
            'header': message.message.title || 'Новое сообщение на сайте',
            'body': message.message.body || message.message.text,
            'action_url': '/cab/abit/messenger',
            'action_title': 'Перейти в раздел сообщений',
            'to': user.email
        }, 'ru')


    }

    async sendTemplate(template, context: any = {}, lang: any): Promise<void | any> {

        lang = 'ru'

        let vars = context


        new Promise((resolve, reject) => {

            for (let varKey in context) {
                if (typeof context[varKey] === 'object' && context[varKey]['en']) {
                    vars[varKey] = context[varKey][lang]
                }
            }

            if (context.action_url)
                vars.action_url = this.config.get('app.SITE_URL') + context.action_url


            console.log({
                from: this.config.get('app.SITE_NAME')[lang] + ' <' + this.config.get('app.MAIL_FROM') + '>',
                to: vars.to,
                subject: vars.subject,
                template: template + '-' + lang,
                context: vars,
            })

            if (process.env.NODE_ENV == 'development') {
                if (!this.config.get('app.MAIL_ONLY_TO_ADDRESS') || this.config.get('app.MAIL_ONLY_TO_ADDRESS').indexOf(vars.to) === -1) {
                    console.log('STOP SEND')
                    resolve()
                    return;
                }
            }


            this.mailerService
                .sendMail({
                    from: this.config.get('app.SITE_NAME')[lang] + ' <' + this.config.get('app.MAIL_FROM') + '>',
                    to: vars.to,
                    subject: vars.subject,
                    template: './'+template + '-' + lang,
                    context: vars,
                })
                .then((e) => {

                    resolve()
                })
                .catch((e) => {
                    console.log(e)
                    reject(e)
                });
        })

    }


}
