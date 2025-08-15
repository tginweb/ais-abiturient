<template>

  <div class="print-tpl">

    <div style="float: left;">
      № {{ vars.order.nid }}
    </div>


    <p align="right" class="dense" style='text-align:right;clear: none;'>
      <b>Регистрационный номер</b> <u>________</u>
    </p>

    <p class="dense">
      <b>
          <span>
            Ректору федерального государственного бюджетного образовательного учреждения высшего образования
           «Иркутский национальный исследовательский технический университет»
          </span>
      </b>
    </p>

    <p align="right" style='text-align:right'>
      <span style='font-size: 11.0pt'>Россия, 664074, Иркутская область, г. Иркутск, ул. Лермонтова, 83</span>
    </p>

    <table border="1" cellpadding="0" cellspacing="0"
           class="" style='border-collapse:collapse;border:none;margin-bottom: 20px;'>
      <tr>
        <td style='width:35%;' valign="top">
          <div>
            <span>Фамилия:</span>&nbsp; <u>{{ dataPersonal.lastName }}</u>
          </div>
          <div>
            <span>Имя</span>&nbsp; <u>{{ dataPersonal.firstName }}</u>
          </div>
          <div>
            <span>Отчество</span>&nbsp; <u>{{ dataPersonal.secondName }}</u>
          </div>
          <div>
            <span>Дата рождения:</span>&nbsp; <u>{{ dataPersonal.birthday }}</u>
          </div>
          <div>
            <span>Гражданство:</span>&nbsp;<u>{{ compCitizenship }}</u>
          </div>
        </td>
        <td valign="top">

          <div>
            <span>Документ, удостоверяющий личность:</span>&nbsp; <u></u>
          </div>

          <div>
            <span>Серия</span>&nbsp; <u>{{ docPassport && docPassport.docSeries }}</u>&nbsp;
            <span>№</span>&nbsp; <u>{{ docPassport && docPassport.docNumber }}</u>&nbsp;
            <span>Код подразделения</span>&nbsp; <u>{{ docPassport && docPassport.fields['SubdivisionCode'] }}</u>
          </div>

          <div>
            <span>Кем выдан:</span>&nbsp; <u>{{ docPassport && docPassport.docOrg }}</u>
          </div>

          <div>
            <span>Дата выдачи:</span>&nbsp; <u>{{ docPassport && docPassport.issueDate }}</u>
          </div>

          <div>
            <span>Адрес регистрации по месту жительства:</span>&nbsp; <u>{{ dataPersonal.addressReg.name }}</u>
          </div>

        </td>
      </tr>
    </table>

    <p>
      Контактная информация: телефон (основной) <u>{{ dataPersonal.phone }}</u>

      телефон (дополнительный) <u>{{ dataPersonal.phone2 }}</u>

      e-mail <u>{{ dataPersonal.email }}</u>

      адрес фактического проживания
      <u>{{ dataPersonal.addressEqual ? dataPersonal.addressReg.name : dataPersonal.addressLive.name }}</u>
    </p>

    <p align="center" style='text-align:center;line-height:115%'>
      <b><span style=';line-height:115%'>ЗАЯВЛЕНИЕ</span></b>
    </p>

    <p>
      Прошу допустить меня к участию во вступительных испытаниях, проводимых
      вузом самостоятельно, на следующее направление подготовки магистратуры:
    </p>

    <table border="1" cellpadding="4" cellspacing="0" style="margin-bottom: 20px;" class="bordered">
      <tbody>
      <tr>
        <td valign="top">
          <p align="center">
            Наименование направления подготовки магистратуры
          </p>
        </td>
        <td valign="top">
          <p align="center">
            Форма обучения
          </p>
          <p align="center">
            <em>(очная/очно-заочная/заочная)</em>
          </p>
        </td>
        <td valign="top">
          <p align="center">
            Основа обучения
          </p>
          <p align="center">
            <em>(бюджетная/ целевая/ коммерческая)</em>
          </p>
        </td>
      </tr>
      <tr v-if="compApplication">
        <td valign="top">

          {{ compApplication.competition.admission.direct_name }}

          <ul style="font-size: 14px;" v-if="compApplication.competition.admission.spec_name">
            <li>
              {{ compApplication.competition.admission.spec_name }}
            </li>
          </ul>

        </td>
        <td align="center" valign="middle">
          {{ compApplication.competition.admission.fob.name }}
        </td>
        <td align="center" valign="middle">
          {{ compApplication.competition.source.name }}
        </td>
      </tr>
      </tbody>
    </table>

    <p class="dense">
        <span>
          Прошу создать специальные условия&nbsp; при проведении вступительных испытаний в связи с ограниченными возможностями здоровья, инвалидностью:
        </span>
    </p>

    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 0px;" class="">
      <tr>
        <td valign="top">
          <u v-html="getValuePlaceholder(dataEntrance.specialNeeds, 80)"></u>
        </td>
        <td valign="top">
          <br>
          <div class="quote">
            <div class="line"></div>
            <div class="label">
              (подпись абитуриента)
            </div>
          </div>
        </td>
      </tr>
    </table>

    <p class="dense">
      <strong>Сведения об образовании</strong>:
    </p>

    <p class="dense">
      имею высшее образование:
      бакалавриат
      <el-tpl-checkbox :value="false"></el-tpl-checkbox>
      /
      специалитет
      <el-tpl-checkbox :value="false"></el-tpl-checkbox>
      /
      магистратура
      <el-tpl-checkbox :value="false"></el-tpl-checkbox>
      /
      "дипломированный специалист"
      <el-tpl-checkbox :value="false"></el-tpl-checkbox>
      ,
    </p>

    <p>
      окончил(а): <u style="word-wrap: break-word; width:100%;"
                     v-html="getValuePlaceholder(docEdu ? docEdu.docOrg : '', 150)"></u>
      &nbsp; <span>(полное наименование образовательного учреждения )</span>
    </p>

    <p>
      по направлению (специальности)
      <u style="word-wrap: break-word; width:100%;" v-html="getValuePlaceholder(dataEducation.specialty, 40, 40)"></u>
    </p>

    <p>
      Диплом:
      <span>
          серия <u v-html="getValuePlaceholder(docEdu ? docEdu.docSeries : '', 10)"></u> &nbsp;
          № <u v-html="getValuePlaceholder(docEdu ? docEdu.docNumber : '', 20)"></u> &nbsp;
          Дата выдачи <u v-html="getValuePlaceholder(docEdu ? docEdu.issueDate : '', 20)"></u>
      </span>
    </p>

    <p>
      Иностранный язык:
      английский
      <el-tpl-checkbox :value="compLanguagesByNid[1]"/>
      ,&nbsp;
      немецкий
      <el-tpl-checkbox :value="compLanguagesByNid[2]"/>
      ,&nbsp;
      французский
      <el-tpl-checkbox :value="compLanguagesByNid[3]"/>
      ,&nbsp;
      другой
      <el-tpl-checkbox :value="compLanguagesByNid[10]"/> &nbsp;<u
        v-html="getValuePlaceholder(dataPersonal.languageCustom, 12)"></u>,&nbsp;&nbsp;
      не изучал(а)
      <el-tpl-checkbox :value="compLanguagesByNid[0]"/>
      .
    </p>

    <p>
      ИНН <u v-html="getValuePlaceholder(dataPersonal.inn, 20)"></u>
      &nbsp;&nbsp;СНИЛС <u v-html="getValuePlaceholder(dataPersonal.snils, 20)"></u>
    </p>

    <table cellpadding="5">
      <tr>
        <td valign="top">
          <p>
            <el-tpl-checkbox :value="appsOsnovaKeys.target"/>
          </p>
        </td>
        <td>
          <p class="dense"><b><span>Заключен договор о целевом обучении</span></b></p>

          <p class="dense">
            <span style="width: 100%;display: block;border-bottom: 1px solid #111111;">
           &nbsp;   {{ dataEntrance.targetOrganization }} {{ dataEntrance.targetDogovor }}
            </span>
            <span style="font-size: 14px;">(полное наименование организации (муниципального образования), номер договора о целевом обучении)</span>
          </p>

        </td>
      </tr>
    </table>

    <p>
      <b>Наличие индивидуальных достижений</b>
      да
      <el-tpl-checkbox :value="dataEntrance.achievements.length>0"/>
      / нет
      <el-tpl-checkbox :value="dataEntrance.achievements.length==0"/>
    </p>

    <table class="bordered">
      <tbody>
      <tr>
        <td>
          <p>№</p>
        </td>
        <td>
          <p>Наименование индивидуального достижения</p>
        </td>
        <td>
          Наличие достижения
        </td>
      </tr>
      <tr>
        <td>
          <p>1</p>
        </td>
        <td>
          <p>1.1&nbsp;&nbsp;&nbsp; Наличие статуса победителя, призера, международной олимпиады по профилю,
            соответствующему направлению магистратуры при поступлении</p>
          <p>1.2&nbsp;&nbsp;&nbsp; Наличие статуса победителя, призёра творческих международных конкурсов по
            направлениям подготовки творческой направленности.</p>
          <p>1.3&nbsp;&nbsp;&nbsp; Наличие статуса победителя, призёра олимпиад</p>
          <p>&laquo;Национальной технологической инициативы&raquo; по профилю, соответствующему направлению магистратуры
            при поступлении</p>
          <p>1.4&nbsp;&nbsp;&nbsp; Победители и призёры национального чемпионата профессионального мастерства
            WorldSkills Russia</p>
          <p>1.5&nbsp;&nbsp;&nbsp; Победители и призёры международного инженерного чемпионата &laquo;CASE-IN&raquo;</p>
          <p>1.6&nbsp;&nbsp;&nbsp; Победители и призёры студенческого кейс-чемпионат по развитию металлургического
            комплекса METAL CUP</p>

        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>1</p>
        </td>
        <td>
          <p>
            1.7	Эксперт национального чемпионата профессионального мастерства WorldSkills, по профилю, соответствующему направлению магистратуры
          </p>
          <p>
            1.8 Наличие свидетельств о профессиональной подготовке и квалификации (сертификаты, дипломы и др.), вне зависимости от их количества, по направлению подготовки (за 2018-2023)
          </p>
          <p>1.9 &nbsp;Победители и призёры всероссийского конкурса Выпускных квалификационных работ</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>2</p>
        </td>
        <td>
          <p>Наличие статуса победителя, призёра, всероссийского этапа ВСО по профилю, соответствующему направлению
            магистратуры при поступлении</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>3</p>
        </td>
        <td>
          <p>Наличие статуса победителя, призёра, региональной олимпиады по профилю, соответствующему направлению
            магистратуры при поступлении</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>4</p>
        </td>
        <td>
          <p>Участник Топ 100 выпускников ИРНИТУ</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>5</p>
        </td>
        <td>
          <p>Диплом о профессиональной переподготовки «Переводчик в сфере профессиональных коммуникаций» ИРНИТУ</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>6</p>
        </td>
        <td>
          <p>Наличие диплома о высшем образовании с отличием</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>7</p>
        </td>
        <td>
          <p>Наличие именных стипендий (вне зависимости от их количества)</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>8</p>
        </td>
        <td>
          <p>Участие в научно-исследовательских работах, научных грантах, проектах (гос.задание), хоз. договорах по направлению (скан копия научно-технического отчёта)</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>9</p>
        </td>
        <td>
          <p>9.1. Победители и призеры регионального (отборочного этапа) чемпионата профессионального мастерства WorldSkills Russia</p>
          <p>9.2. Победитель проекта Профстажировки.рф</p>
          <p>9.3. Победитель студенческой олимпиады «Я - профессионал»</p>
          <p>9.4 Конкурсы (олимпиады), проводимые ИРНИТУ по профилю, соответствующему направлению магистратуры (в независимости от их количества)</p>

        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>10</p>
        </td>
        <td>
          <p>Наличие документов, подтверждающих факт опубликования издания и статьи в т.ч. в соавторстве с учётом статуса издания по профилю направления подготовки (Скан-копии основных страниц журнала, в том числе электронного, где указаны автор, название и полные реквизиты издания):</p>
          <p>10.1.издания (учебные пособия, монографии) в т.ч. в соавторстве</p>
          <p>10.2. публикаций в журналах, входящих в международные системы научного цитирования Scopus и (или) Web of Science в т.ч. в соавторстве</p>
          <p>10.3 публикаций в сборниках трудов конференций, входящих в международные системы научного цитирования Scopus и (или) Web of Science в т.ч. в соавторстве</p>
          <p>10.4 статьи в российских периодических изданиях из перечня ВАК, в т.ч. в соавторстве</p>
          <p>10.5 статьи в прочих изданиях (не более 3-х соавторов), входящих в РИНЦ, но не более 5-и статей</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>11</p>
        </td>
        <td>
          <p>Наличие российских и зарубежных патентов (положительных решений о выдачи), свидетельств на полезную модель, свидетельств на изобретение, свидетельств на программу ЭВМ по тематике, соответствующей направлению подготовки</p>
        </td>
        <td>

        </td>
      </tr>
      <tr>
        <td>
          <p>12</p>
        </td>
        <td>
          <p>Спортивные достижения</p>
          <p>12.1.Наличие статуса чемпиона и призера Олимпийских игр, Паралимпийских игр и Сурдлимпийских игр, чемпиона мира, чемпиона Европы, лица, занявшего первое место на первенстве мира, первенстве Европы по
          видам спорта, включенным в программы Олимпийских игр, Паралимпийских игр и Сурдлимпийских игр.</p>
          <p>12.2. Наличие удостоверения КМС или мастера спорта</p>
        </td>
        <td>

        </td>
      </tr>
      </tbody>
    </table>

    <p>
      С копией лицензии на осуществление образовательной деятельности, копией
      свидетельства о государственной аккредитации и приложением к ним по
      выбранному направлению подготовки (специальности), Уставом ИРНИТУ,
      правилами приема, положением об апелляционной комиссии и процедуре
      апелляций по результатам вступительных испытаний, проводимых в ИРНИТУ,
      расписанием вступительных испытаний, информацией о предоставляемых
      поступающим особых правах и преимуществах при приеме на обучение <strong>ознакомлен(а</strong><strong>) </strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <div style="clear: both;">
      <p>
        Об ответственности за достоверность сведений, указанных в заявлении о
        приеме, за подлинность подаваемых документов <strong>предупрежден(а) </strong><strong> </strong>
      </p>
      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>
    </div>

    <div style="clear: both;">
      <p>
        При поступлении на бюджетную основу обучения <b>по программам магистратуры подтверждаю</b> отсутствие диплома магистра, диплома специалиста
      </p>
      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>
    </div>


    <div style="clear: both">
      <p>
        При поступлении на бюджетную основу обучения (в рамках контрольных цифр)
        <strong>по программам магистратуры</strong> <strong>подтверждаю</strong>
        отсутствие диплома магистра, диплома специалиста
      </p>
      <div class="quote offset-top-minus">
        <div class="line"></div>
        <div class="label">
          (подпись абитуриента)
        </div>
      </div>
    </div>

    <p>
      Потребность в предоставлении места для проживания в общежитии в период
      обучения
      <b>да</b>&nbsp;
      <el-tpl-checkbox :value="dataPersonal.needFlat"/> &nbsp;
      <b>нет</b>&nbsp;
      <el-tpl-checkbox :value="!dataPersonal.needFlat"/>
    </p>

    <p>
      В случае непоступления на обучение прошу вернуть представленный оригинал документа об образовании следующим способом:
      лично   <el-tpl-checkbox :value="false"/> &nbsp;;
      доверенному лицу   <el-tpl-checkbox :value="false"/> &nbsp;;
      через оператора почтовой связи общего пользования   <el-tpl-checkbox :value="false"/> &nbsp;
    </p>

    <p>
      На рассылку новостей и информации ИРНИТУ на эл. почту и на телефон <strong>согласен(а)</strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p>
      С датой завершения приема заявления о согласии на зачисление <strong>ознакомлен(а)</strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <table>
      <tr>
        <td>Лицо, ответственное за прием документов&nbsp;</td>
        <td>
          <br>
          <div class="quote">
            <div class="line"></div>
            <div class="label">
              (подпись)
            </div>
          </div>
        </td>
        <td>
          <br>
          <div class="quote">
            <div class="line"></div>
            <div class="label">
              (расшфровка)
            </div>
          </div>
        </td>
      </tr>
    </table>

  </div>

</template>

<script>

import Base from './_base-order'

export default {
  extends: Base,
  methods: {},
  computed: {}
}
</script>


<style lang="sass" scoped>


</style>
