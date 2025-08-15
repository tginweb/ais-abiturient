<template>

  <div class="com " v-if="order">

    <div class="c-block-header q-mb-md q-px-md q-py-sm q-pb-none">Ваше заявление:</div>

    <div class="q-mx-md ">

      <div class="q-mb-sm s-font-sm">
        {{order.orderType && order.orderType.name}}
      </div>

      <router-link
        class="text-center q-pa-xs"
        to="/cab/order/view" style="color: #fff;display: block;font-size: 15px;text-decoration: none;"
        v-bind="bindStatus"
      >
        {{order.state.statusInfo && order.state.statusInfo.titleClient}}
      </router-link>

    </div>

    <q-list class="c-menu q-mt-sm q-py-none text-grey-8 " padding>
      <q-item
        clickable
        dark
        v-ripple
        to="/cab/order/view"
        class="__item"
      >
        <q-item-section class="" style="text-decoration: underline;">просмотр заявления</q-item-section>
      </q-item>

    </q-list>

    <template v-if="order.stepsInfo.length>0">

      <div class="c-block-header q-mt-md q-px-md q-py-sm q-pb-none">Шаги заполнения:</div>

      <q-stepper
        animated
        class="c-steps q-py-none"
        color="white"
        dark
        flat
        header-nav
        v-model="step"
        vertical
      >
        <q-step
          :done1="item.done"
          :key="item.code"
          :name="item.code"
          :prefix="index + 1"
          :title="item.title"
          class="__item"
          color="white"
          icon="create_new_folder"
          v-for="(item, index) of order.stepsInfo"
          @click="$router.push('/cab/order/step/' + item.code)"
        >
        </q-step>
      </q-stepper>


    </template>

    <div class="c-block-header q-mb-md q-px-md q-py-sm q-pb-none">&nbsp;</div>

  </div>

</template>

<script>


export default {
  components: {},
  data() {
    return {}
  },
  created() {

  },
  methods: {},
  computed: {

    order() {
      return this.$store.getters['edu_order/userOrder']
    },

    bindStatus() {
      let res = {
        class: {},
        style: {}
      }

      let statusInfo = this.order.state.statusInfo

      if (statusInfo) {
        // res.style.border = '1px solid ' + statusInfo.color
        res.style.color = statusInfo.textColor
        res.style.backgroundColor = statusInfo.bgColor
      }
      return res
    },

    step: {
      get: function () {
        return this.$store.state.edu_order.pageStep
      },
      set: function (val) {
        return;
        console.log('fff')

        this.$router.push('/cab/abit/order/step/' + val).catch(() => {
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.c-menu {
  .__item {
    .q-item__section--avatar {
      min-width: auto;
    }

    &.q-router-link--active {
      background1: #437083;
      color: #FFF;
      font-weight: bold;
    }
  }
}


.c-steps {
  background-color: transparent !important;
  box-shadow: none;


  /deep/ .q-stepper__step-content {
    display: none !important;
    background-color: #FFF;
  }

  .__item {


    /deep/ {
      .q-stepper__tab {
        padding: 20px 12px;
      }
    }

    /deep/ .q-stepper__tab--active {
      background: #437083;
    }

    /deep/ .q-stepper__title {
      font-size: 17px;
    }
  }
}

.c-block-header {
  background-color: #384450;
  color: #BBB;
  font-size: 15px;
}

</style>
