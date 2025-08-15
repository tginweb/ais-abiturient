<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    title="Cоздать задание"
    @hide="onHide"
  >

    <q-form v-if="inited" ref="form">

      <q-select
        v-model="model.type"
        :options="$store.state.edu_epgu_task.app.taskTypes"
        :rules="[val => !!val || 'Обязательное поле']"
        emit-value
        label="Тип"
        map-options
        option-label="label"
        option-value="code"
        outlined
      />

      <div v-if="taskType" class="q-pt-md">

        <div class="q-gutter-y-md">

          <q-select
            v-model="model.subtype"
            :options="taskType.actions"
            :rules="[val => !!val || 'Обязательное поле']"
            label="Действие"
            outlined
          />

          <q-input
            v-model="model.entityIdsText"
            label="Записи"
            outlined
            rows="5"
            type="textarea"
          />

        </div>

      </div>

    </q-form>

  </component>

</template>

<script>

import MVroutable from '@common/router/mixin/vroute'

export default {
  mixins: [MVroutable],
  props: {
    type: {},
    subtype: {},
    entityIds: {}
  },
  components: {},
  data() {
    return {
      inited: false,
      taskType: null,
      model: {
        type: this.type,
        subtype: this.subtype,
        entityIdsText: this.entityIds ? this.entityIds.join("\n") : null
      }
    }
  },
  computed: {
    actions() {
      return [
        {label: 'Создать', callback: this.onSubmit}
      ]
    }
  },
  async created() {
    await this.$store.dispatch('edu_epgu_task/fetchTaskTypes')
    await this.fetchTaskType()
    this.inited = true
  },
  methods: {
    async fetchTaskType() {
      this.taskType = this.model.type ? await this.$store.dispatch('edu_epgu_task/fetchTaskType', this.model.type) : null
    },
    onSubmit() {

      this.$refs.form.validate().then(async (success) => {

        if (success) {

          try {
            const res = await this.$store.dispatch('edu_epgu_task/apiEntityAdd', this.model)

            if (res.result.success) {
              if (this.onResolve)
                this.onResolve()
              this.visible = false
            }
            console.log(res)
          } catch (e) {
            console.log(e)
          }

        }
      })
    }
  },
  watch: {
    'model.type'() {
      this.fetchTaskType()
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
