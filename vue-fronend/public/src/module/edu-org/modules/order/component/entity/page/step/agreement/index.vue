<template>

  <div style="max-width: 1000px;">


    <div class="com s-info-section" v-if="false">

      <div class="__header">Ваши направления</div>

      <q-markup-table
        v-if="applicationsData.length>0"
        class="c-applications s-table-data"
        flat
      >
        <tbody>

        <tr
          v-for="(item, index) in applicationsData"
          class="__item"
        >

          <td class="dense">
            {{ index + 1 }}.
          </td>

          <td class="__item__name" style="width: 65%">

            <div>

              {{ item.admission.abbr }}

              {{ item.admission.direct_name }}

            </div>

            <div class="text-weight-bold">
              {{ item.admission.fob.name }}
            </div>

            <div class="text-grey-8">
              {{ item.source.name }}
            </div>

            <div v-if="item.specsAdmissions && item.specsAdmissions.length" class="q-mt-xs text-grey-4">

              <ul style="">
                <li
                  v-for="specsAdmission of item.specsAdmissions"
                  :key="specsAdmission.id"
                >
                  {{ specsAdmission.abbr }}
                  {{ specsAdmission.spec_name }}
                </li>
              </ul>

            </div>

            <div class="q-mt-xs text-grey-8" v-if="item.cappsource === 'epgu'">
              Подано через: <img class="q-my-auto" src="https://gu-st.ru/st/img/logo_nobeta-0a1f5dfe6b.svg" width="70px"/>
            </div>


          </td>

          <td class="__item__status">

            <span v-if="item.agree"><q-icon name="far fa-check-circle" color="green"/> согласие на зачисление</span>
            <span v-else-if="item.agreeDeny"><q-icon name="fas fa-ban" color="red"/> отказ от зачисления</span>

          </td>

        </tr>

        </tbody>

      </q-markup-table>
      <div v-else class="text-grey-7">
        направления не выбраны
      </div>

    </div>

    <div class="q-mt-md">
      Выберите действия:
    </div>

    <div class="q-mt-md">

      <q-checkbox v-model="deny" label="Отказ от зачисления" style="font-size: 22px;"/>

      <div v-if="deny" class="q-ml-xl q-mt-md">

        <el-print-template ref="print_agreement_deny">
          <component
            :is="'tpl-print-agreement-deny'"
            v-slot="scope"
            :vars="{order:val, app: denyApp}"
          ></component>
        </el-print-template>

        <div class="">

          <div class="text-weight-bold">Отказ по направлению</div>

          <div class="">

            <q-form ref="formAgreementDeny" class="full-width">

              <div class="row no-wrap q-col-gutter-x-md">

                <q-select
                  v-model="denyApp"
                  :options="prepareApplications"
                  :rules="[v => !!v || 'Выберите направление']"
                  class="col-grow"
                  color="primary"
                  label="Выберите направление"
                  map-options
                  option-label="name"
                  option-value="_id"
                  outlined
                  style="max-width: 500px;"
                ></q-select>

                <div>
                  <div>
                    <q-btn
                      class="full-height"
                      color="primary"
                      icon="fas fa-print"
                      label="печать"
                      @click="onPrintAgreementDeny"
                    />
                  </div>
                </div>

              </div>

            </q-form>

          </div>

        </div>

        <div class=" ">

          <div class="text-weight-bold">Загруженные сканы отказов</div>

          <div class="">

            <el-upload-doc
              :accept="agreementDenyDocFile.accept || upload.accept"
              :max-file-size="agreementDenyDocFile.maxSize || upload.maxSize"
              :multiple="!!agreementDenyDocFile.multiple"
              :relDocPath="agreementDenyDocFile.path"
              :value="agreementDenyDocFile.multiple ? agreementDenyDocFile.children : agreementDenyDocFile.fileDoc"
            />


          </div>

        </div>

      </div>

    </div>

    <div class="q-mt-lg">

      <q-checkbox v-model="apply" label="Согласие на зачисление" style="font-size: 22px;"/>

      <div v-if="apply" class="q-ml-xl q-mt-md">

        <el-print-template ref="print_spo_agreement">
          <component :is="'tpl-print-spo-agreement'" v-slot="scope" :vars="{order:val, app: applyApp}"></component>
        </el-print-template>

        <el-print-template ref="print_agreement">
          <component
            :is="'tpl-print-agreement'"
            v-slot="scope"
            :vars="{order:val, app: applyApp}"
          ></component>
        </el-print-template>

        <div class="">

          <div class="text-weight-bold">Согласие по направлению</div>

          <div class="">

            <q-form ref="formAgreement" class="full-width">

              <div class="row no-wrap q-col-gutter-x-md">

                <q-select
                  v-model="applyApp"
                  :options="prepareApplications"
                  :rules="[v => !!v || 'Выберите направление']"
                  class="col-grow"
                  color="primary"
                  label="Выберите направление"
                  map-options
                  option-label="name"
                  option-value="_id"
                  outlined
                  style="max-width: 500px;"
                ></q-select>

                <div>
                  <div>
                    <q-btn
                      class="full-height"
                      color="primary"
                      icon="fas fa-print"
                      label="печать"
                      @click="onPrintAgreement"
                    />
                  </div>
                </div>

              </div>

            </q-form>

          </div>

        </div>

        <div class="">

          <div class="text-weight-bold">Загруженные сканы согласий</div>

          <div class="q-mb-lg">

            <el-upload-doc
              :accept="agreementDocFile.accept || upload.accept"
              :max-file-size="agreementDocFile.maxSize || upload.maxSize"
              :multiple="!!agreementDocFile.multiple"
              :relDocPath="agreementDocFile.path"
              :value="agreementDocFile.multiple ? agreementDocFile.children : agreementDocFile.fileDoc"
            />

          </div>

        </div>

      </div>

    </div>

    <q-btn
      v-if="deny || apply"
      :label="btnLabel"
      class="q-mt-xl"
      color="secondary"
      size="lg"
      @click="onSubmit"
    />

  </div>

