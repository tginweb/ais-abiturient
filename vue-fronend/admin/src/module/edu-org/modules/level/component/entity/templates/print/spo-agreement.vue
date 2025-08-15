<template>

  <div class="print-tpl">

    <p>
      Ректору ФГБОУ ВО «ИРНИТУ»
    </p>
    <p>
      М.В. Корнякову
    </p>
    <p>
      от абитуриента
    </p>
    <p>
      <u>{{dataPersonal.lastName}} {{dataPersonal.firstName}} {{dataPersonal.secondName}}</u>
    </p>
    <p>
      (фамилия, имя, отчество абитуриента)
    </p>
    <p align="center">
      <strong>Уведомление о намерении обучаться</strong>
    </p>
    <p>
      Я,  <u>{{dataPersonal.lastName}} {{dataPersonal.firstName}} {{dataPersonal.secondName}}</u>,

      паспортные данные:
      серия <u>{{dataPersonal.doc.serial}}</u>,
      № <u>{{dataPersonal.doc.number}}</u>,
      кем выдан <u>{{dataPersonal.doc.organization}}</u>,
      когда выдан <u>{{dataPersonal.doc.date}}</u>,

      согласно п. 4.4 Правил приема в федеральное
      государственное бюджетное образовательное учреждение высшего образования
      «Иркутский национальный исследовательский технический университет» на
      обучение по образовательным программам среднего профессионального
      образования на 2020/21 учебный год. намереваюсь обучаться по
      специальности

      <u>{{vars.app.eduProgram.abbr}} {{vars.app.eduProgram.direct_name}}, {{vars.app.eduProgram.eduFormData.name}}</u>
    </p>
    <p>
      <strong>Условия поступления:</strong>
    </p>
    <p>
      <strong> </strong>
    </p>
    <p>
      <el-tpl-checkbox :value="appsOsnovaKeys.budget"/> общий конкур на места за счет бюджетных ассигнований федерального бюджета    <strong> </strong>в рамках контрольных цифр приема;
    </p>
    <p>
      <el-tpl-checkbox :value="appsOsnovaKeys.commerce"/> на места по договорам об оказании платных образовательных услуг.
    </p>
    <p>
      «____» ___________ 2020 г. ___________ ___________________
    </p>
    <p>
      (подпись) (ФИО)
    </p>
    <p>
      <strong> </strong>
    </p>
    <p>
      <strong> </strong>
    </p>
    <p>
      <strong>Обязуюсь в течении первого учебного года</strong>
      :
    </p>
    <p>
      - Представить в университет оригинал документа, об образовании,
      необходимого для зачисления;
    </p>
    <p>
      - пройти обязательные предварительные медицинские осмотры (обследования)
      при обучении по специальностям и направлениям подготовки согласно п. 4.4
      Правил приема в федеральное государственное бюджетное образовательное
      учреждение высшего образования «Иркутский национальный исследовательский
      технический университет» на обучение по образовательным программам среднего
      профессионального образования на 2020/21 учебный год
    </p>
    <p>
      <strong>Подтверждаю</strong>
      что мною не подано (не будет подано) уведомление о намерении обучаться на
      специальности среднего профессионального образования данного уровня на
      места в рамках КЦП в другие организации.
    </p>
    <p>
      «____» ___________ 2020 г. ___________ ___________________
    </p>
    <p>
      (подпись) (ФИО)
    </p>
  </div>

</template>

<script>
  import Base from './_base-order'

  export default {
    extends: Base,
    computed: {
      compQuotaDocs() {
        return this.vars.order.anket.fields.benefits.quotes.map((item) => {

          let parts = [], docParts = [];

          if (item.quotaType) parts.push('категория ' + this.getTermByNid('abit.eduQuota', item.quotaType, 'name'))

          if (item.haveDoc) {
            if (item.doc.serial) docParts.push('серия ' + item.doc.serial)
            if (item.doc.number) docParts.push('номер ' + item.doc.number)
            if (item.doc.organization) docParts.push('выдан ' + item.doc.organization)
            if (item.doc.date) docParts.push(item.doc.date);

            parts.push('документ: ' + docParts.join(', '));
          }

          return parts.join(', ')
        }).join(', ')
      }
    }
  }
</script>


<style lang="scss" scoped>


</style>
