<template>

  <div>


  </div>

</template>

<script>

import Base from './_base'
import FormActions from './form/actions'

export default {
  extends: Base,
  components: {
    FormActions
  },
  props: {
    order: {},
    section: {}
  },
  data() {
    return {
      orderData: this.order,
      updated: false
    }
  },
  methods: {
    async refetchDocs() {
      await this.$store.dispatch('edu_order/userOrderFetchDocs')
    },

    getSaveQuery() {
      return {}
    },

    async onSaveCommit() {
      let query = this.getSaveQuery();
      const {result} = await this.$store.dispatch('gql/mutation', query)
      this.updated = false
      return result
    },

    async onSave() {
      try {
        if (await this.$refs.form.validate()) {
          const res = await this.onSaveCommit()
          return res.success
        }
      } catch (e) {
        console.log(e)
      }
    },
    async onNext() {

      try {
        if (this.canSave) {
          if (await this.onSave()) {
            this.$emit('navNext', this.section.id)
          }
        } else {
          this.$emit('navNext', this.section.id)
        }
      } catch (e) {
        console.log(e)
      }

      /*
      if (this.updated && this.canSave) {
        this.$q.dialog({
          title: 'Данные формы были изменены',
          message: 'Перейти к следующему шагу без сохранения?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          this.$emit('navNext', this.section.id)
        })
      } else {
        this.$emit('navNext', this.section.id)
      }

       */

    },
  },
  computed: {
    storeOrder() {
      return this.$store.getters['edu_order/userOrder']
    }
  },
  watch: {
    orderData: {
      handler() {
        this.updated = true
      },
      deep: true
    }
  }
}
</script>


<style lang="sass" scoped>


</style>
