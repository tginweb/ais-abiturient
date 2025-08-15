<template>
  <component
      v-bind="bind"
      @hide="onHide"
  >

    <template v-slot:default v-if="entity">

      <div
          class="c-body row no-wrap"
          style=""
          :class="isMobile ? 'mobile':'desktop'"
      >

        <div
            class="col-7 q-pr-md q-pt-lg"
            v-if="!isMobile"
            style="border-right: 2px solid #eee; min-height:90vh;"
        >

          <div
              v-for="item of orderElements"
              :key="item.element.ID"
              class="row q-col-gutter-xs border-b-1 border-dark q-mb-md"
          >
            <div class="col-14">
              {{ item.element.NAME }}
            </div>
            <div class="col-5 text-weight-bold text-no-wrap">
              {{ $util.format.price(item.element.PRICE.PRICE) }}
            </div>
            <div class="col-3 text-primary text-no-wrap">
              x {{ item.quantity }}
            </div>
            <div class="col-2">
              <q-btn
                  flat
                  dense
                  size="14px"
                  icon="close"
                  color="dark"
                  @click="onMinus(item.sectionId, item.element)"
              />
            </div>
          </div>

          <q-btn
              label="Далее"
              class="full-width"
              @click="onNextSection"
          />

          <q-btn
              label="В корзину"
              class="full-width"
              @click="onBasketAdd"
          >
            <q-tooltip v-if="orderErrors.length">
              {{ orderErrors.join(', ') }}
            </q-tooltip>
          </q-btn>

        </div>
        <div
            :class="{
               'col-17 q-pl-md q-pt-lg q-pb-lg': !isMobile,
               'col-24': isMobile
            }"
        >
          <q-list class="c-sections rounded-borders">


            <q-expansion-item
                class="c-section"
                :label="section.NAME"
                v-for="(section, index) of sections"
                :key="section.ID"
                :default-opened="!isMobile"
                @show="currentSection = section"
                :group="isMobile ? 'sections':null"
                header-class="items-center"
                v-bind="bindSection(section)"
            >
              <template v-slot:header>

                <div class="s-font-xl text-weight-bold q-mr-auto">{{ section.NAME }}</div>

                <q-badge
                    color="red"
                    v-if="orderSectionsById[section.ID].required && showSectionError && (showSectionError === section.ID || currentSectionIndex > index)"
                    class="s-font-md q-py-xs q-mr-md"
                >
                  обязательно
                </q-badge>

              </template>

              <q-card>
                <q-card-section>

                  <div class="row q-col-gutter-lg">

                    <div
                        class="col-12 col-md-4"
                        v-for="element of section.ELEMENTS"
                        :key="element.ID"
                    >

                      <catalog-constructor-product
                          :entity="element"
                          :section="section"
                          @select="onSelect(section.ID, element)"
                          @minus="onMinus(section.ID, element)"
                          :quantity="order[section.ID][element.ID]"
                      />

                    </div>

                    <div
                        v-if="index === 0 && orderSectionsById[section.ID] && orderSectionsById[section.ID].selected.length"
                        class="col-8"
                    >

                      <div
                          v-for="item of orderSectionsById[section.ID].selected"
                          :key="item.element.ID"
                      >
                        <div class="text-weight-bold">
                          {{ item.element.NAME }}
                        </div>
                        <div class="q-mt-sm">
                          {{ item.element.PREVIEW_TEXT }}
                        </div>
                      </div>

                    </div>

                  </div>

                </q-card-section>
              </q-card>
            </q-expansion-item>

          </q-list>

        </div>
      </div>

    </template>

    <template v-slot:header-side v-if="isMobile">
      <q-btn
          label="Далее"
          class="q-ml-auto --normal"
          @click="onNextSection"
          dense
          outline
          color="primary"
          size="14px"
      />
    </template>

    <template v-slot:bottom v-if="isMobile">

      <div class="flex items-center leading-none q-mb-md">

        <div class="c-summary-title text-weight-bold">Итого</div>

        <div class="c-summary-price text-weight-bold s-font-2xl text-weight-bold q-ml-auto">
          300
        </div>

      </div>

    </template>

  </component>
</template>

<script>
import MVRoute from '@tgin/main/router/mixin/vroute'
import generateQueryInfo from "@tgin/main/graphql/lib/generate-query-info"

