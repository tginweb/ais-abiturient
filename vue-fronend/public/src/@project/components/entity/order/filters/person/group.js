import {firstName, lastName, docNumber, docSerial, email, phone, foreign} from './index'

export default {
    label: 'Персона',
    children: [
        firstName,
        lastName,
        docSerial,
        docNumber,
        email,
        phone,
        foreign
    ]
}