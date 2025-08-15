<template>

  <component
      v-if="entity"
      v-model="visible"
      v-bind="bindRouterWrapper"
      :actions="actions"
      :actionsClose="true"
      :loading="fetching"
      :title="'Просмотр предмета ' + entityId"
      dialogWidth="800px"
      @hide="onHide"
  >

    <q-form ref="form">

      <ui-data-tree-view
          v-if="entity"
          :data="entityViewTree"
          :expanded="['Общее']"
      />

      <div>

        <q-markup-table bordered flat>
          <thead>
          <tr>
            <th>ID</th>
            <th>Наборы</th>
            <th>Дата</th>
            <th>Место</th>
            <th>
              <q-btn
                  dense
                  icon="add"
                  @click="onLocationAdd"
              />
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, index) of entity.locations"
              :key="index"
          >
            <td>
              <q-input
                  v-model="item.id"
              />
            </td>
            <td>
              <q-input
                  v-model="item.cadmissionStr"
              />
            </td>

            <td style="width: 240px;">

              <q-input v-model="item.dateInput">

                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="event">
                    <q-popup-proxy transition-hide="scale" transition-show="scale">
                      <q-date v-model="item.dateInput" mask="DD.MM.YYYY HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Close"/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="access_time">
                    <q-popup-proxy transition-hide="scale" transition-show="scale">
                      <q-time v-model="item.dateInput" format24h mask="DD.MM.YYYY HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Close"/>
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

            </td>
            <td>
              <q-input
                  v-model="item.place"
              />
            </td>
            <td>
              <q-btn
                  dense
                  icon="delete"
                  @click="onLocationDelete(item)"
              />
            </td>
          </tr>
          </tbody>
        </q-markup-table>

      </div>

    </q-form>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {

    actions() {
      return [
        {
          label: 'Сохранить',
          callback: this.onSubmit
        }
      ]
    },

    entityViewTree() {

      const res = []

      const entity = this.entity

      res.push({
        label: 'Общее',
        expanded: true,
        children: [
          {label: '_id', value: entity._id},
          {label: 'ID', value: entity.id},
          {label: 'Name', value: entity.name},
        ]
      })

      if (entity.subjects && entity.subjects.length) {

        let rows = []

        entity.subjects.forEach((subject) => {

          let subjectName
          let subjectRows = [
            {label: 'ID', value: subject.csubject}
          ]

          if (subject.subject) {
            subjectName = subject.subject.name
            subjectRows.push(
                {label: 'Name', value: subject.subject.name}
            )
          } else {
            subjectName = 'Предмет ' + subject.csubject
          }

          subjectRows.push(
              {label: 'Минимальный балл', value: subject.minimal}
          )

          rows.push({
            label: subjectName,
            children: subjectRows
          })
        })

        res.push({
          label: 'Предметы',
          children: rows
        })
      }

      return res
    },

    quantityInput: {
      get: function () {
        return this.quantityState
      },
      set: function (val) {

        if (val < this.measureRatio) {
          this.$emit('remove', this.item.ID)
        } else {
          this.quantityState = parseFloat(val)
          this.$emit('quantity', this.item.ID, this.quantityState)
        }
      }
    },
  },
  created() {
    this.fetch()
  },

  methods: {

    onLocationAdd() {
      this.entity.locations.push({
        dateInput: '',
        place: ''
      })
    },

    onLocationDelete(aitem) {
      this.entity.locations = this.entity.locations.filter((item) => item !== aitem)
    },

    async onSubmit() {
      this.$refs.form.validate().then(async (success) => {
        if (success) await this.onSubmitAction()
      }).catch((e) => {
      })
    },

    async onSubmitAction() {
      await this.mutationMethod(async () => {
        try {
          this.$store.dispatch('gql/mutation', {
            mutation: require('../gql/mutation/action.gql'),
            variables: {
              action: 'update',
              id: this.entityIdState,
              model: this.entityBeforeUpdate(this.entity),
            }
          })
          if (this.onResolve)
            this.onResolve()
        } catch (e) {
        }
      })
    },

    entityBeforeUpdate(entity) {
      return {
        ...entity,
        locations: (entity.locations || []).map(item => {
          return {
            ...item,
            id: parseInt(item.id),
            date: this.$util.date.parseTime(item.dateInput, 'datetime', 'tms'),
            cadmission: item.cadmissionStr ? item.cadmissionStr.split(',').map(c => parseInt(c)) : []
          }
        }),
      }
    },

    entityAfterFetch(entity) {
      if (!entity)
        return entity

      entity.locations = (entity.locations || []).map(item => {
        return {
          ...item,
          dateInput: this.$util.date.timestampToFormat(item.date, 'datetime'),
          cadmissionStr: item.cadmission ? item.cadmission.join(',') : ''
        }
      })


      return entity
    },

    async fetch() {
      await this.fetchingMethod(async () => {
        this.entity = this.entityAfterFetch(this.entityData || await this.$store.dispatch('edu_subject/entityQuery', {id: this.entityId}))
      })
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
