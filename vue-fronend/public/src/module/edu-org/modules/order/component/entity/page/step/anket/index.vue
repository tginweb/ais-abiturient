<template>

  <div>


    <template v-if="$q.screen.lt.md">

      <div class="row" style="">

        <div class="col-24" style="background1: #eee">

          <q-tabs
            class="text-teal c-tabs-hor"
            dense
            inline-label
            v-model="currentTab"
          >
            <q-tab
              :key="section.id"
              :label="section.labelShort"
              :name="section.id"
              class="__item"
              v-for="section in formSections"
            />
          </q-tabs>

        </div>

        <div class="col-24" style="background: #FFF">

          <q-tab-panels
            animated
            swipeable
            transition-next="jump-up"
            transition-prev="jump-up"
            v-model="currentTab"
            vertical
          >

            <q-tab-panel
              :key="section.id"
              :name="section.id"
              v-for="section in formSections"
            >

              <div class="text-h4 q-mb-md">
                {{section.label}}
              </div>

              <component
                v-bind="bindSection(section)"
                :order="orderData"
                @navNext="onNavNext"
                :section="section"
              >
              </component>

            </q-tab-panel>

          </q-tab-panels>

        </div>

      </div>

    </template>

    <template v-else>

      <div class="row" style="min-height: calc(100vh - 10px);">

        <div class="col-5 col-lg-4" style="background: #eee">

          <q-tabs
            class="text-teal c-tabs-vert q-mt-lg  "
            inline-label
            v-model="currentTab"
            vertical
          >
            <q-tab
              :key="section.id"
              :label="section.label"
              :name="section.id"
              class="__item text-black"
              v-for="section in formSections"
            />
          </q-tabs>

        </div>

        <div class="col-19 col-lg-20" style="background: #FFF">

          <q-tab-panels
            animated
            swipeable
            transition-next="jump-up"
            transition-prev="jump-up"
            v-model="currentTab"
            vertical
          >

            <q-tab-panel
              :key="section.id"
              :name="section.id"
              class="c-tab-panel q-pa-lg"
              v-for="section in formSections"
            >

              <div class="__header text-h4 q-mb-lg q-pb-sm">
                {{section.label}}
              </div>

              <component
                v-bind="bindSection(section)"
                :order="orderData"
                @navNext="onNavNext"
                :section="section"
              >
              </component>

            </q-tab-panel>

          </q-tab-panels>

        </div>

      </div>

    </template>

  </div>

</template>

<script>

  import SectionAddress from './section/address'
  import SectionPersonal from './section/personal'
  import SectionEducation from './section/education'
  import SectionTarget from './section/target'
  import SectionFamily from './section/family'
  import SectionOther from './section/other'

  const cloneDeep = require('clone-deep')

  export default {
    components: {
      SectionAddress,
      SectionPersonal,
      SectionEducation,
      SectionTarget,
      SectionFamily,
      SectionOther,
    },
    props: {
      order: {}
    },
    data() {
      return {
        currentTab: 'personal',
        orderData: this.fillOrderDefaults(cloneDeep(this.order))
      }
    },
    async preFetch(ctx) {

    },
    watch: {

    },
    methods: {

      fillOrderDefaults(order) {

        let dataPersonal = order.anket.personal

        if (!dataPersonal.lastName)
          dataPersonal.lastName = this.$store.state.user.user.lastName

        if (!dataPersonal.firstName)
          dataPersonal.firstName = this.$store.state.user.user.firstName

        if (!dataPersonal.secondName)
          dataPersonal.secondName = this.$store.state.user.user.secondName

        if (!dataPersonal.phone)
          dataPersonal.phone = this.$store.state.user.user.phone

        if (!dataPersonal.email)
          dataPersonal.email = this.$store.state.user.user.email

        if (dataPersonal.phone && dataPersonal.phone.length<11) dataPersonal.phone = '7' + dataPersonal.phone
        if (dataPersonal.phone2 && dataPersonal.phone2.length<11) dataPersonal.phone2 = '7' + dataPersonal.phone2

        if (!dataPersonal.citizenship) {
          dataPersonal.citizenship = this.$store.state.user.user.user.citizenship
        }

        if (!dataPersonal.snils)
          dataPersonal.snils = this.$store.state.user.user.user.snils

        return order;
      },

      onNavNext(id) {

        if (id==='family') {
          this.$router.push('/cab/order/step/entrance')
          return
        }

        let sections = this.$store.state.edu_order.orderFormSections;

        let currentSection = sections.find((item)=>item.id===id)
        let currentSectionIndex = sections.indexOf(currentSection)

        for (let i=currentSectionIndex+1; i < sections.length; i++) {
          if (sections[i].eduLevel.indexOf(this.orderData.eduType) > -1) {
            this.currentTab = sections[i].id
            break;
          }
        }
      },

      ensureOrder(order) {
        return cloneDeep(order)
      },

      bindSection(section) {
        let res = section.props || {}
        res.is = section.com
        return res
      }
    },
    created() {

    },
    computed: {
      formSections() {
        return this.$store.state.edu_order.orderFormSections.filter((section)=>section.eduLevel.indexOf(this.orderData.eduType) > -1)
      },
    }
  }
</script>


<style lang="scss" scoped>

  .c-tabs-vert {
    .__item {
      /deep/ .q-tab__content {
        justify-content: flex-end !important;
        padding: 7px 0;
        width: 100%;
        white-space: normal;
        text-align: right;
      }
    }
  }

  .c-tab-panel {
    .__header {
      font-size: 26px;
      line-height: 1.6em;
      border-bottom: 1px solid #ddd;
    }
  }


</style>
