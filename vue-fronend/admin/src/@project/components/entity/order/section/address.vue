<template>

  <div class="com s-info-section">

    <div class="__header">Адреса и контакты</div>

    <q-list class="__items">
      <q-item class="__item">
        <q-item-section class="__title">Адрес регистрации</q-item-section>
        <q-item-section class="__value" side>
          {{personalData.addressReg && personalData.addressReg.name}}
        </q-item-section>
      </q-item>
      <q-item class="__item" v-if="personalData.addressEqual ? personalData.addressReg.name : personalData.addressLive.name">
        <q-item-section class="__title">Адрес проживания</q-item-section>
        <q-item-section class="__value" side>
          {{personalData.addressEqual ? personalData.addressReg.name : personalData.addressLive.name}}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Телефон</q-item-section>
        <q-item-section class="__value" side>
          {{personalData.phone ? personalData.phone : ''}}
        </q-item-section>
      </q-item>
      <q-item class="__item">
        <q-item-section class="__title">Email</q-item-section>
        <q-item-section class="__value" side>
          {{personalData.email}}
        </q-item-section>
      </q-item>
    </q-list>

  </div>

</template>

<script>

  export default {
    components: {},
    props: {
      order: {}
    },
    data() {
      return {
        orderData: this.order,
      }
    },
    watch: {
      order(val) {
        this.orderData = val
      }
    },
    computed: {
      personalData() {
        return this.orderData.anket.personal
      }
    }
  }

</script>

<style lang="scss" scoped>




</style>
