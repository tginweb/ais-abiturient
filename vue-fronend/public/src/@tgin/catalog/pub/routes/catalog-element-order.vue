<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="fetching"
      :title="pageTitle"
      @hide="onHide"
  >

    <div v-if="entity" class="q-pb-md row q-col-gutter-lg items-center">

      <div class="col-4">
        <img v-if="entity.LIST_IMAGE" :src="$image.resolveUrl(entity.LIST_IMAGE.SRC, 'r200')"/>
      </div>

      <div class="col-20">
        {{ entity.NAME }}
      </div>

    </div>

    <q-form
        ref="form"
        class=""
        @submit="onSubmit"
    >
      <div class="q-gutter-md">

        <q-input
            v-model="form.username"
            label="Ваше имя"
            maxlength="20"
            outlined
        />

        <ui-input-phone
            v-model="form.phone"
            :required="true"
            label="Телефон"
            :lazy-rules="true"
            outlined
        />

        <ui-input-email
            v-model="form.email"
            label="E-mail"
            :lazy-rules="true"
            outlined
        />

        <q-input
            v-model="form.comment"
            input-style="height: 80px;"
            label="Сообщение"
            maxlength="3000"
            outlined
            type="textarea"
        />

      </div>

    </q-form>

  </component>

</template>

<script>
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVRoute],
  components: {},
  props: {
  },
  data() {
    return {
      form: {
        username: null,
        email: null,
        phone: null,
        comment: null,
      },
    }
  },
  computed: {
    actions() {
      const result = []

      result.push({
        label: 'Заказать',
        color: 'primary',
        callback: this.onSubmit,
      })

      return result
    },

    pageTitle() {
      return 'Заказать'
    },
  },
  methods: {
    async fetch() {
      try {
        let product = await this.$store.dispatch('catalog_pub/productElementQuery', {
          filter: {
            ID: {eq: this.entityIdState}
          },
          options: {
            state: this.requestState,
          }
        })
        this.assignEntity(product, this.requestState)
      } catch (e) {
        console.log(e)
      }
    },

    onSubmit() {
      this.$refs.form.validate().then(async success => {
        if (success) {

          this.submitRequest.proccess = true

          try {

            const {data: {res: {result}}} = await this.$apollo.mutate({
              mutation: require('../gql/mutation/element-order.gql'),
              variables: {
                elementId: this.entityIdState,
                email: this.form.email,
                phone: this.form.phone,
                username: this.form.username,
              }
            })

            this.$bus.emit('processMessages', result.messages);

            if (result.success) {
              this.visible = false
            }

          } catch (e) {
            console.log(e)
          }

          this.submitRequest.proccess = false

        }
      })
    }
  },
  async created() {

    if (this.$store.getters['user/authorized']) {
      this.form.name = this.$store.getters['user/userNameFirstLast']
      this.form.email = this.$store.getters['user/userEmail']
      this.form.phone = this.$store.getters['user/userPhone']
    }

    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>

.c-orders {
  border: 1px solid #EFEEEE;

  .c-orders__order:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}

</style>
