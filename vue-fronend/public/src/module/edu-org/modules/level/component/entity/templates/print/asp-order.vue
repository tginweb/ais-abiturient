<template>

  <div class="print-tpl">

    <div style="float: left;">
      № {{vars.order.nid}}
    </div>

    <p align="right" class="dense" style='text-align:right;clear: none;'>
      <b>Регистрационный номер</b> <u>________</u>
    </p>

    <div>

      <p align="right" class="dense">
        <b>Ректору федерального государственного бюджетного образовательного<br>
        учреждения высшего образования «Иркутский национальный<br>
          исследовательский технический университет»</b>
      </p>
      <p align="right">
        Россия, 664074, Иркутская область, г. Иркутск, ул. Лермонтова, 83
      </p>

      <table border="1" cellspacing="0" cellpadding="0" width="730">
        <tbody>
        <tr>
          <td width="359" valign="top">
            <p class="dense">
              Фамилия &nbsp; <u>{{dataPersonal.lastName}}</u>
            </p>
            <p class="dense">
              Имя &nbsp; <u>{{dataPersonal.firstName}}</u>
            </p>
            <p class="dense">
              Отчество &nbsp; <u>{{dataPersonal.secondName}}</u>
            </p>
            <p class="dense">
              Дата рождения &nbsp; <u>{{dataPersonal.birthday}}</u>
            </p>
            <p class="dense">
              Гражданство <u>{{compCitizenship}}</u>
            </p>
          </td>
          <td width="371" valign="top">
            <p class="dense">
              <span>Документ, удостоверяющий личность:</span>&nbsp; <u>{{getTermByNid('abit.personDocType',
              dataPersonal.docType, 'name')}}</u>
            </p>

            <p class="dense">
              <span>Серия</span>&nbsp; <u>{{dataPersonal.doc.serial}}</u>&nbsp;
              <span>№</span>&nbsp; <u>{{dataPersonal.doc.number}}</u>&nbsp;
              <span>Код подразделения</span>&nbsp; <u>{{dataPersonal.doc.subcode}}</u>
            </p>

            <div class="dense">
              <span>Кем выдан:</span>&nbsp; <u>{{dataPersonal.doc.organization}}</u>
            </div>

            <div class="dense">
              <span>Дата выдачи:</span>&nbsp; <u>{{dataPersonal.doc.date}}</u>
            </div>

            <p class="dense">
              Адрес регистрации по месту жительства: <u>{{dataPersonal.addressReg.name}}</u>
            </p>
          </td>
        </tr>
        </tbody>
      </table>

      <p>
        Контактная информация:
        телефон (основной) <u v-html="getValuePlaceholder(dataPersonal.phone, 19)">{{dataPersonal.phone}}</u>
        телефон (дополнительный) <u v-html="getValuePlaceholder(dataPersonal.phone2, 19)">{{dataPersonal.phone2}}</u>
      </p>

      <p>
        e-mail <u v-html="getValuePlaceholder(dataPersonal.email, 19)">{{dataPersonal.email}}</u>
        адрес фактического проживания <u>{{dataPersonal.addressEqual ? dataPersonal.addressReg.name : dataPersonal.addressLive.name}}</u>
      </p>


      <h5 align="center" style="margin-bottom: 20px;">
        ЗАЯВЛЕНИЕ
      </h5>

      <p class="dense">
        Прошу допустить меня к участию во вступительных испытаниях, проводимых
        вузом самостоятельно, на следующее направление подготовки аспирантуры:
      </p>

      <p>

        направление:

        <u v-if="compApplication" style="font-weight: bold">
          {{compApplication.eduProgram.direct_name}}
        </u>
