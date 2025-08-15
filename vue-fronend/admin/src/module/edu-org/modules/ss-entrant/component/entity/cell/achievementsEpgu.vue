<template>

  <div>

    <div v-if="docsByType.achievement" class=" q-mr-md">

      <div class="q-mb-sm">

        <div class="text-weight-bold">Достижения ЕПГУ:</div>

        <div class="q-mb-md">
          <span class="text-grey-6">Количество:</span> {{ docsByType.achievement.length }}
        </div>

        <table cellspacing="0" class="s-table-data dense text-left bg-white shadow-1">
          <thead>
          <tr>
            <td v-if="false">Учтено</td>
            <td v-if="false">Тип</td>
            <td>Наименование</td>
            <td>Файл</td>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="doc of achievements"
            :key="doc._id"
            :class="{}"
          >
            <td v-if="false" class="">
              <q-checkbox
                v-model="doc.attached"
                dense
                @input="onChange"
              />
            </td>
            <td v-if="false" class="" style="">
              {{ doc.typeName }}
            </td>
            <td class="" style="">

              <div style="max-height: 75px; overflow: auto; text-overflow: ellipsis">
                {{ doc.doc.name }}
              </div>

            </td>
            <td class="__item__doc dense">
                <span v-if="doc.fileId">
                  <q-btn
                    :href="'/api/file/download?id=' + doc.fileId"
                    :icon="$icons.fasDownload"
                    dense
                    flat
                    target="_blank"
                    type="a"
                  />
                </span>
            </td>
          </tr>
          </tbody>
        </table>

      </div>

      <q-btn
        class="q-px-md"
        color="primary"
        dense
        label="сохранить учтенные"
        @click="onSave"
        v-if="changed"
      />

      <div class="" v-if="false">
        <q-btn
          class="q-px-md"
          color="primary"
          dense
          :label="achievementOpen ? 'скрыть' : 'показать еще ' + (docsByType.achievement.length - achievements.length)"
          outline
          @click="achievementOpen = !achievementOpen"
          v-if="docsByType.achievement.length > 3"
        />
      </div>

    </div>


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
