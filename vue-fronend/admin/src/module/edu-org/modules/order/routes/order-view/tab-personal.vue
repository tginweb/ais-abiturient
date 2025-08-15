<template>

  <div>
    <div v-if="canEdit" class="q-gutter-x-md flex q-pb-lg">

      <q-toggle v-model="editState" label="Редактировать"/>

      <q-space/>

      <div v-if="changed && editable" class="q-gutter-x-md">

        <q-btn
            v-if="changed"
            color="primary"
            icon="fas fa-plus"
            label="Сохранить изменения"
            size="md"
            @click="onSave"
        />

        <q-btn
            v-if="changed"
            color="red"
            icon="fas fa-trash"
            label="Сбросить изменения"
            outline
            size="md"
            @click="onReset"
        />
      </div>

    </div>

    <q-form ref="form">
      <div class="row q-col-gutter-x-md q-col-gutter-y-lg q-mb-lg">

        <div class="col-24 col-lg-12 ">

          <div class="q-gutter-y-lg">

            <CSectionPersonal ref="personal" :edit="editable" :orderData="entityState"></CSectionPersonal>

            <CSectionDul ref="dul" :edit="editable" :orderData="entityState"></CSectionDul>

            <CSectionEducation ref="education" :edit="editable" :orderData="entityState"></CSectionEducation>

          </div>

        </div>

        <div class="col-24 col-lg-12">

          <div class="q-gutter-y-lg">

            <CSectionTarget ref="target" :edit="editable" :orderData="entityState"></CSectionTarget>

            <CSectionContacts ref="contacts" :edit="editable" :orderData="entityState"></CSectionContacts>

            <CSectionAddress ref="address" :edit="editable" :orderData="entityState"></CSectionAddress>

          </div>

        </div>

      </div>

    </q-form>


  </div>

</template>

<script>
import CParent from './tab'
import cloneDeep from "@tgin/main/common/lib/util/base/cloneDeep"

import CSectionPersonal from "./section-personal"
import CSectionEducation from "./section-education"
import CSectionAddress from "./section-address"
import CSectionContacts from "./section-contacts"
import CSectionDul from "./section-dul"
import CSectionTarget from "./section-target"

export default {
  extends: CParent,
  components: {
    CSectionPersonal,
    CSectionEducation,
    CSectionAddress,
    CSectionContacts,
    CSectionDul,
    CSectionTarget
  },
  props: {
    edit: {}
  },
  data() {
    return {
      editState: this.edit,
      popupResolved: false,
      entityState: cloneDeep(this.order)
    }
  },
  computed: {

    editable() {
      return this.editState && this.canEdit
    },

    canEdit() {
      return !!this.order.perms.personal_edit
    }
  },
  methods: {
    onReset() {
      this.entityState = cloneDeep(this.order)
      this.$nextTick(() => {
        this.unsetChanged()
      })
    },
    async onSaveCommit() {
      try {
        const sections = {
          personal: this.$refs.personal.getSaveFields(),
          address: this.$refs.address.getSaveFields(),
          education: this.$refs.education.getSaveFields(),
          contacts: this.$refs.contacts.getSaveFields(),
          dul: this.$refs.dul.getSaveFields(),
          target: this.$refs.target.getSaveFields(),
        }

        let {data: {res: {result}}} = await this.$apollo.mutate({
          mutation: require('../../gql/order/mutation/orderUpdate.gql'),
          variables: {
            _id: this.order._id,
            model: sections
          }
        })

        this.$bus.emit('processMessages', result.messages);
        this.unsetChanged()
        this.$emit('saved')
        this.$emit('refetch')

      } catch (e) {
        console.log(e)
      }
    },
    async onSave() {
      if (await this.$refs.form.validate() || true) {
        await this.onSaveCommit()
      } else {
        const errorElm = this.$refs.form.$el.querySelector('.q-field--error')
        if (errorElm) {
          this.$util.dom.scrollTo({el: errorElm, target: '.c-modal-scroll', offset: 80, duration: true})
        }
      }
    },
    isChanged() {
      return this.changed
    },
    unsetChanged() {
      this.changed = false
      this.popupResolved = false
    },
    reload() {
      this.$emit('refetch')
    },
  },
  watch: {
    entityState: {
      handler: function (val) {
        this.changed = true
      },
      deep: true
    },
    order() {
      if (!this.editable) {
        this.entityState = cloneDeep(this.order)
      }
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
