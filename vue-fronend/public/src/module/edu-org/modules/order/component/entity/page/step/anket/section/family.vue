<template>

  <CWrapper
    :can-save="false"
    @next="onNext"
    @save="onSave"
  >

    <div class="row q-col-gutter-sm q-mb-lg">

      <div class="col-24">


        <q-list class="c-family">
          <q-item
            :key="item._id"
            @click="onFamilyEdit(item)"
            class="__item q-mb-md"
            clickable
            v-for="item in dataPersonal.family"
            v-ripple
          >

            <q-item-section>
              {{$store.getters['edu_familyType/byId'][item.familyType] && $store.getters['edu_familyType/byId'][item.familyType].name}}: {{item.fio}}
            </q-item-section>

            <q-item-section avatar>
              <q-icon @click.stop="onFamilyDelete(item._id)" color="primary" name="far fa-trash-alt"/>
            </q-item-section>

          </q-item>

        </q-list>

        <c-dialog-family
          :model="dialogs.family.data"
          :visible.sync="dialogs.family.show"
          @saved="onFamilySave"
          v-if="dialogs.family.show"
        ></c-dialog-family>

        <q-btn
          @click="onFamilyAdd"
          color="secondary"
          outline
          rounded
        >Добавить родственника
        </q-btn>

      </div>

    </div>

  </CWrapper>

</template>

<script>

  import CBase from './_base'
  import CWrapper from './_wrapper'
  import CDialogFamily from './dialogs/family'

  export default {
    extends: CBase,
    components: {
      CWrapper,
      CDialogFamily,
    },
    data() {
      return {
        canSave: false,
        dialogs: {
          family: {
            show: false,
            data: {},
            model: {
              familyType: null,
              fio: '',
              phone: '',
              email: '',
              address: '',
              work: ''
            }
          },
        }
      }
    },
    methods: {

      onFamilySave({data, payload}) {
        this.dataPersonal.family = payload.family
      },

      onFamilyAdd() {
        this.$router.push({
          name: 'edu.order:family-edit',
          params: {
            model: this.dialogs.family.model,
            onSaved: (items) => {
              this.dataPersonal.family = items
            }
          }
        })
      },

      onFamilyEdit(item) {
        this.$router.push({
          name: 'edu.order:family-edit',
          params: {
            model: item,
            onSaved: (items) => {
              this.dataPersonal.family = items
            }
          }
        })
      },

      async onFamilyDelete(id) {

        this.$q.dialog({
          title: 'Подтвердите удаление',
          message: 'Вы действительно хотите удалить?',
          cancel: true,
          persistent: true
        }).onOk(async () => {

          try {

            let {data} = await this.$apollo.mutate({
              mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/familyDelete.gql'),
              variables: {
                id: id,
              },
            })

            this.dataPersonal.family = data.res.payload.family

          } catch (e) {

            console.log(e)

          }
        })

      },

    },
    computed: {
      dataPersonal() {
        return this.orderData.anket.personal
      }
    }
  }
</script>


<style lang="scss" scoped>

  .c-subjects {
    td, th {
      font-size: 16px;
      text-align: left;
    }
    th {
      color: $grey-8;
      font-weight: 600;
    }
  }

  .c-family {
    .__item {
      background-color: $li-accent-bg;
      border-radius: 10px
    }
  }

</style>
