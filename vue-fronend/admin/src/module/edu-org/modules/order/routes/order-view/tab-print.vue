<template>

  <div class="">

    <div class="c-file-section s-form-group s-form-section-controls">

      <div class="q-mb-lg  q-mt-md q-gutter-md">

        <div>
          <q-btn
            class="full-width q-mr-md"
            color="primary"
            icon="fas fa-print"
            label="Квиток"
            @click="$refs.print_consent.print()"
          />
        </div>

        <div>
          <q-btn
            class="full-width q-mr-md"
            color="primary"
            icon="fas fa-print"
            label="Согласие на распространение персональных данных"
            @click="$refs.print_consent_dist.print()"
          />
        </div>

        <div>
          <q-btn
            class="full-width q-mr-md"
            color="primary"
            icon="fas fa-print"
            label="Заявление на поступление"
            @click="onPrintOrder"
          />
        </div>

      </div>

      <q-form ref="formAgreement" class="full-width" v-if="val.eduTypeSlug !== 'spo'">

        <div class="row q-col-gutter-x-md">

          <q-select
            v-model="selectedApp"
            :options="applicationsComp"
            :rules="[val => !!val || 'Выберите направление']"
            class="col-24 col-md-grow"
            color="primary"
            label="Выбор согласия на зачисление"
            map-options
            option-label="name"
            option-value="_id"

            outlined
            style="max-width: 500px;"
          />

          <div class="col-24 col-md-auto">
            <q-btn
              class=" full-width"
              color="primary"
              icon="fas fa-print"
              label="печать согласия"
              @click="onPrintAgreement"
            />
          </div>

        </div>

      </q-form>

      <el-print-template ref="print_spo_order">
        <component :is="'tpl-print-spo-order'" v-slot="scope" :vars="{order:val}"></component>
      </el-print-template>

      <el-print-template ref="print_bak_order">
        <component :is="'tpl-print-bak-order'" v-slot="scope" :vars="{order:val}"></component>
      </el-print-template>

      <el-print-template ref="print_mag_order">
        <component :is="'tpl-print-mag-order'" v-slot="scope" :vars="{order:val}"></component>
      </el-print-template>

      <el-print-template ref="print_asp_order">
        <component :is="'tpl-print-asp-order'" v-slot="scope" :vars="{order:val}"></component>
      </el-print-template>

      <el-print-template ref="print_spo_agreement">
        <component :is="'tpl-print-spo-agreement'" v-slot="scope" :vars="{order:val, app: selectedApp}"></component>
      </el-print-template>


      <el-print-template ref="print_agreement">
        <component
          :is="'tpl-print-agreement'"
          v-slot="scope"
          :vars="{order:val, app: selectedApp}"
        ></component>
      </el-print-template>



      <el-print-template ref="print_consent">
        <component
          :is="'tpl-print-consent'"
          v-slot="scope"
          :vars="{order:val}"
        ></component>
      </el-print-template>

      <el-print-template ref="print_consent_dist">
        <component
          :is="'tpl-print-consent-dist'"
          v-slot="scope"
          :vars="{order:val}"
        ></component>
      </el-print-template>


    </div>


  </div>

</template>

<script>

export default {
  components: {
    'tpl-print-consent': () => import('@project/components/templates/print/consent'),
    'tpl-print-consent-dist': () => import('@project/components/templates/print/consent-dist'),
    'tpl-print-agreement': () => import('@project/components/entity/order/templates/print/agreement'),
    'tpl-print-bak-order': () => import('@project/components/entity/order/templates/print/bak-order'),
    'tpl-print-mag-order': () => import('@project/components/entity/order/templates/print/mag-order'),
    'tpl-print-spo-order': () => import('@project/components/entity/order/templates/print/spo-order'),
    'tpl-print-spo-agreement': () => import('@project/components/entity/order/templates/print/spo-agreement'),
    'tpl-print-asp-order': () => import('@project/components/entity/order/templates/print/asp-order'),

  },
  props: {
    value: {}
  },
  data() {
    return {
      val: this.$util.base.cloneDeep(this.value),
      selectedAppData: null,
      upload: {
        accept: '.pdf, .png, .jpg, .jpeg',
        maxSize: '10000000'
      }
    }
  },
  methods: {


    onPrintOrder() {
      this.$refs['print_' + this.val.eduTypeSlug + '_order'].print();
    },
    onPrintAgreement() {
      this.$refs.formAgreement.validate().then(async (success) => {
        if (success) {

          if (this.val.eduTypeSlug == 'spo') {
            this.$refs['print_spo_agreement'].print();
          } else {
            this.$refs['print_agreement'].print();
          }
        }
      })
    },
  },
  computed: {

    selectedApp: {
      get: function () {
        return this.selectedAppData || (this.applications.length > 1 ? null : this.applicationsComp[0])
      },
      set: function (val) {
        this.selectedAppData = val
      }
    },
    applications() {
      return this.value.applications.items
    },
    applicationsComp() {
      return this.applications.map(item => ({
        ...item,
        name: [item.admission.abbr, item.admission.direct_name, item.admission.fob.name, item.source.name].join(', ')
      }))
    },
  }
}
</script>


<style lang="scss" scoped>

.c-applications {

}


</style>