&nbsp;
        <em>(код и наименование направления подготовки)</em>

      </p>

      <p>

        направленность:

        <u v-if="compApplication">
{{compApplication.eduProgram.spec_name}}
        </u>
        &nbsp;
      </p>

      <p v-if="compApplication">
        Аспирантская группа <u>{{compApplication.eduProgram.abbr}}</u> &nbsp;&nbsp;&nbsp;(аббревиатуры группы)
      </p>


      <p>
        по
        <strong>очной</strong> &nbsp;<el-tpl-checkbox :value="compApplication.eduProgram.eduFormData.nid==1"/>,&nbsp;
        <strong>заочной</strong> &nbsp;<el-tpl-checkbox :value="compApplication.eduProgram.eduFormData.nid==2"/>
        форме обучения
      </p>

      <p>
        на места, в рамках контрольных цифр приема за счет бюджетных ассигнований федерального бюджета
        <el-tpl-checkbox :value="appsOsnovaKeys.budget"/>,
      </p>

      <p>
        на места по договорам об оказании платных образовательных услуг
        <el-tpl-checkbox :value="appsOsnovaKeys.commerce"/>
      </p>

      <p>
        <strong>О себе сообщаю следующее:</strong>
        <strong></strong>
      </p>

      <p class="dense">
        Окончил(а) в <u>{{dataEducation.doc.date ? dataEducation.doc.date.split('.')[2] : ''}}</u> году;
      </p>

      <p class="dense">
        образовательное учреждение высшего образования
      </p>

      <p align="center" class="dense">
        <u>{{dataEducation.doc.organization}}</u>
      </p>

      <p align="center">
          <em>
            (наименование учебного заведения, специальность по диплому)
          </em>
      </p>

      <p>
        <strong>Диплом:</strong>
        Серия  <u>{{dataEducation.doc.serial}}</u>
        № <u>{{dataEducation.doc.number}}</u>
        Дата выдачи  <u>{{dataEducation.doc.date}}</u> г.
      </p>

      <p>
        <strong>Диплом «с отличием»</strong> &nbsp;<el-tpl-checkbox :value="false"/>
      </p>

      <p>
        ИНН <u v-html="getValuePlaceholder(dataPersonal.inn, 20)"></u>
        &nbsp;&nbsp;СНИЛС <u v-html="getValuePlaceholder(dataPersonal.snils, 20)"></u>
      </p>

      <p class="dense">
        Иностранный язык:
        английский <el-tpl-checkbox :value="compLanguagesByNid[1]"/>,&nbsp;
        немецкий <el-tpl-checkbox :value="compLanguagesByNid[2]"/>,&nbsp;
        французский <el-tpl-checkbox :value="compLanguagesByNid[3]"/>,&nbsp;
        другой <el-tpl-checkbox :value="compLanguagesByNid[10]"/> &nbsp;<u v-html="getValuePlaceholder(dataPersonal.languageCustom, 12)"></u>,&nbsp;&nbsp;
        не изучал(а) <el-tpl-checkbox :value="compLanguagesByNid[0]"/>.
      </p>

      <p>
        При поступлении необходимо создать специальные условия проведения
        вступительных испытаний в связи с моими ограниченными возможностями
        здоровья (инвалидностью):
        <strong>да</strong>  &nbsp;<el-tpl-checkbox :value="dataEntrance.specialNeeds"/> &nbsp;
        <strong>нет</strong>  &nbsp;<el-tpl-checkbox :value="!dataEntrance.specialNeeds"/>
      </p>

      <p>
        Документ, подтверждающий необходимость создания специальных условий
        проведения вступительных испытаний
        <u v-html="getValuePlaceholder(dataEntrance.specialNeeds, 40)"></u>
      </p>

      <p class="dense">
        Общежитие:
        нуждаюсь&nbsp;<el-tpl-checkbox :value="dataPersonal.needFlat"/> &nbsp;
        не нуждаюсь&nbsp;<el-tpl-checkbox :value="!dataPersonal.needFlat"/>
      </p>

      <p align="center">
        <strong>
          Учет индивидуальных достижений поступающих при приеме на обучение
          на направления подготовки научно-педагогических кадров в
          аспирантуре
        </strong>
      </p>

      <table border="1" cellspacing="0" cellpadding="0" width="728">
        <tbody>
        <tr>
          <td width="47">
            <p align="center">
              <strong>№</strong>
            </p>
            <p align="center">
              <strong>п/п</strong>
            </p>
          </td>
          <td width="406">
            <p align="center">
              <strong>
                Наименование индивидуального достижения
              </strong>
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              <strong>Подтверждающие документы</strong>
            </p>
          </td>
          <td width="113">
            <p align="center">
              <strong>Количество баллов</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td width="47">
            <p align="center">
              1.
            </p>
          </td>
          <td width="406">
            <p>
              Наличие статуса медалиста, победителя и призера
              студенческой олимпиады «Я - профессионал», при условии
              соответствия профиля олимпиады выбранному направлению
              подготовки аспирантуры<strong></strong>
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p>

            </p>
          </td>
        </tr>
        <tr>
          <td width="47">
            <p align="center">
              2.
            </p>
          </td>
          <td width="406">
            <p>
              Наличие статуса победителя финала национального
              межвузовского чемпионата «Молодые профессионалы»
              (WorldSkills Russia)
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p align="center">

            </p>
          </td>
        </tr>
        <tr>
          <td width="47">
            <p align="center">
              3.
            </p>
          </td>
          <td width="406">
            <p>
              Наличие статуса призера финала национального
              межвузовского чемпионата «Молодые профессионалы»
              (WorldSkills Russia)
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p align="center">

            </p>
          </td>
        </tr>
        <tr>
          <td width="47">
            <p align="center">
              4.
            </p>
          </td>
          <td width="406">
            <p>
              Наличие статуса победителя, призера вузовских
              чемпионатов или региональных чемпионатов по стандартам
              WorldSkills
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p align="center">

            </p>
          </td>
        </tr>
        <tr>
          <td width="47">
            <p align="center">
              5.
            </p>
          </td>
          <td width="406">
            <p>
              Наличие статуса победителя, призера, международной
              олимпиады при условии соответствия профиля олимпиады
              выбранному направлению подготовки аспирантуры
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113">
            <p align="center">

            </p>
          </td>
        </tr>
        <tr>
          <td width="47" valign="top">
            <p align="center">
              6.
            </p>
          </td>
          <td width="406" valign="top">
            <p>
              Наличие статуса победителя, призера всероссийской
              олимпиады при условии соответствия профиля олимпиады
              выбранному направлению подготовки аспирантуры
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p align="center">

            </p>
          </td>
        </tr>
        <tr>
          <td width="47" valign="top">
            <p align="center">
              7.
            </p>
          </td>
          <td width="406" valign="top">
            <p>
              Наличие статуса победителя, призера, региональной
              (областной) олимпиады при условии соответствия профиля
              олимпиады выбранному направлению подготовки аспирантуры
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p align="center">

            </p>
          </td>
        </tr>
        <tr>
          <td width="47" valign="top">
            <p align="center">
              8.
            </p>
          </td>
          <td width="406" valign="top">
            <p>
              Наличие статуса победителя, призера, олимпиады
              проводимой ИРНИТУ при условии соответствия профиля
              олимпиады выбранному направлению подготовки аспирантуры
            </p>
          </td>
          <td width="161" valign="top">
            <p align="center">
              Скан - копия диплома
            </p>
          </td>
          <td width="113" valign="top">
            <p align="center">

            </p>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <br clear="all"/>
    <table border="1" cellspacing="0" cellpadding="0" width="728">
      <tbody>
      <tr>
        <td width="47">
          <p align="center">
            9.
          </p>
        </td>
        <td width="406" valign="top">
          <p>
            Участие в международной конференции по профильным для
            направления подготовки конференциям
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия программы конференции, сертификат, диплом
            участника
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            10.
          </p>
        </td>
        <td width="406" valign="top">
          <p>
            Участие во всероссийской конференции по профильным для
            направления подготовки конференциям
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия программы конференции, сертификат, диплом
            участника
          </p>
        </td>
        <td width="113" valign="top">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            11.
          </p>
        </td>
        <td width="406" valign="top">
          <p>
            Участие в региональной (областной) конференции по
            профильным для направления подготовки конференциям
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия программы конференции, сертификат, диплом
            участника
          </p>
        </td>
        <td width="113" valign="top">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            12.
          </p>
        </td>
        <td width="406">
          <p>
            Наличие именных стипендий при обучении на специалитете или
            в магистратуре (в независимости от количества)
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия диплома/приказа/сертификата
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            13.
          </p>
        </td>
        <td width="406">
          <p>
            Наличие диплома о высшем образовании (магистратура,
            специалитет) с отличием
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия / оригинал диплома
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            14.
          </p>
        </td>
        <td width="406">
          <p>
            Участие в научно-исследовательских работах, научных
            грантах, проектах (гос. задание), хоз. договорах по
            направлению подготовки
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия научно-технического отчета (титульный лист,
            лист исполнителей)
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            15.
          </p>
        </td>
        <td width="406">
          <p>
            Участие в научных конкурсах, семинарах по направлению
            подготовки (в независимости от количества)
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия сертификата, диплома, грамоты
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            16.
          </p>
        </td>
        <td width="406">
          <p>
            Количество российских и зарубежных патентов (положительных
            решений о выдачи), свидетельств на полезную модель,
            свидетельств на изобретение, свидетельств на программу ЭВМ
            по тематике, соответствующей направлению подготовки
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия подтверждающего документа
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47">
          <p align="center">
            17.
          </p>
        </td>
        <td width="680" colspan="3" valign="top">
          <p>
            Наличие документов, подтверждающих факт опубликования
            издания и статьи, в т.ч. в соавторстве с учетом статуса
            издания:
          </p>
        </td>
      </tr>
      <tr>
        <td width="47" valign="top">
          <p align="center">
            17.1
          </p>
        </td>
        <td width="406">
          <p>
            статьи в зарубежных изданиях, входящих в международные
            системы цитирования Web of Science или Scopus, в т.ч. в
            соавторстве по направлению подготовки
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            наличие сканированных документов, подтверждающих вхождение
            издания в базы данных Web of Science, Scopus, копия
            выходных данных статьи
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47" valign="top">
          <p align="center">
            17.2
          </p>
        </td>
        <td width="406">
          <p>
            статьи в рецензируемых журналах ВАК, в т.ч. в соавторстве
            по направлению подготовки
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            наличие сканированных документов, подтверждающих вхождение
            издания в перечень ВАК, копия титульного листа журнала,
            оглавления, копия статьи
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47" valign="top">
          <p align="center">
            17.3
          </p>
        </td>
        <td width="406">
          <p>
            издания (учебные пособия, монографии), в т.ч. в соавторстве
            (в независимости от количества)
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия титульного листа, оглавления
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      <tr>
        <td width="47" valign="top">
          <p align="center">
            17.4
          </p>
        </td>
        <td width="406">
          <p>
            статьи в прочих издания, в вузовских сборниках, в
            материалах конференций (без соавторов) по направлению
            подготовки
          </p>
        </td>
        <td width="161" valign="top">
          <p align="center">
            Скан - копия титульного листа сборника, оглавления
            сборника, копия 1 страницы статьи
          </p>
        </td>
        <td width="113">
          <p align="center">

          </p>
        </td>
      </tr>
      </tbody>
    </table>
    <p>
      * Количество баллов, начисленных за все индивидуальные достижения, не может
      составлять более 20 баллов суммарно.
    </p>

    <p>
      <strong>О себе дополнительно сообщаю:</strong>
      <strong></strong>
    </p>

    <p>
      Высшее образование по программам подготовки научно-педагогических
      кадров в аспирантуре получаю впервые <el-tpl-checkbox :value="false"/>, не впервые <el-tpl-checkbox :value="false"/> &nbsp;
    </p>
    <div class="quote offset-top-minus">
      <div class="line">&nbsp;</div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>
