<template>

  <div v-if="docsByType.achievement" class=" q-mr-md">
          <span
              v-for="doc of achievements"
              :key="doc._id"
              :class="{}"
          >
            {{ doc.doc.name }};
          </span>
  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  data() {
    return {
      achievementOpen: false,
      changed: false
    }
  },
  methods: {
    onChange() {
      this.changed = true
    },
    async onSave() {

      this.$q.dialog({
        title: 'Подтверждение',
        message: 'Сохранить учтенные достижения?',
        cancel: true,
      }).onOk(async () => {

        try {

          let {data: {res: {result}}} = await this.$apollo.mutate({
            mutation: require('../../../gql/mutation/attachEntrantDocs.gql'),
            variables: {
              id: this.row.id,
              docs: this.achievements
            }
          })

          this.$bus.emit('processMessages', result.messages);

          if (result.success) {
            this.changed = false
          }

        } catch (e) {

          console.log(e)
        }

      })


    }
  },
  computed: {
    docsByType() {
      return this.row.epguDocs.reduce((map, obj) => {
        if (!map[obj.type]) map[obj.type] = []
        map[obj.type].push(obj)
        return map
      }, {})
    },

    achievements() {
      return this.docsByType.achievement
      //return this.docsByType.achievement && this.docsByType.achievement.slice(0, !this.achievementOpen ? 3 : 40) || []
    }
  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
