<template>

  <div class="print-tpl">

    <div style="float: left;">
      № {{ vars.order.nid }}
    </div>

    <p align="right">
      Регистрационный номер ___________
    </p>

    <p>
      <strong>
        РЕКТОРУ ИРКУТСКОГО НАЦИОНАЛЬНОГО ИССЛЕДОВАТЕЛЬСКОГО ТЕХНИЧЕСКОГО УНИВЕРСИТЕТА
      </strong>
    </p>

    <p align="right">
      Россия, 664074, Иркутская область, г. Иркутск, ул. Лермонтова, 83
    </p>

    <p>
      От гр: (заполняется печатными буквами)
    </p>

    <table border="1" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tbody>
      <tr>
        <td width="341">
          <p>
            Фамилия <u>{{ dataPersonal.lastName }}</u>
          </p>
        </td>
        <td width="341">
          <p>
            Гражданство <u>{{ compCitizenship }}</u>
          </p>
        </td>
      </tr>
      <tr>
        <td width="341">
          <p>
            Имя <u>{{ dataPersonal.firstName }}</u>
          </p>
        </td>
        <td rowspan="2" width="341">
          <p class="dense">
            Документ, удостоверяющий личность
          </p>
          <span>Серия</span>&nbsp; <u>{{ docPassport ? docPassport.docSeries : ''}}</u>&nbsp;
          <span>№</span>&nbsp; <u>{{ docPassport ? docPassport.docNumber : '' }}</u><br>
          <span>Код подразделения</span>&nbsp; <u>{{ docPassport && docPassport.fields['SubdivisionCode'] }}</u>
        </td>
      </tr>
      <tr>
        <td width="341">
          <p>
            Отчество <u>{{ dataPersonal.secondName }}</u>
          </p>
        </td>
      </tr>
      <tr>
        <td width="341">
          <p>
            Дата рождения <u>{{ dataPersonal.birthday }}</u>
          </p>
        </td>
        <td valign="top" width="341">
          <p>
            Когда выдан: <u>{{ docPassport && docPassport.issueDate }}</u>
          </p>
        </td>
      </tr>
      <tr>
        <td width="341">
          <p>
            Место рождения <u>{{ dataPersonal.birthplace }}</u>
          </p>
        </td>
        <td rowspan="2" valign="top" width="341">
          <p>
            Кем выдан: <u>{{ docPassport && docPassport.docOrg }}</u>
          </p>
        </td>
      </tr>
      <tr>
        <td width="341">
          <p>
            Пол <u>{{ dataPersonal.gender == 'male' ? 'мужской' : 'женский' }}</u>
          </p>
        </td>
      </tr>
      </tbody>
    </table>

    <p>
      Проживающего (ей) по адресу:
      <u>{{ dataPersonal.addressReg.name }}</u>
    </p>

    <p>
      телефон <u>{{ dataPersonal.phone }}</u>,&nbsp; е-mail <u>{{ dataPersonal.email }}</u>
    </p>

    <h5 align="center" style="margin-bottom: 20px; margin-top: 10px;">
      ЗАЯВЛЕНИЕ
    </h5>

    <p class="dense">
      <strong>
        Прошу допустить меня к участию в конкурсе на следующую
        специальность:
      </strong>
    </p>

    <table border="1" cellpadding="3" cellspacing="0" style="margin-bottom: 10px;">
      <tbody>
      <tr>
        <td valign="top" width="188">
          <p align="center">
            <strong>Факультет</strong>
          </p>
        </td>
        <td valign="top" width="363">
          <p align="center">
            <strong>Специальность</strong>
          </p>
        </td>
        <td valign="top" width="127">
          <p align="center">
            <strong>Средний балл аттестата</strong>
          </p>
        </td>
      </tr>
      <tr v-if="compApplication">
        <td valign="top" width="188">
          <p>
            Среднего профессионального образования
          </p>
        </td>
        <td valign="top" width="363">
          {{ compApplication.competition.admission.direct_name }}
        </td>
        <td valign="top" width="127">
          {{ dataEntrance.schoolCertificateBall }}
        </td>
      </tr>
      </tbody>
    </table>

    <p class="dense">
      по очной
      <el-tpl-checkbox :value="false"/>
    </p>
    <p class="dense">
      на места, финансируемые из федерального бюджета
      <el-tpl-checkbox :value="appsOsnovaKeys.budget"/>
      ,
    </p>
    <p class="">
      на места с полным возмещением затрат
      <el-tpl-checkbox :value="appsOsnovaKeys.commerce"/>
    </p>

    <p class="dense">
      <el-tpl-checkbox :value="appsOsnovaKeys.target"/> &nbsp;<b><span>Заключен договор о целевом обучении</span></b>
    </p>

    <p class="">
      <span
          style="width: 100%;display: block;border-bottom: 1px solid #111111;">&nbsp;{{ appsOsnovaKeys.target && dataEntrance.targetOrganization }} {{ appsOsnovaKeys.target && dataEntrance.targetDogovor }}</span>
      <span style="font-size: 14px;">(полное наименование организации (муниципального образования), номер договора о целевом обучении)</span>
    </p>

    <p class="">
      <strong>О себе сообщаю следующее:</strong>
    </p>

    <p class="dense">
      Окончил(а) в <u>{{ docEdu && docEdu.issueDate ? docEdu.issueDate.split('.')[2] : '' }}</u> году
      общеобразовательное учреждение;
    </p>
    <p class="dense">
      образовательное учреждение начального профессионального образования
      <el-tpl-checkbox :value="false"/>
      ;
    </p>
    <p class="dense">
      образовательное учреждение среднего профессионального образования
      <el-tpl-checkbox :value="false"/>
      ;
      другое
      <el-tpl-checkbox :value="false"/>
    </p>

    <p class="dense" style="text-align: center">
      <span style="width: 100%;display: block;border-bottom: 1px solid #111111;">
        {{ docEdu ? docEdu.docOrg : '' }}
      </span>
      <span style="font-size: 14px;">(наименование учебного заведения)</span>
    </p>

    <p>
      Аттестат / диплом
      Серия <u v-html="getValuePlaceholder(docEdu ? docEdu.docSeries: '', 6)"></u>
      № <u v-html="getValuePlaceholder(docEdu ? docEdu.docNumber : '', 6)"></u>
    </p>

    <p class="dense">
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

    <p class="dense">
      Общежитие:
      нуждаюсь&nbsp;<el-tpl-checkbox :value="dataPersonal.needFlat"/> &nbsp;
      не нуждаюсь&nbsp;<el-tpl-checkbox :value="!dataPersonal.needFlat"/>
    </p>

    <p class="dense">
      Дополнительно сообщаю:
    </p>


    <div class="dense" style="">
      <div style="width:100%;border-bottom: 1px solid #111;display: block;">Отец:
        <span v-if="compFamilyByNid[2]">
         {{
            [
              compFamilyByNid[2].fio,
              compFamilyByNid[2].address,
              compFamilyByNid[2].phone,
              compFamilyByNid[2].email,
              compFamilyByNid[2].work,
            ].filter(item => item).join((', '))
          }}
       </span>
      </div>
      <div style="font-size: 14px; text-align: center">(фамилия, имя, отчество, место жительства, телефон, e-mail, кем и
        где работает)
      </div>
    </div>

    <div class="" style="margin-bottom: 20px;">
      <div style="width:100%;border-bottom: 1px solid #111;display: block;">Мать:
        <span v-if="compFamilyByNid[1]">
         {{
            [
              compFamilyByNid[1].fio,
              compFamilyByNid[1].address,
              compFamilyByNid[1].phone,
              compFamilyByNid[1].email,
              compFamilyByNid[1].work,
            ].filter(item => item).join((', '))
          }}
       </span>
      </div>
      <div style="font-size: 14px; text-align: center">(фамилия, имя, отчество, место жительства, телефон, e-mail, кем и
        где работает)
      </div>
    </div>

    <p>
      В случае непоступления на обучение прошу вернуть представленный оригинал
      документ об образовании следующим способом:
      лично
      <el-tpl-checkbox :value="false"/>
      ;
      доверенному лицу
      <el-tpl-checkbox :value="false"/>
      ;
      через оператора почтовой связи общего пользования
      <el-tpl-checkbox :value="false"/>
      .
    </p>

    <div>
      <p>
        Среднее профессиональное образование получаю:
        впервые
        <el-tpl-checkbox :value="false"/>
        ,
        не впервые
        <el-tpl-checkbox :value="false"/>
      </p>
    </div>

    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <br clear="all"/>
    <p>
      С копией лицензии на осуществление образовательной деятельности, копией
      свидетельства о государственной аккредитации и приложением к ним по
      выбранной специальности, Уставом ИРНИТУ, правилами приема, Постановлением
      Правительства №697 от 14 августа 2013г., информацией о преимуществах при
      приеме на обучение ознакомлен(а)
    </p>
    <p>
      "____"__________________________2023 г.
      &nbsp; &nbsp; &nbsp; &nbsp; Подпись______________________________
    </p>


    <p style="clear: both">
      На рассылку новостей и информации ФГБОУ ВО ИРНИТУ на эл. почту и на телефон согласен(а)
    </p>
    <div class="quote ">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p style="clear: both">
      С датой завершения приема
      уведомления о намерении обучаться
      ознакомлен
    </p>
    <div class="quote ">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <p style="clear:both;">
      Об ответственности за достоверность сведений, указанных в заявлении о
      приеме, за подлинность подаваемых документов <strong>предупрежден(а) </strong>
    </p>
    <div class="quote offset-top-minus">
      <div class="line"></div>
      <div class="label">
        (подпись абитуриента)
      </div>
    </div>

    <div style="clear: both"></div>

    <table style="margin-top: 40px; margin-bottom: 40px;">
      <tr>
        <td>
          « ___ » ______________ 2023 г.
        </td>
        <td>
          <div class="quote ">
            <div class="line"></div>
            <div class="label">
              (подпись абитуриента)
            </div>
          </div>
        </td>
      </tr>
    </table>

    <table style="margin-top: 40px; margin-bottom: 20px;">
      <tr>
        <td valign="top">
          Подпись ответственного лица приемной комиссии факультета
        </td>
        <td align="center">

          <div style="border-bottom: 1px solid #111;margin-bottom: 5px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          подпись
        </td>
        <td align="center">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <div style="border-bottom: 1px solid #111;margin-bottom: 5px;"></div>
          расшифровка подписи
        </td>
      </tr>
    </table>

  </div>

</template>

<script>
import Base from './_base-order'

export default {
  extends: Base,
  computed: {

  }
}
</script>


<style lang="scss" scoped>


</style>
