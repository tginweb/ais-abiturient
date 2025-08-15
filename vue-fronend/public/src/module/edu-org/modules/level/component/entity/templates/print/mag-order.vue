<template>

  <div class="print-tpl">

    <div style="float: left;">
      № {{vars.order.nid}}
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
            <span>Фамилия:</span>&nbsp; <u>{{dataPersonal.lastName}}</u>
          </div>
          <div>
            <span>Имя</span>&nbsp; <u>{{dataPersonal.firstName}}</u>
          </div>
          <div>
            <span>Отчество</span>&nbsp; <u>{{dataPersonal.secondName}}</u>
          </div>
          <div>
            <span>Дата рождения:</span>&nbsp; <u>{{dataPersonal.birthday}}</u>
          </div>
          <div>
            <span>Гражданство:</span>&nbsp;<u>{{compCitizenship}}</u>
          </div>
        </td>
        <td valign="top">

          <div>
            <span>Документ, удостоверяющий личность:</span>&nbsp; <u>{{getTermByNid('abit.personDocType',
            dataPersonal.docType, 'name')}}</u>
          </div>

          <div>
            <span>Серия</span>&nbsp; <u>{{dataPersonal.doc.serial}}</u>&nbsp;
            <span>№</span>&nbsp; <u>{{dataPersonal.doc.number}}</u>&nbsp;
            <span>Код подразделения</span>&nbsp; <u>{{dataPersonal.doc.subcode}}</u>
          </div>

          <div>
            <span>Кем выдан:</span>&nbsp; <u>{{dataPersonal.doc.organization}}</u>
          </div>

          <div>
            <span>Дата выдачи:</span>&nbsp; <u>{{dataPersonal.doc.date}}</u>
          </div>

          <div>
            <span>Адрес регистрации по месту жительства:</span>&nbsp; <u>{{dataPersonal.addressReg.name}}</u>
          </div>

        </td>
      </tr>
    </table>

    <p>
        Контактная информация: телефон (основной) <u>{{dataPersonal.phone}}</u>

        телефон (дополнительный) <u>{{dataPersonal.phone2}}</u>

        e-mail <u>{{dataPersonal.email}}</u>

        адрес фактического проживания <u>{{dataPersonal.addressEqual ? dataPersonal.addressReg.name : dataPersonal.addressLive.name}}</u>
    </p>

    <p align="center" style='text-align:center;line-height:115%'>
      <b><span style=';line-height:115%'>ЗАЯВЛЕНИЕ</span></b>
    </p>

    <p>
      Прошу допустить меня к участию во вступительных испытаниях, проводимых
      вузом самостоятельно, на следующее направление подготовки магистратуры:
    </p>

    <table border="1" cellspacing="0" cellpadding="4" style="margin-bottom: 20px;" >
      <tbody>
      <tr>
        <td  valign="top">
          <p align="center">
            Наименование направления подготовки магистратуры
          </p>
        </td>
        <td  valign="top">
          <p align="center">
            Форма обучения
          </p>
          <p align="center">
            <em>(очная/очно-заочная/заочная)</em>
          </p>
        </td>
        <td  valign="top">
          <p align="center">
            Основа обучения
          </p>
          <p align="center">
            <em>(бюджетная/ целевая/ коммерческая)</em>
          </p>
        </td>
      </tr>
      <tr v-if="compApplication">
        <td  valign="top">

          {{compApplication.eduProgram.direct_name}}

          <div v-if="compApplication.specs && compApplication.specs.length">

            <ul style="font-size: 14px;">
              <li
                  :key="specNid"
                  v-for="specNid of compApplication.specs"
              >
                    <span v-if="$store.getters['abit/eduProgramsPreparedAllByNid'][specNid]">
                      {{$store.getters['abit/eduProgramsPreparedAllByNid'][specNid].abbr}}
                      {{$store.getters['abit/eduProgramsPreparedAllByNid'][specNid].spec_name}}
                    </span>
              </li>
            </ul>

          </div>

          <div v-else>

            <ul style="font-size: 14px;">
              <li>
                {{compApplication.eduProgram.spec_name}}
              </li>
            </ul>

          </div>

        </td>
        <td  valign="middle" align="center">
          {{compApplication.eduProgram.eduFormData.name}}
        </td>
        <td  valign="middle" align="center">
          {{$store.getters['abit/termsByNid'].eduOsnova[compApplication.osnova].name.toLowerCase()}}
        </td>
      </tr>
      </tbody>
    </table>

    <p class="dense">
        <span>
          Прошу создать специальные условия&nbsp; при проведении вступительных испытаний в связи с ограниченными возможностями здоровья, инвалидностью:
        </span>
    </p>

    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 0px;">
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
      бакалавриат <el-tpl-checkbox :value="dataEducation.level==2"></el-tpl-checkbox> /
      специалитет <el-tpl-checkbox :value="dataEducation.level==1"></el-tpl-checkbox> /
      магистратура <el-tpl-checkbox :value="dataEducation.level==3"></el-tpl-checkbox> /
      "дипломированный специалист" <el-tpl-checkbox :value="false"></el-tpl-checkbox>,
    </p>

    <p>
      окончил(а): <u style="word-wrap: break-word; width:100%;" v-html="getValuePlaceholder(dataEducation.doc.organization, 150)"></u>
      &nbsp; <span>(полное наименование образовательного учреждения )</span>
    </p>

    <p>
      по направлению (специальности)
      <u style="word-wrap: break-word; width:100%;" v-html="getValuePlaceholder(dataEducation.specialty, 40, 40)"></u>
    </p>

    <p>
      Диплом:
      <span>
          серия <u v-html="getValuePlaceholder(dataEducation.doc.serial, 10)"></u> &nbsp;
          № <u v-html="getValuePlaceholder(dataEducation.doc.number, 20)"></u> &nbsp;
          Дата выдачи <u v-html="getValuePlaceholder(dataEducation.doc.date, 20)"></u>
      </span>
    </p>

    <p>
      Иностранный язык:
      английский <el-tpl-checkbox :value="compLanguagesByNid[1]"/>,&nbsp;
      немецкий <el-tpl-checkbox :value="compLanguagesByNid[2]"/>,&nbsp;
      французский <el-tpl-checkbox :value="compLanguagesByNid[3]"/>,&nbsp;
      другой <el-tpl-checkbox :value="compLanguagesByNid[10]"/> &nbsp;<u v-html="getValuePlaceholder(dataPersonal.languageCustom, 12)"></u>,&nbsp;&nbsp;
      не изучал(а) <el-tpl-checkbox :value="compLanguagesByNid[0]"/>.
    </p>

    <p>
      ИНН <u v-html="getValuePlaceholder(dataPersonal.inn, 20)"></u>
      &nbsp;&nbsp;СНИЛС <u v-html="getValuePlaceholder(dataPersonal.snils, 20)"></u>
    </p>

    <table>
      <tr>
        <td valign="top">
          <p>
            <el-tpl-checkbox :value="appsOsnovaKeys.target"/>
          </p>
        </td>
        <td>
          <p class="dense"> <b><span>Заключен договор о целевом обучении</span></b> </p>

          <p class="dense">
            <span style="width: 100%;display: block;border-bottom: 1px solid #111111;">
              {{dataEntrance.targetOrganization}} {{dataEntrance.targetDogovor}}
            </span>
            <span style="font-size: 14px;">(полное наименование организации (муниципального образования), номер договора о целевом обучении)</span>
          </p>
        </td>
      </tr>
    </table>

    <p>
      <b>Наличие индивидуальных достижений</b>
      да <el-tpl-checkbox :value="dataEntrance.achievements.length>0"/>
      / нет <el-tpl-checkbox :value="dataEntrance.achievements.length==0"/>
    </p>


    <table border="1" cellspacing="0" cellpadding="2" style="margin-bottom: 20px;">
      <tbody>
      <tr>
        <td >
          <p>
            №
          </p>
        </td>
        <td >
          <p align="center">
            Наименование индивидуального достижения
          </p>
        </td>
        <td >
          <p align="center">
            Наличие достижения
          </p>
        </td>
      </tr>
      <tr>
        <td >
          <p>
            1
          </p>
        </td>
        <td >
          <p>
            Наличие статуса победителя, призера:
          </p>
          <ul>
            <li>
              международной олимпиады по профилю, соответствующему
              направлению магистратуры при поступлении;
            </li>
            <li>
              творческих международных конкурсов по направлениям
              подготовки творческой направленности;
            </li>
            <li>
              олимпиад «Национальной технологической инициативы» по
              профилю, соответствующему направлению магистратуры при
              поступлении.\
            </li>
            <li>
              национального чемпионата профессионального мастерства
              WorldSkills Russia;
            </li>
            <li>
              международного инженерного чемпионата «CASE-IN».
            </li>
          </ul>
        </td>
        <td  valign="middle" align="center">
          <el-tpl-checkbox :value="achievementsByNid[10]"/>
        </td>
      </tr>
      <tr>
        <td >
          <p>
            2
          </p>
        </td>
        <td >
          <p>
            Наличие статуса победителя, призера всероссийского этапа
            ВСО по профилю, соответствующему направлению магистратуры
            при поступлении.
          </p>
        </td>
        <td  valign="middle" align="center">
        </td>
      </tr>
      <tr>
        <td >
          <p>
            3
          </p>
        </td>
        <td >
          <p>
            Наличие статуса победителя, призера региональной олимпиады
            по профилю, соответствующему направлению магистратуры при
            поступлении.
          </p>
        </td>
        <td  valign="middle" align="center">
        </td>
      </tr>
      <tr>
        <td >
          <p>
            4
          </p>
        </td>
        <td >
          <p>
            Участие в олимпиаде для студентов и выпускников
            «Магистратура будущего», проводимой ИРНИТУ по профилю,
            соответствующему направлению магистратуры при поступлении.
          </p>
        </td>
        <td  valign="middle">
        </td>
      </tr>
      <tr>
        <td >
          <p>
            5
          </p>
        </td>
        <td >
          <p>
            Наличие диплома о высшем образовании с отличием
          </p>
        </td>
        <td  valign="middle" align="center">
          <el-tpl-checkbox :value="achievementsByNid[11]"/>
        </td>
      </tr>
      <tr>
        <td >
          <p>
            6
          </p>
        </td>
        <td >
          <ul>
            <li>
              Победители и призеры регионального (отборочного этапа)
              чемпионата профессионального мастерства WorldSkills
              Russia;
            </li>
            <li>
              Победитель проекта Профстажировки.рф;
            </li>
            <li>
              Победитель студенческой олимпиады «Я - профессионал».
            </li>
          </ul>
        </td>
        <td  valign="middle" align="center">
        </td>
      </tr>
      <tr>
        <td >
          <p>
            7
          </p>
        </td>
        <td >
          <p>
            Наличие документов, подтверждающих факт опубликования
            издания и статьи в т.ч. в соавторстве с учетом статуса
            издания по профилю направления подготовки:
          </p>
          <ul>
            <li>
              издания (учебные пособия, монографии) в т.ч. в
              соавторстве
            </li>
            <li>
              публикаций в журналах, входящих в международные системы
              научного цитирования Scopus и (или) Web of Science в
              т.ч. в соавторстве;
            </li>
            <li>
              публикаций в сборниках трудов конференций, входящих в
              международные системы научного цитирования Scopus и
              (или) Web of Science в т.ч. в соавторстве;
            </li>
            <li>
              статьи в российских периодических изданиях из перечня
              ВАК, в т.ч. в соавторстве
            </li>
            <li>
              статьи в прочих изданиях (не более 3-х соавторов),
              входящих в РИНЦ, но не более 5-и статей.
            </li>
          </ul>
        </td>
        <td  valign="middle" align="center">
          <el-tpl-checkbox :value="achievementsByNid[12]"/>
        </td>
      </tr>
      <tr>
        <td >
          <p>
            8
          </p>
        </td>
        <td >
          <p>
            Спортивные достижения:
          </p>
          <ul>
            <li>
              Наличие статуса чемпиона и призера Олимпийских игр,
              Паралимпийских игр и Сурдлимпийских игр, чемпиона мира,
              чемпиона Европы, лица, занявшего первое место на
              первенстве мира, первенстве Европы по видам спорта,
              включенным в программы Олимпийских игр, Паралимпийских
              игр и Сурдлимпийских игр;
            </li>
            <li>
              Наличие удостоверения КМС или мастера спорта
            </li>
          </ul>
        </td>
        <td  valign="middle" align="center">
          <el-tpl-checkbox :value="achievementsByNid[13]"/>
        </td>
      </tr>
      <tr>
        <td >
          <p>
            8
          </p>
        </td>
        <td >
          <p>
            Наличие российских и зарубежных патентов (положительных
            решений о выдачи), свидетельств на полезную модель,
            свидетельств на изобретение, свидетельств на программу ЭВМ
            по тематике, соответствующей направлению подготовки
          </p>
        </td>
        <td  valign="middle">
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
      поступающим особых правах и преимуществах при приеме на обучение    <strong>ознакомлен(а</strong><strong>) </strong>
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
        приеме, за подлинность подаваемых документов    <strong>предупрежден(а) </strong><strong> </strong>
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
      На обработку, использование, распространение (в том числе передачу,
      обезличивание, блокирование, уничтожение) моих персональных данных,
      содержащихся в настоящем заявлении и прилагаемых к нему документов с целью
      учета поступающих на обучение в соответствии с законом №152-ФЗ от
      27.07.2006г. «О персональных данных», с Положением о персональных данных
      абитуриентов и обучающихся ФГБОУ ВО ИРНИТУ<strong> согласен(а)</strong>    <strong></strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p>
      На рассылку новостей и информации ИРНИТУ на эл. почту и на телефон  <strong>согласен(а)</strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p>
      С датой завершения приема заявления о согласии на зачисление   <strong>ознакомлен(а)</strong>
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
    methods: {

    },
    computed: {


    }
  }
</script>


<style lang="sass" scoped>


</style>
