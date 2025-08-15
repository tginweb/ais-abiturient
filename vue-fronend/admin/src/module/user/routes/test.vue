<template>

  <div>
---

    AAA
    <br>
    sdsd
    sd
    <json-viewer :value="tree"></json-viewer>


  </div>

</template>

<script>


export default {
  props: {

  },
  components: {},
  data() {
    return {

    }
  },
  computed: {

    items() {
      return [
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 27604948.25
        },
        {
          "Account.AccountHierarchySecond": "1.07.УСЛУГИ СВЯЗИ",
          "Account.AccountHierarchyThird": "IP-телефония/услуги",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "IP-телефония/услуги",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 64470.3
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "АВТОМАТИЗАЦИЯ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "POS-периферия",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2100
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Pos-материалы",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Pos-материалы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 32895
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Аренда офиса",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Аренда офиса",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 30000
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Аренда постоянная",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Аренда постоянная",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 10688196.36
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Аренда с оборота",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Аренда с оборота",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 3299935.13
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Аренда сервера для сайтов",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Аренда сервера для сайтов",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 21065
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Аудио/Видео (ТВ и акустика)",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Аудио/Видео (ТВ и акустика)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Банк-Клиент",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Банк-Клиент",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 22750
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Баннер",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Баннер",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 317693.38
        },
        {
          "Account.AccountHierarchySecond": "Барная стойка",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Барная стойка",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 91680
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Блендеры/миксеры/куттеры",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 93083
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Бытовое оборудование и хоз. инвентарь",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Бытовое оборудование и хоз. инвентарь",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 109724.2
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Вакуумный упаковщик",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 135330
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Вентиляция и кондиционирование",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Вентиляция и кондиционирование",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 3800
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Весы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 26534.99
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Видеонаблюдение (камеры и комплектующие)",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Видеонаблюдение (камеры и комплектующие)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 75846
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Вода и отопление",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Вода и отопление",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 180173.99
        },
        {
          "Account.AccountHierarchySecond": "Вывеска",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Вывеска",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 85491.41
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Вывоз ТБО, снега, уборка территории",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Вывоз ТБО, снега, уборка территории",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 214768.89
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "ГСМ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "ГСМ",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 73123
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "ГСМ по водителям",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "ГСМ по водителям",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 555709
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "Госпошлина",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Госпошлина",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 3000
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Гриль/хоспер",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 11170.18
        },
        {
          "Account.AccountHierarchySecond": "Двери (покупка, установка, комплектующие)",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Двери (покупка, установка, комплектующие)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 206505.3
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Дезинфекция, СЭС",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Дезинфекция, СЭС",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 98525.63
        },
        {
          "Account.AccountHierarchySecond": "Жироуловитель(покупка,установка)",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Жироуловитель(покупка,установка)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 12000
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Инвентарь бара",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 81293.76
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Инвентарь кухни",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 262137.69
        },
        {
          "Account.AccountHierarchySecond": "1.07.УСЛУГИ СВЯЗИ",
          "Account.AccountHierarchyThird": "Интернет/услуги",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Интернет/услуги",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 195272.89
        },
        {
          "Account.AccountHierarchySecond": "Ипотека основной долг",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "2. ФИНАНСОВАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Ипотека основной долг",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 170000
        },
        {
          "Account.AccountHierarchySecond": "Ипотека проценты",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "2. ФИНАНСОВАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Ипотека проценты",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 33864.99
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "АВТОМАТИЗАЦИЯ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "ККТ/Фискальники",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 56208
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Календарные праздники",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Календарные праздники",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 6500
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Канализация/водоснабжение (установка, ремонт)",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Канализация/водоснабжение (установка, ремонт)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 135118
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Канцелярия",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Канцелярия",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 70125.37
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Клининговые расходы",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Клининговые расходы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 58230
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Комиссия QR код",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Комиссия QR код",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 40611.28
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Комиссия деливери.клаб",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Комиссия деливери.клаб",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 40408.9
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Комиссия за перевод/снятие ДС",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Комиссия за перевод/снятие ДС",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 20400
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Комиссия по Яндекс. Еда",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Комиссия по Яндекс. Еда",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 799030.31
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Комиссия по банковским картам",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Комиссия по банковским картам",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1568117.43
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Коммунальные платежи",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Коммунальные платежи",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 228692.79
        },
        {
          "Account.AccountHierarchySecond": "Коммуникационная сеть",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Коммуникационная сеть",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 29545
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Консультационные услуги",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Консультационные услуги",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Контакт-центр",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Контакт-центр",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 568874.67
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Кофемашины/кофемолки",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 9310
        },
        {
          "Account.AccountHierarchySecond": "Кредит ООО Вектор основной долг",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "2. ФИНАНСОВАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Кредит ООО Вектор основной долг",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 184837.15
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Кулер, вода",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Кулер, вода",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2040
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Курьер",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Курьер",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "Летняя терраса",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Летняя терраса",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 250072.6
        },
        {
          "Account.AccountHierarchySecond": "Лизинг",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "2. ФИНАНСОВАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Лизинг",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 354832
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "АВТОМАТИЗАЦИЯ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Лицензии Iiko",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 188568.29
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Льдогенераторы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1359.85
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Маркетинг Торгового Центра",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Маркетинг Торгового Центра",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 275886.25
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Маркетинговое сопровождение",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Маркетинговое сопровождение",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1419726
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Мармиты/термопоты/тепловые столы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 28684
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Мебель гостевая",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Мебель гостевая",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 127297.84
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Мебель для персонала",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Мебель для персонала",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 174611
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Медикаменты",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Медикаменты",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 22268.55
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Медосмотр. санкнижки",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Медосмотр. санкнижки",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 99000
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Меню",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Меню",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 153295.2
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Микроволновые печи",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 12390
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Моющие и чистящие средства",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Моющие и чистящие средства",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1391721.05
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "НДФЛ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "НДФЛ",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 702765.19
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Напольные покрытия, плинтуса, пороги",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Напольные покрытия, плинтуса, пороги",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2593
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Нейтральное оборудование",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 100777
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Обеспечение офиса",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Обеспечение офиса",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 3810979.44
        },
        {
          "Account.AccountHierarchySecond": "Обеспечительный платеж",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Обеспечительный платеж",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2008800
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Обслуживание вентиляции и кондиционеров",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Обслуживание вентиляции и кондиционеров",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 72895.48
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Обслуживание цветов",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Обслуживание цветов",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 473731.93
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Обслуживание/монтаж охранно-пожарной сигнализации",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Обслуживание/монтаж охранно-пожарной сигнализации",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 107406.6
        },
        {
          "Account.AccountHierarchySecond": "Окна (покупка, установка, комплектующие)",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Окна (покупка, установка, комплектующие)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1600
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ИНТЕРЬЕР/ДЕКОР",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Оплата дизайнеру",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 164100.98
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Оплата ремонтных работ",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Оплата ремонтных работ",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 507510
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Оргтехника и ПК",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Оргтехника и ПК",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 47274
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ИНТЕРЬЕР/ДЕКОР",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Освещение",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 438957.95
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Отделка стен (материалы)",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Отделка стен (материалы)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 99741.5
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "Отпускные, компенсации",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Отпускные, компенсации",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Охрана(абонентская плата)",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Охрана(абонентская плата)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 146073
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Пароконвектоматы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 26000
        },
        {
          "Account.AccountHierarchySecond": "Перелет, проживание",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Перелет, проживание",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Печатно-рекламная продукция",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Печатно-рекламная продукция",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 136003.5
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Печать для документов",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Печать для документов",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2300
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Печи/плиты/коптильня",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 27385
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Питание персонала за счет предприятия",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Питание персонала за счет предприятия",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 985380.12
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Подарки сотрудникам, ДР, корпоратив",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Подарки сотрудникам, ДР, корпоратив",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 50000
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Подбор персонала",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Подбор персонала",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 50648
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Посуда",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Посуда",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 577987.67
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Посудомоечные машины",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1080
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Потолки",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Потолки",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 4700
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Представительские расходы",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Представительские расходы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 50758.15
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Презент гостю",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Презент гостю",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 10769.71
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Премии",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Премии",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 597602.19
        },
        {
          "Account.AccountHierarchySecond": "Проектирование и спецификация",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Проектирование и спецификация",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 40000
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Промо",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Промо",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 40490
        },
        {
          "Account.AccountHierarchySecond": "Проценты по кредиту ООО Вектор",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "2. ФИНАНСОВАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Проценты по кредиту ООО Вектор",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 63658.85
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "РАО и ВОИС",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "РАО и ВОИС",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 18080
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Размещение на сторонних интернет-ресурсах",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Размещение на сторонних интернет-ресурсах",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 347038.24
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "АВТОМАТИЗАЦИЯ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Разработка 1С",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 11500
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Рассылки",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Рассылки",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 66719.15
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "АВТОМАТИЗАЦИЯ",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Расходы на ЕГАИС/Меркурий",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2300
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Рисоварки/термоса для риса",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 28650.5
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Сантехника",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сантехника",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 209489.94
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Сахар, палочки, соус",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сахар, палочки, соус",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 232287.99
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Сейфы, кэшбоксы",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сейфы, кэшбоксы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 989
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Сертификат денежный",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сертификат денежный",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Слайсеры",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 7340
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Служба IT и автоматизации",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Служба IT и автоматизации",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 703081.5
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Служба логистики",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Служба логистики",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 740138
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Сопровождение бухгалтерского учета",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сопровождение бухгалтерского учета",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 284646
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Сопровождение складского учета",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сопровождение складского учета",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 327360
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Сопровождение управленческого учета",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сопровождение управленческого учета",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 220000
        },
        {
          "Account.AccountHierarchySecond": "1.07.УСЛУГИ СВЯЗИ",
          "Account.AccountHierarchyThird": "Сотовая связь",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Сотовая связь",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 52411.49
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Социальные сети",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Социальные сети",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 17000
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Страхование имущества",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Страхование имущества",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 86896.26
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "Страховые взносы по единому тарифу",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Страховые взносы по единому тарифу",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1177762.55
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Строительный инструмент",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Строительный инструмент",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Тайный гость",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Тайный гость",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 30350
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Такси",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Такси",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1424493.6
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ИНТЕРЬЕР/ДЕКОР",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Текстиль/скатерти/салфетки",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 540
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Телефоны/гарнитуры/планшеты/ремонт",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Телефоны/гарнитуры/планшеты/ремонт",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 18148
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Тех.обслуживание холодильников",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 175550
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Техническая служба",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Техническая служба",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1162060
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Транспортные расходы",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Транспортные расходы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 79073.6
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "Транспортные средства",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Транспортные средства",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 28622.2
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "УСН 15%",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "УСН 15%",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1406300
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "УСН 6%",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "УСН 6%",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 306000
        },
        {
          "Account.AccountHierarchySecond": "1.03.НАКЛАДНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Упаковка",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Упаковка",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2553125.24
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Управление",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Управление",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 2357069
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Управление офис",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Управление офис",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 844286
        },
        {
          "Account.AccountHierarchySecond": "1.05.БАНКОВСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Услуги РКО (п/п)",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Услуги РКО (п/п)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 35889.81
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Учредитель",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Учредитель",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "ФСС от НС",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "ФСС от НС",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 10424.42
        },
        {
          "Account.AccountHierarchySecond": "Фасад заведения",
          "Account.AccountHierarchyThird": null,
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Фасад заведения",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 546609.5
        },
        {
          "Account.AccountHierarchySecond": "1.02.ЗАРАБОТНАЯ ПЛАТА",
          "Account.AccountHierarchyThird": "Форма, бейджики, карты для персонала",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Форма, бейджики, карты для персонала",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 135173
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Фритюры",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 62874.7
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Хозяйственные расходы",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Хозяйственные расходы",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 313906.29
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ОБОРУДОВАНИЕ КУХНИ И БАРА",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Холодильники/морозильники",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 513190.7
        },
        {
          "Account.AccountHierarchySecond": "1.04.АДМИНИСТРАТИВНО-УПРАВЛЕНЧЕСКИЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Чистка жироуловителя",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Чистка жироуловителя",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 161900
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ИНТЕРЬЕР/ДЕКОР",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Шторы, жалюзи, рольставни",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1449
        },
        {
          "Account.AccountHierarchySecond": "1.08.НАЛОГИ/ОТЧИСЛЕНИЯ/ПОШЛИНЫ",
          "Account.AccountHierarchyThird": "Штрафы/пени",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Штрафы/пени",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 9650
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Эксплуатационные расходы (ТЦ)",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Эксплуатационные расходы (ТЦ)",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 204719.62
        },
        {
          "Account.AccountHierarchySecond": "3.1. СТРОИТЕЛЬНО-РЕМОНТНЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Электрика",
          "Account.AccountHierarchyTop": "3. ИНВЕСТИЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Электрика",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 516399.09
        },
        {
          "Account.AccountHierarchySecond": "1.01.АРЕНДНЫЕ И КОММУНАЛЬНЫЕ ПЛАТЕЖИ",
          "Account.AccountHierarchyThird": "Электроэнергия",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Электроэнергия",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1464018.97
        },
        {
          "Account.AccountHierarchySecond": "1.06.ТМЦ",
          "Account.AccountHierarchyThird": "ИНТЕРЬЕР/ДЕКОР",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Элементы декора",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 23000
        },
        {
          "Account.AccountHierarchySecond": "1.12.АУТСОРСИНГ",
          "Account.AccountHierarchyThird": "Юридическое сопровождение",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Юридическое сопровождение",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 0
        },
        {
          "Account.AccountHierarchySecond": "1.13.МАРКЕТИНГОВЫЕ РАСХОДЫ",
          "Account.AccountHierarchyThird": "Яндекс. Еда",
          "Account.AccountHierarchyTop": "1. ОПЕРАЦИОННАЯ ДЕЯТЕЛЬНОСТЬ",
          "Account.Name": "Яндекс. Еда",
          "Sum.PartOfIncome": null,
          "Sum.ResignedSum": 1
        }
      ]
    },
    tree() {

      const tree = {}

      this.items.forEach((item) => {

        let nodeTop = {}
        let nodeSecond = {}
        let nodeThird = {}

        const cat1 = item['Account.AccountHierarchyTop']
        const cat2 = item['Account.AccountHierarchySecond']
        const cat3 = item['Account.AccountHierarchyThird']
        const name = item['Account.Name']

        if (!tree[cat1]) {
          nodeTop = {
            name: cat1,
            children: {}
          }
          tree[cat1] = nodeTop
        } else {
          nodeTop = tree[cat1]
        }

        if (cat2) {
          if (!nodeTop.children[cat2]) {
            nodeSecond = {
              name: cat2,
              children: {}
            }
            nodeTop.children[cat2] = nodeSecond
          } else {
            nodeSecond = nodeTop.children[cat2]
          }
        }

        if (cat3) {
          if (!nodeSecond.children[cat3]) {
            nodeThird = {
              name: cat3,
              children: {}
            }
            nodeSecond.children[cat3] = nodeThird
          } else {
            nodeThird = nodeSecond.children[cat3]
          }
        }

        if (name === cat1) {
          nodeTop.children[name] = {
            type: 'value',
            ...item
          }
        } else if (name === cat2) {
          nodeSecond.children[name] = {
            type: 'value',
            ...item
          }
        } else {
          nodeThird.children[name] = {
            type: 'value',
            ...item
          }
        }

      })


      const objectsToArray = (object) => {

        console.log(object)

        const result = []

        if (object.type !== 'value') {
          Object.values(object).forEach((item)=>{
            result.push({
              ...item,
              children: item.children ? objectsToArray(item.children) : []
            })
          })
        } else {
          result.push(object)
        }

        return result
      }

      return objectsToArray(tree)
    }
  },
  methods: {},
  created() {

  },
  beforeDestroy() {

  },

  mounted() {

  },
  watch: {}
}

</script>

<style lang="scss" scoped>


</style>
