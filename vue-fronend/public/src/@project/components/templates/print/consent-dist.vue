<template>

  <div class="print-tpl">



    <p align="center" style="font-weight: bold">
      СОГЛАСИЕ
      абитуриента и обучающегося
      на распространение персональных данных
    </p>

    <div>
      Я,
      <u v-html="getValuePlaceholder([majorPerson.lastName, majorPerson.firstName, majorPerson.secondName], 80)">
      </u>
    </div>
    <div>
      <p align="center">
        (Ф.И.О.)
      </p>
    </div>
    <div>
      зарегистрированный(ая) по адресу
    </div>
    <div>
      <u v-html="getValuePlaceholder(majorPerson.addressReg.name, 100)">
      </u>
    </div>

    <p>
      паспорт серия <u v-html="getValuePlaceholder(docPassport && docPassport.docSeries, 6)"></u>
      № <u v-html="getValuePlaceholder(docPassport && docPassport.docNumber, 7)"></u>
      дата выдачи <u v-html="getValuePlaceholder(docPassport && docPassport.issueDate, 10)"></u>
      кем выдан
    </p>

    <div>
      <u v-html="getValuePlaceholder(docPassport && docPassport.docOrg, 130)"></u>
    </div>
    <p style="text-align: center">
      (наименование органа, выдавшего документ)
    </p>

    <p>
      адрес электронной почты или почтовый адрес <u v-html="getValuePlaceholder(majorPerson.email, 50)"></u>
    </p>
    <p>
      телефон <u v-html="getValuePlaceholder(majorPerson.phone, 15)"></u>
    </p>


    <p>
      именуемый в дальнейшем Субъект, во исполнение требований Федерального закона «О персональных данных» № 152-ФЗ от 27.07.2006 г. даю добровольное согласие Федеральному государственному бюджетному образовательному учреждению высшего образования «Иркутский национальный исследовательский технический университет» (ФГБОУ ВО «ИРНИТУ»), зарегистрированному по адресу: 664074, г. Иркутск, ул. Лермонтова, д.83, на распространение следующих персональных данных своих/своего подопечного(ой)
    </p>

    <div>
      <u v-html="getValuePlaceholder([minorPerson.lastName, minorPerson.firstName, minorPerson.secondName], 100)"></u>
    </div>
    <div style="text-align: center">
      (Ф.И.О. подопечного(ой))
    </div>

    <div>
      зарегистрированного(ой) по адресу
    </div>

    <p>
      <u v-html="getValuePlaceholder('', 130)"></u>
    </p>

    <div>
      паспорт серия <u v-html="getValuePlaceholder(minorPerson.doc.serial, 6)"></u>
      № <u v-html="getValuePlaceholder(minorPerson.doc.number, 7)"></u>
      дата выдачи <u v-html="getValuePlaceholder(minorPerson.doc.date, 10)"></u>
      кем выдан
    </div>

    <div>
      <u v-html="getValuePlaceholder(minorPerson.doc.organization, 130)"></u>
    </div>
    <p style="text-align: center">
      (наименование органа, выдавшего документ)
    </p>

    <table border="1" cellspacing="0" cellpadding="0" width="100%">
      <tbody>
      <tr>
        <td width="26%">
          <p align="center">
            <strong>Категории персональных данных</strong>
          </p>
        </td>
        <td width="48%">
          <p align="center">
            <strong>Перечень персональных данных</strong>
          </p>
        </td>
        <td width="25%">
          <p align="center">
            <strong>Согласие субъекта персональных данных</strong>
          </p>
          <p align="center">
            (нужное подчеркнуть)
          </p>
        </td>
      </tr>
      <tr>
        <td width="26%" rowspan="7">
          <p align="center">
            Общие персональные данные
          </p>
        </td>
        <td width="48%">
          <p align="center">
            Фамилия, имя, отчество
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="48%">
          <p align="center">
            Факультет/институт
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="48%">
          <p align="center">
            Кафедра
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="48%">
          <p align="center">
            Группа
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="48%">
          <p align="center">
            Сведения об ученых степенях и званиях
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="48%">
          <p align="center">
            Сведения о результатах вступительных испытаний
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="48%">
          <p align="center">
            Данные о персональных достижениях в учебной,
            научно-исследовательской, спортивной, общественной,
            культурно-творческой деятельности полученных в университете
            или от имени университета
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      <tr>
        <td width="26%">
          <p align="center">
            Биометрические персональные данные
          </p>
        </td>
        <td width="48%">
          <p align="center">
            Цифровая фотография
          </p>
        </td>
        <td width="25%">
          <p align="center">
            согласен / не согласен
          </p>
        </td>
      </tr>
      </tbody>
    </table>
    <p>
      Условия и запреты для персональных данных допустимых к распространению
      субъектом персональных данных:
    </p>
    <p>
      <u> </u>
    </p>
    <p>
      <u> </u>
    </p>
    <p>
      <u> </u>
    </p>
    <p>
      <u> </u>
    </p>
    <p>
      Субъект соглашается на распространение выбранных персональных данных от
      лица ФГБОУ ВО «ИРНИТУ» на период обучения в ФГБОУ ВО «ИРНИТУ», а также
      после прекращения обучения до момента отзыва настоящего согласия.
    </p>
    <p>
      Осуществляться предоставление доступа к персональным данным субъекта будет
      посредством информационных стендов, расположенных в зданиях ФГБОУ ВО
      «ИРНИТУ», газеты «Зеркало. ИРНИТУ», на официальных сайтах университета,
      включая istu.edu, а также в социальных сетях на страницах ФГБОУ ВО
      «ИРНИТУ».
    </p>

    <table align="right" border="0" cellpadding="0" cellspacing="0">
      <tbody>

      <tr>
        <td>
          <p>
            «___» ____________ 2023 г.
          </p>
        </td>
        <td valign="top" width="198">
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
      </tbody>
    </table>


  </div>

</template>


<script>
import MPrintable from '@project/mixin/printable'

export default {
  mixins: [MPrintable],
  computed: {
  }
}
</script>


<style lang="sass" scoped>


</style>
