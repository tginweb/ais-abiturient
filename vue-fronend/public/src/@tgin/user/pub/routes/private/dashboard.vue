<template>

  <CPage
      :header="$q.screen.gt.md"
      :path="pagePathFull"
      v-if="isMounted"
  >
    <div class="holder">


      <CCard v-if="$q.screen.lt.lg && false" class=" bg-white q-px-md q-py-md q-mb-sm q-pa-lg-none "/>

      <div class="q-pa-md q-pa-lg-none">

        <div class="c-sections row q-col-gutter-md q-col-gutter-md-lg">

          <template v-for="(section, sectionIndex) of sectionsComp">
            <user-profile-widget v-bind="section" :key="sectionIndex">

              <template v-slot:content v-if="section.slots && section.slots.content">
                <component :is="section.slots.content"/>
              </template>

            </user-profile-widget>
          </template>

        </div>

      </div>

    </div>


  </CPage>

</template>

<script>
import CPage from "../../component/profile/page"
import MRoute from "../../component/profile/route.mixin"
import CCard from "../../component/profile/shared/card"

export default {
  mixins: [MRoute],
  components: {
    CPage,
    CCard
  },
  data() {
    return {
      page: {
        title: 'Личный кабинет'
      },
      isMounted: false,

      sections: []
    }
  },
  created() {


  },
  computed: {
    pagePath() {
      return []
    },
    menu() {
      return this.$store.getters['menu/menusItems']['personal'] || []
    },

    sectionsComp() {
      return this.$store.getters['storeMap']('widgets', [])
    },
  },
  mounted() {
    this.isMounted = true
  },
  methods: {}
}
</script>
<style lang="scss" scoped>

.holder {
  background-color1: #F8F5F2;
}

.c-block {
  height: 100%;

  .c-block__inner {
    background-color: #fff;

    &.--padded {
      padding1v: 12px;
    }
  }

  .c-block__header {

    margin-bottom: 8px;

    .c-block__header__title {
      a {
        text-decoration: none;
        color: #222;
      }
    }

  }

}

.c-section {

  &:not(:last-child) {
    margin-bottom: 24px;
  }

  .c-section__header {

  }

  .c-section__body {

  }
}


.c-menu__item {
  padding: 10px 0 10px 0;
}


</style>