<br>

    <p>
      С копией лицензии на осуществление образовательной деятельности, копией
      свидетельства о государственной аккредитации и приложением к ним по
      выбранному направлению подготовки (специальности), Уставом ИРНИТУ,
      правилами приема, правилами подачи апелляций, расписанием вступительных
      испытаний <strong>ознакомлен (а) </strong>"____"_______________________2020
      г. ______________
    </p>

    <div class="quote offset-top-minus">
      <div class="line">&nbsp;</div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p>
      Об ответственности за достоверность сведений, указанных в заявлении о
      приеме, за подлинность подаваемых документов    <strong>предупрежден(а)</strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line">&nbsp;</div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p>
      На обработку, использование, распространение (в том числе передачу,
      обезличивание, блокирование, уничтожение) моих персональных данных,
      содержащихся в настоящем заявлении и прилагаемых к нему документов с целью
      учета поступающих на обучение в соответствии с законом №152-ФЗ от
      27.07.2006г. «О персональных данных», с Положением о персональных данных
      абитуриентов и обучающихся ФГБОУ ВО ИРНИТУ    <strong>согласен(а)</strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line">&nbsp;</div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p>
      На рассылку новостей и информации ФГБОУ ВО ИРНИТУ на эл. почту и на телефон
      согласен (а)
    </p>
    <div class="quote offset-top-minus">
      <div class="line">&nbsp;</div>
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
