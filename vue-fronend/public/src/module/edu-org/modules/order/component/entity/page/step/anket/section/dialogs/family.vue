<template>

  <q-dialog v-model="visibleData">

    <q-card style="width: 600px;">

      <q-card-section class="row items-center q-px-lg">
        <div class="text-h6">Родственник или официальный представитель</div>
        <q-space/>
        <q-btn dense flat icon="close" round v-close-popup/>
      </q-card-section>

      <q-card-section class="q-pt-none q-px-lg">

        <q-form
          class="s-form-section-controls"
          ref="form"
        >
          <div class="row q-col-gutter-sm">

            <div class="col-24">

              <q-select
                :options="$store.getters['abit/terms'].eduFamilyType"
                :rules="[val => !!val || 'Обязательное поле']"
                emit-value
                label="Степень родства"
                map-options
                option-label="name"
                option-value="nid"
                outlined
                v-model="modelData.familyType"
              />

            </div>

            <div class="col-24">

              <q-input
                :rules="[val => !!val || 'Обязательное поле']"
                label="ФИО"
                outlined
                v-model="modelData.fio"
              />

            </div>

            <div class="col-12">

              <q-input
                :rules="[
                  val => !!val || 'Обязательное поле'
                ]"
                label="Телефон"
                mask="+# (###) ### - ######"
                outlined
                unmasked-value
                lazy-rules
                v-model="modelData.phone"
              />

            </div>

            <div class="col-12">

              <q-input
                label="E-mail"
                outlined
                v-model="modelData.email"
              />

            </div>

            <div class="col-24">

              <q-input
                :rules="[val => !!val || 'Обязательное поле']"
                label="Место жительства"
                outlined
                v-model="modelData.address"
              />

            </div>

            <div class="col-24">

              <q-input
                label="Кем и где работает"
                outlined
                v-model="modelData.work"
              />

            </div>

          </div>

        </q-form>

      </q-card-section>

      <q-card-actions align="right" class="q-px-lg q-pb-lg">
        <q-btn
          :disable="proc"
          :icon="$util.base.variants(status, {
            'success': 'fas fa-check',
            'error': 'fas fa-exclamation-circle',
          })"
          :loading="status==='loading'"
          @click="onSave"
          color="primary"
          label="Сохранить"
        />
      </q-card-actions>

    </q-card>

  </q-dialog>

</template>

<script>
  const cloneDeep = require('clone-deep');

  export default {
    props: {
      visible: {},
      model: {}
    },
    components: {},
    data() {
      return {
        visibleData: this.visible,
        modelData: cloneDeep(this.model),
        proc: false,
        status: ''
      }
    },
    methods: {


    },
    watch: {
      visible(val) {
        this.visibleData = val
      },
      visibleData(val) {
        this.$emit('update:visible', val)
      }
    }
  }
</script>


<style lang="sass" scoped>

  .c-subjects
    td
      font-size: 16px

</style>