export default {
  mixins: [MVRoute],
  components: {},
  apollo: {
    entity: generateQueryInfo(
        'entity',
        require('../gql/query/constructor.gql'),
        {},
        {
          resPath: 'entity',
          varPath: 'entityQueryVars',
          statePath: 'entityQueryState'
        }
    ),
  },
  props: {
    iblock: {},
    sectionCode: {}
  },
  data() {
    return {
      page: {
        title: 'Секция'
      },
      entity: null,
      entityQueryState: {
        isLoading: false,
        skip: false,
        error: null
      },
      order: {},
      currentSection: null,
      showSectionError: false
    }
  },
  created() {

  },
  inject: {
    layout: {}
  },

  computed: {

    bind() {
      if (this.vrouterType === 'dialog') {
        return {
          ...this.bindRouterWrapper,
          ...{
            'dialog-width': "850px",
            'sheet-max-height': "94vh",
            'title': this.pageTitle,
            'sheet-body-class': "q-px-none c-body mobile",
            'sheet-header-class': "q-pb-sm q-pt-md",
          }
        }
      } else {
        return {
          is: 'tpl-page-view-common',
          title: this.pageTitle,
          'header-class': 'q-mb-none q-mb-md-none',
          class: 'c-body desktop'
        }
      }
    },

    pageTitle() {
      return this.entity && this.entity.NAME
    },

    orderValid() {
      return !this.orderErrors.length
    },

    orderErrors() {
      return this.orderSections.filter(item => item.required).map(item => 'Выбери ' + item.section.NAME)
    },

    currentSectionIndex() {
      return this.sections.indexOf(this.currentSection)
    },

    isMobile() {
      return this.$q.screen.lt.md
    },

    orderSectionCurrent() {
      return this.currentSection && this.orderSectionsById[this.currentSection.ID]
    },

    orderSections() {
      let index = 0
      return this.sections.reduce((map, section) => {

        const elements = Object.keys(this.order[section.ID] || {}).reduce((emap, elementId) => {
          const quantity = this.order[section.ID][elementId]
          if (quantity)
            emap.push({
              sectionId: section.ID,
              quantity: quantity,
              element: this.elementsIndexed[elementId]
            })
          return emap
        }, [])

        map.push({
          'sectionId': section.ID,
          'section': section,
          'selected': elements,
          'required': !elements.length && section.PROP.REQUIRED.VAL,
          'nextId': this.sections[index + 1] ? this.sections[index + 1].ID : null
        })

        index++

        return map
      }, [])
    },

    orderSectionsById() {
      return this.orderSections.reduce((map, section) => {
        map[section.sectionId] = section
        return map
      }, {})
    },

    orderElements() {
      return this.orderSections.reduce((map, section) => {
        Array.prototype.push.apply(map, section.selected)
        return map
      }, [])
    },

    sections() {
      return this.entity && this.$store.getters['iblock/prepareSections'](this.entity.CHILDREN)
    },

    sectionsIndexed() {
      return this.sections.reduce((map, section) => {
        map[section.ID] = section
        return map
      }, {})
    },

    elementsIndexed() {
      return this.sections.reduce((map, section) => {
        section.ELEMENTS.forEach(element => {
          map[element.ID] = element
        })
        return map
      }, {})
    },

    entityQueryVars() {

      const filter = {
        WITH_ELEMENT_COUNT: true,
        CNT_ACTIVE: 'Y'
      }

      if (this.sectionId) {
        filter.SECTION_ID = this.sectionId
      } else if (this.sectionCode) {
        filter.CODE_PATH = this.sectionCode
      } else if (this.sectionPath) {
        filter.CODE_PATH = this.sectionPath
      }

      return {
        filter: filter,
      }
    },

    routeEntity() {
      return this.entity
    },

    routeBase() {
      return this.$route.path
    },

    headerTitle() {
      if (this.entity) {
        return this.entity.NAME
      }
    },

    breadcrumbs() {

      let path = [
        {
          label: 'Каталог',
          url: this.$app.getRouteByName('catalog.' + this.iblock + '.index', 'path')
        },
      ]

      return path
    },

  },
  watch: {
    'entity': {
      handler: function (entity) {
        for (const section of entity.CHILDREN) {
          this.$set(this.order, section.ID, {})
        }

        this.$nextTick(() => {
          if (this.sections[0]) {
            this.currentSection = this.sections[0]
          }
        })
      },
      deep: true
    },
    'routeUrl': {
      handler: function (nav) {
        history.pushState({}, '', this.routeUrl)
      },
      deep: true
    },
  },
  methods: {

    bindSection(section) {

      const res = {}

      if (this.isMobile) {
        res.value = this.currentSection === section
      }

      return res
    },

    onBasketAdd() {

      if (!this.orderValid)
        return;

    },

    onNextSection() {

      if (!this.orderSectionCurrent.selected.length && this.orderSectionCurrent.section.PROP.REQUIRED.VAL) {
        this.showSectionError = this.orderSectionCurrent.section.ID
      } else {
        if (this.orderSectionCurrent.nextId) {
          this.currentSection = this.sectionsIndexed[this.orderSectionCurrent.nextId]
        }
      }
    },

    onSelect(sectionId, element) {

      const section = this.sectionsIndexed[sectionId]

      if (typeof this.order[sectionId][element.ID] === 'undefined') {
        this.$set(this.order[sectionId], element.ID, 0)
      }

      let currentCount = this.order[sectionId][element.ID]

      if (section.PROP.MULTIPLE.VAL) {
        currentCount++
      } else {
        for (const elementId in this.order[sectionId]) {
          this.order[sectionId][elementId] = 0
        }
        currentCount = 1
      }

      this.order[sectionId][element.ID] = currentCount
    },

    onMinus(sectionId, element) {
      const section = this.sectionsIndexed[sectionId]

      if (this.order[section.ID][element.ID]) {
        this.order[section.ID][element.ID]--
      }
    },
  },
}
</script>
<style lang="scss" scoped>

.c-sections {
  /deep/ {
    .q-item__section--avatar {
      min-width: auto;
    }

    .q-item__label {
      font-size1: 21px;
    }

    .q-item {
      z-index: 1;
      position: sticky;
      top: 0;
      background-color: #fff;
    }
  }
}


.c-body {
  &.mobile {
    .c-section {
      border-bottom: 4px solid #eee;
      padding-bottom: 5px;
    }
  }
}


</style>
