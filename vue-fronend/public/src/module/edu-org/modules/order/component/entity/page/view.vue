<template>

  <div style="max-width: 1050px;">


    <div class="q-mb-xl" v-if="orderFacs.length">

      <el-page-header title="Факультеты / институты"/>

      <div class="c-section s-info-section">

        <q-list separator class="">
          <q-item
              class="q-px-none q-py-md items-start"
              v-for="(item, index) of orderFacs"
              :key="index"
          >
            <q-item-section >
              <div class="row no-wrap-md q-col-gutter-sm q-col-gutter-md-md">
                <div class="col-24 col-md-shrink q-mr-auto text-weight-bold">
                  {{ item.name }}
                </div>
                <div class="col-24 col-md-auto text-right">
                  <div>
                    +7 (3952) {{item.phones.map(phone => phone).join(', ')}}
                  </div>

                  <a :href="'mailto:'+item.email">{{ item.email }}</a>
                </div>
              </div>

            </q-item-section>

          </q-item>
        </q-list>

      </div>

    </div>

    <el-page-header title="Ваше заявление"/>

    <div class="row q-col-gutter-x-xl q-col-gutter-y-lg q-mb-lg">

      <div class="col-24 col-lg-11">
        <COrderSectionOrder :order="order"></COrderSectionOrder>
        <COrderSectionPersonal :order="order"></COrderSectionPersonal>
        <COrderSectionEducation :order="order"></COrderSectionEducation>
        <COrderSectionAddress :order="order"></COrderSectionAddress>
        <COrderSectionOther :order="order"></COrderSectionOther>

      </div>

      <div class="col-24 col-lg-13">

        <COrderSectionApplications :order="order"></COrderSectionApplications>
        <COrderSectionSubjects :order="order"></COrderSectionSubjects>
        <COrderSectionAchievements :order="order"></COrderSectionAchievements>
        <COrderSectionQuotes :order="order"></COrderSectionQuotes>
        <COrderSectionFiles :order="order"></COrderSectionFiles>

      </div>

    </div>

  </div>

</template>

<script>
import * as sections from '@project/components/entity/order/section'

export default {
  components: {
    ...sections
  },
  props: {
    value: {}
  },
  data() {
    return {
      step: null,
      loaded: false
    }
  },
  watch: {},
  async created() {
    await this.$store.dispatch('edu_order/userOrderFetch')
    this.loaded = true
  },
  computed: {

    facs() {
      return {
        33: {
          name: 'Институт авиамашиностроения и транспорта',
          phones: ['40-55-88'],
          email: 'pk-iamit@istu.edu'
        },
        45: {
          name: 'Институт архитектуры, строительства и дизайна',
          phones: ['40-55-86', '40-55-95'],
          email: 'pk-iasid@istu.edu'
        },
        43: {
          name: 'Институт высоких технологий',
          phones: ['40-55-80', '40-55-81'],
          email: 'pk-ivt@istu.edu'
        },
        15: {
          name: 'Институт заочно-вечернего обучения',
          phones: ['40-55-84'],
          email: 'pk-izvo@istu.edu'
        },
        46: {
          name: 'Институт информационных технологий и анализа данных',
          phones: ['40-55-82'],
          email: 'pk-itiad@istu.edu'
        },
        34: {
          name: 'Институт недропользования',
          phones: ['40-55-91'],
          email: 'pk-in@istu.edu'
        },
        36: {
          name: 'Институт экономики, управления и права',
          phones: ['40-55-83'],
          email: 'pk-ieuip@istu.edu'
        },
        38: {
          name: 'Институт энергетики',
          phones: ['40-55-87'],
          email: 'pk-ie@istu.edu'
        },
        55: {
          name: 'Аспирантура',
          phones: ['40-50-21', '40-59-86'],
          email: 'aspirantura@ex.istu.edu'
        },
        50: {
          name: 'Байкальский институт БРИКС',
          phones: ['40-54-40'],
          email: 'brics@istu.edu'
        },
        //mag: {name: 'Магистратура', phones: ['40-55-90'], email: 'pk-mag@istu.edu'},
        asp: {
          name: 'Аспирантура',
          phones: ['40-50-21', '40-59-86'],
          email: 'aspirantura@ex.istu.edu'
        },
        spo: {
          name: 'Факультет среднего профессионального образования ',
          phones: ['40-55-85'],
          email: 'pk-fspo@istu.edu'
        },
      }
    },

    orderFacIds() {
      if (this.order.eduTypeSlug === 'spo')
        return ['spo']

      if (this.order.eduTypeSlug === 'asp')
        return ['asp']

      return Object.values(this.order.applications.items.reduce((map, item) => {
        if (item.admission && item.admission.cfac) {
          map[item.admission.cfac] = item.admission.cfac
        }
        return map
      }, {}))
    },

    orderFacs() {
      return this.orderFacIds.map(id => this.facs[id]).filter(item => !!item)
    },

    order() {
      return this.$store.getters['edu_order/userOrder']
    },

    bindStatus() {
      let res = {
        class: {},
        style: {}
      }
      let statusInfo = this.order.state.statusInfo

      if (statusInfo) {
        res.style.backgroundColor = statusInfo.bgColor
        res.style.color = statusInfo.textColor
      }

      return res
    },

  }
}
</script>


<style lang="scss" scoped>


</style>