</template>

<script>
import * as sections from '@project/components/entity/order/section'

export default {
  components: {
    ...sections,
    'tpl-print-agreement': () => import('@project/components/entity/order/templates/print/agreement'),
    'tpl-print-spo-agreement': () => import('@project/components/entity/order/templates/print/spo-agreement'),
    'tpl-print-agreement-deny': () => import('@project/components/entity/order/templates/print/agreement-deny'),

  },
  props: {
    value: {}
  },
  data() {
    return {
      tab: 'apply',
      val: this.$util.base.cloneDeep(this.value),
      applyApp: null,
      denyApp: null,
      apply: false,
      deny: false,

      upload: {
        accept: '.pdf, .png, .jpg, .jpeg',
        maxSize: '10000000'
      }
    }
  },
  computed: {
    applicationsData() {
      return this.val.applications.items.filter(item => !item.deleted)
    },

    btnLabel() {
      if (this.deny && this.apply) return 'Отправить в ВУЗ'
      if (this.deny) return 'Отправить ОТКАЗ в ВУЗ'
      if (this.apply) return 'Отправить СОГЛАСИЕ в ВУЗ'
    },

    agreementDocFile() {
      return this.value.allFiles.find(item => item.path === 'send.agreementDocFile')
    },

    agreementDenyDocFile() {
      return this.value.allFiles.find(item => item.path === 'send.agreementDenyDocFile')
    },

    selectedApp: {
      get: function () {
        return this.selectedAppData || (this.prepareApplications.length > 1 ? null : this.prepareApplications[0])
      },
      set: function (val) {
        this.selectedAppData = val
      }
    },
    prepareApplications() {
      return this.applicationsData.map(item => ({
        ...item,
        name: [item.admission.abbr, item.admission.direct_name, item.admission.fob.name, item.source.name].join(', ')
      }))
    },
  },
  methods: {
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
    onPrintAgreementDeny() {
      this.$refs.formAgreementDeny.validate().then(async (success) => {
        if (success) {
          this.$refs['print_agreement_deny'].print();
        }
      })
    },
    async onSubmit() {

      try {

        const params = {}

        if (this.deny) {
          params.deny = true
          if (!this.denyApp) {
            this.$refs.formAgreementDeny.validate()
            return
          }
          params.denyAppId = this.denyApp._id
        }

        if (this.apply) {
          params.apply = true
          if (!this.applyApp) {
            this.$refs.formAgreement.validate()
            return
          }
          params.applyAppId = this.applyApp._id
        }

        let {data} = await this.$apollo.mutate({
          mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/sendAgreement.gql'),
          variables: {
            data: params
          },
        })

        this.processRequestResult(data.res.result)

        if (data.res.result.success)
          window.location.replace('/cab/order/view')

      } catch (e) {

        console.log(e)
      }
    }
  }
}
</script>


<style lang="scss" scoped>


</style>
