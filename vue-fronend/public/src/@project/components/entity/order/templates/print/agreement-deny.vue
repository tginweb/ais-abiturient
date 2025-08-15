<template>

  <div class="print-tpl">

    <p align="right">
      Ректору ФГБОУ ВО «ИРНИТУ»
    </p>
    <p align="right">
      Корнякову М.В
    </p>
    <p align="right" class="dense">
      от <u>{{dataPersonal.lastName}} {{dataPersonal.firstName}} {{dataPersonal.secondName}}</u>
    </p>
    <p align="right" class="dense">
      (фамилия, имя, отчество абитуриента)
    </p>
    <p>
      <strong><em></em></strong>
    </p>
    <p align="center">
      <strong>Заявление</strong>
    </p>
    <p align="center">
      Прошу отозвать мое согласие на зачисление, поданное
    </p>
    <p>
      на направление <u>{{ vars.app.admission.abbr }} {{ vars.app.admission.direct_name }}, {{ vars.app.admission.fob.name }}</u>
    </p>
    <div style="margin: 0 0 0 30px">

      <p>
        <el-tpl-checkbox :value="appsOsnovaKey=='budget'"></el-tpl-checkbox> общие основания;
      </p>
      <p>
        <el-tpl-checkbox :value="appsOsnovaKey=='quota'"></el-tpl-checkbox> особые права;
      </p>
      <p>
        <el-tpl-checkbox :value="appsOsnovaKey=='target'"></el-tpl-checkbox> целевой прием.
      </p>
      <p>
        <el-tpl-checkbox :value="false"></el-tpl-checkbox> без вступительных испытаний.
      </p>
    </div>


    <p align="right">
      Дата
    </p>
    <p align="right">
      ____________________
    </p>
    <p align="right">
      Подпись
    </p>
    <p align="right">
      ____________________
    </p>
    <p align="center">
      <strong><u></u></strong>
    </p>

  </div>

</template>

<script>
  import Base from './_base-order'

  export default {
    extends: Base,
    props: {
      vars: {}
    },
    methods: {
    },
    computed: {
      appsOsnovaKey() {
        switch (this.vars.app.csource) {
          case 1:
            return 'budget';
          case 2:
            return 'quota';
          case 3:
            return 'commerce';
          case 4:
            return 'target';
        }
      },
    }
  }
</script>


<style lang="sass" scoped>


</style>
