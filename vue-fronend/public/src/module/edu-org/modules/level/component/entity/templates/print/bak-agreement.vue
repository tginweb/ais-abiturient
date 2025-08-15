<template>

  <div class="print-tpl">


    <p class="dense">
      Ректору ФГБОУ ВО «ИРНИТУ»
    </p>
    <p class="dense">
      М.В. Корнякову
    </p>
    <p class="dense">
      от абитуриента
    </p>
    <p class="dense">
      <u>{{dataPersonal.lastName}} {{dataPersonal.firstName}} {{dataPersonal.secondName}}</u>
    </p>
    <p class="dense">
      (фамилия, имя, отчество абитуриента)
    </p>
    <p align="center">
      <strong>Согласие на зачисление</strong>
    </p>
    <p>
      Я, <u>{{dataPersonal.lastName}} {{dataPersonal.firstName}} {{dataPersonal.secondName}}</u>,
      паспортные данные: серия <u>{{dataPersonal.doc.serial}}</u>, № <u>{{dataPersonal.doc.number}}</u>, кем выдан
      <u>{{dataPersonal.doc.organization}}</u>,
      когда выдан <u>{{dataPersonal.doc.date}}</u>, согласно п. 98 Правил приема в федеральное
      государственное бюджетное образовательное учреждение высшего образования
      «Иркутский национальный исследовательский технический университет» на
      обучение по образовательным программам высшего образования - программам
      бакалавриата, специалитета на 2020/21 учебный год или п.69 Правил приема в
      федеральное государственное бюджетное образовательное учреждение высшего
      образования «Иркутский национальный исследовательский технический
      университет» на обучение по образовательным программам высшего образования
      - программам магистратуры на 2020/21 учебный год, даю согласие на
      зачисление по направлению подготовки:
    </p>
    <p>
      <u>{{vars.app.eduProgram.abbr}} {{vars.app.eduProgram.direct_name}}, {{vars.app.eduProgram.eduFormData.name}}</u>
    </p>
    <p>
      <el-tpl-checkbox :value="appOsnovaFullkey=='budget' || appOsnovaFullkey=='target' || appOsnovaFullkey=='quota'"></el-tpl-checkbox>

      за счет бюджетных ассигнований федерального бюджета<strong> </strong>в
      рамках контрольных цифр приема    <strong> по одному из следующих условий поступления:</strong>
    </p>

    <div style="margin: 0 0 0 30px">

      <p>
        <el-tpl-checkbox :value="appOsnovaFullkey=='budget'"></el-tpl-checkbox> общий конкурс;
      </p>
      <p>
        <el-tpl-checkbox :value="appOsnovaFullkey=='preimush'"></el-tpl-checkbox> особые права (олимпиада);
      </p>
      <p>
        <el-tpl-checkbox :value="appOsnovaFullkey=='quota'"></el-tpl-checkbox> в пределах квоты для лиц с особыми правами;
      </p>
      <p>
        <el-tpl-checkbox :value="appOsnovaFullkey=='target'"></el-tpl-checkbox> целевой прием.
      </p>

    </div>

    <p>
      <el-tpl-checkbox :value="appOsnovaFullkey=='commerce'"></el-tpl-checkbox>
      за счет средств физических и (или) юридических лиц (по договорам об
      оказании платных образовательных услуг).
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
    <ul>
      <li>
        представить в университет оригинал документа об образовании,
        необходимого для зачисления;
      </li>
      <li>
        пройти обязательные предварительные медицинские осмотры (обследования)
        при обучении по специальностям и направлениям подготовки согласно п. 49
        Правил приёма на направления бакалавриата и специалитета или п.33
        Правил приёма на направления магистратуры.
      </li>
    </ul>
    <p>
      <strong>Подтверждаю,</strong>
      что мною не подано (не будет подано) заявление о согласии на зачисление на
      обучение на направления высшего образования данного уровня на места в
      рамках контрольных цифр приема в другие организации.
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

  export default {
    props: {
      vars: {}
    },
    components: {},
    created() {
      console.log('AAAA')
    },
    methods: {

      getValuePlaceholder(str, chars = 10) {
        return str || '&nbsp;'.repeat(chars)
      }
    },
    computed: {

      appOsnovaFullkey() {
        return this.$store.getters['abit/orderAppGetOsnovaFullkey'](this.vars.app)
      },

      dataPersonal() {
        return this.vars.order.anket.fields.personal
      },

      dataEducation() {
        return this.vars.order.anket.fields.education
      },

      dataEntrance() {
        return this.vars.order.anket.fields.entrance
      },

      dataApplications() {
        return this.vars.order.applications.fields.applications
      }
    }
  }
</script>


<style lang="sass" scoped>


</style>
