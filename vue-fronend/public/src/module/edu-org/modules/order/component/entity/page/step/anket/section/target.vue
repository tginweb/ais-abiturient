<template>

  <CWrapper
    :can-save="true"
    @next="onNext"
    @save="onSave"
  >

    <q-form
      ref="form"
      @submit="onSave"
    >

      <template v-if="orderData.eduTypeSlug=='bak' || orderData.eduTypeSlug=='mag'">

        <h6 class="q-mb-md q-mt-lg">Целевое направление</h6>

        <div class="row q-col-gutter-sm">

          <div class="col-24 q-mb-md">

            <q-select
                v-model="dataEntrance.targetHave"
                :options="[
                  {value: null, label: ''},
                  {value: false, label: 'нет'},
                  {value: true, label: 'да'},
                ]"

                :rules="[val => typeof val === 'boolean' || 'Обязательное поле']"
                emit-value
                label="Имею направление от целевой организации"
                map-options
                outlined
            />

          </div>

          <div v-if="dataEntrance.targetHave" class="col-12 q-mb-sm">

            <q-input v-model="dataEntrance.targetOrganization" label="Наименование организации" outlined></q-input>

          </div>

          <div v-if="dataEntrance.targetHave" class="col-12 q-mb-sm">

            <q-input v-model="dataEntrance.targetDogovor" label="Номер договора" outlined></q-input>

          </div>

        </div>

      </template>


    </q-form>


  </CWrapper>

</template>

<script>

import CBase from './_base'
import CWrapper from './_wrapper'

export default {
  extends: CBase,
  components: {
    CWrapper,
  },
  data() {
    return {
      canSave: true,
      dialogs: {
        achievement: {
          model: {
            achievementType: null,
            desc: '',
            haveDoc: false,
            doc: {}
          }
        },
        subject: {
          model: {
            subject: null,
            year: null,
          }
        }
      }
    }
  },
  methods: {

    getSaveQuery() {
      return {
        mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/section_update.gql'),
        variables: {
          section: 'entrance',
          data: {
            targetHave: this.dataEntrance.targetHave,
            targetOrganization: this.dataEntrance.targetOrganization,
            targetDogovor: this.dataEntrance.targetDogovor,
            specialNeeds: this.dataEntrance.specialNeeds,
          },
        },
      }
    },

    onAchievementSave({data, payload}) {
      this.dataEntrance.achievements = payload.achievements
    },

    onAchievementAdd() {
      this.$store.dispatch('router/vrouterNav', {
        is: 'edu-order-entrance-achievement-edit',
        props: {
          model: this.dialogs.achievement.model,
          items: this.dataEntrance.achievements,
          onSaved: (items) => {
            this.dataEntrance.achievements = items
          }
        }
      })
    },

    onAchievementEdit(item) {
      this.$store.dispatch('router/vrouterNav', {
        is: 'edu-order-entrance-achievement-edit',
        props: {
          model: item,
          items: this.dataEntrance.achievements,
          onSaved: (items) => {
            this.dataEntrance.achievements = items
          }
        }
      })
    },

    async onAchievementDelete(id) {

      this.$q.dialog({
        title: 'Подтвердите удаление',
        message: 'Вы действительно хотите удалить?',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {

          let {data} = await this.$apollo.mutate({
            mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/achievementDelete.gql'),
            variables: {
              id: id,
            },
          })

          this.dataEntrance.achievements = data.res.payload.achievements

        } catch (e) {

          console.log(e)

        }
      })

    },

    onSubjectAdd() {
      this.$store.dispatch('router/vrouterNav', {
        is: 'edu-order-entrance-subject-edit',
        props: {
          model: this.dialogs.subject.model,
          items: this.dataEntrance.subjects,
          onSaved: (subjects) => {
            this.dataEntrance.subjects = subjects
          }
        }
      })
    },

    onSubjectEdit(item) {

      this.$store.dispatch('router/vrouterNav', {
        is: 'edu-order-entrance-subject-edit',
        props: {
          model: item,
          items: this.dataEntrance.subjects,
          onSaved: (subjects) => {
            this.dataEntrance.subjects = subjects
          }
        }
      })

    },

    async onSubjectDelete(id) {

      this.$q.dialog({
        title: 'Подтвердите удаление',
        message: 'Вы действительно хотите удалить предмет?',
        cancel: true,
        persistent: true
      }).onOk(async () => {

        try {
          let {data} = await this.$apollo.mutate({
            mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/subjectDelete.gql'),
            variables: {
              id: id,
            },
          })

          this.dataEntrance.subjects = data.res.payload.subjects

        } catch (e) {

          console.log(e)

        }
      })


    }
  },
  computed: {
    dataEntrance() {
      return this.orderData.anket.entrance
    }
  }
}
</script>


<style lang="scss" scoped>

.c-subjects {
  td, th {
    font-size: 16px;
    text-align: left;
    white-space: normal;
  }

  th {
    color: $grey-8;
    font-weight: 600;
  }
}

.c-achievements {
  .__item {
    background-color: $li-accent-bg;
    border-radius: 10px
  }
}

</style>
