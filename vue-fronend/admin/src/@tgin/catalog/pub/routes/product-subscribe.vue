<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :loading="fetching"
    title="Вход по номеру телефона"
    @hide="onHide"
    dialogWidth="500px"
  >

    <div class="q-mb-md row q-col-gutter-lg items-center">

      <div class="col-4">
        <img v-if="itemState.LIST_PICTURE" :src="itemState.LIST_PICTURE.SRC"/>
      </div>
      <div class="col-20">
        {{ itemState.NAME }}
      </div>

    </div>

    <q-form
      ref="form"
      class="q-gutter-md"
      @submit="onSubmit"
    >

      <q-input
        v-model="form.name"
        label="Ваше имя"
        maxlength="100"
      />

      <q-input
        v-model="form.phone"
        :rules="[ val => val || 'Поле обязательно']"
        label="Телефон"
        lazy-rules
        maxlength="100"
      />

      <q-input
        v-model="form.email"
        label="E-mail"
        maxlength="100"
      />

      <q-input
        v-model="form.comment"
        label="Сообщение"
        maxlength="500"
      />


    </q-form>

  </component>

</template>

<script>

import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  props: {
    phone: {},
    noRedirect: {}
  },
  components: {},
  data() {
    return {
      currentStepId: 'request',
      form: {
        name: null,
        phone: null,
        email: null,
        comment: null,
      }
    }
  },
  computed: {
    actions() {
      const result = []

      result.push({
        label: 'Отправить',
        color: 'primary',
        callback: () => {
        }
      })

      return result
    }
  },
  methods: {
    async fetch() {
      this.entity = this.entityData || await this.$store.dispatch('catalog/productElementFetch', this.entityId)
    },

    onSubmit() {

      this.$refs.form.validate().then(success => {
        if (success) {


        }
      })
    }
  },
  async created() {
    await this.fetch();
  }
}

</script>

<style lang="scss" scoped>


</style>
