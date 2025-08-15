<template>

  <div v-bind="bind" @click="onClick">

    <div v-bind="bindInner">

      <div class="c-main">

        <div class="c-header row no-wrap items-center q-col-gutter-md q-col-gutter-md-lg ">

          <div
              class="c-title col-shrink q-mr-auto"
              v-if="title || $slots.title"
              :class="{

              }"
          >

            <slot name="title" v-if="$slots.title"/>

            <template v-else>

              <div v-if="title" class="c-title s-font-md s-font-md-lg s-font-lg-lg s-font-xl-xl text-weight-bold">
                {{ title }}
              </div>

              <div v-if="subtitle" class="c-subtitle s-font-sm s-font-md-md -text-weight-bold">
                <router-link v-if="subtitleLink" :to="subtitleLink" class="s-link">{{ subtitle }}</router-link>
                <span v-else>{{ subtitle }}</span>
              </div>

            </template>

          </div>

          <div
              class="c-media col-auto"
              v-if="haveMediaText || mediaIcon || $slots.icon"
              :class="{
                'order-first': mediaLeft
              }"
          >

            <slot name="media" v-if="$slots.media"/>

            <component
                v-else
                show-value
                :value="100"
                :size="mediaSizeComp"
                :thickness="mediaBorderThickness"
                :color="mediaBorderColor"
                track-color="primary"
                :is="$q.screen.gt.md ? 'q-circular-progress' : 'div'"
            >
              <div
                  :class="{
                    [mediaTextClass]: true,
                    ['text-'+mediaColor]: true
                  }"
                  v-if="haveMediaText"
              >
                {{ mediaText }}
              </div>

              <q-icon
                  v-if="mediaIcon"
                  :name="mediaIcon"
                  :size="mediaSizeComp"
                  :color="mediaColor"
              />

            </component>

          </div>

          <div v-if="headerMoreLink">
            <q-btn
                :label="$q.screen.gt.md ? headerMoreLink.label : null"
                :to="headerMoreLink.to"
                class="c-header-more-link"
                color="primary"
                :icon-right="$icons.chevronRight"
                flat
                dense
            />
          </div>

        </div>

        <div class="c-content q-mt-sm" v-if="content || $slots.content">

          <slot name="content" v-if="$slots.content"/>

          <div v-else class="s-font-md">
            {{ content }}
          </div>

        </div>

      </div>

      <div class="c-bottom q-mt-auto q-pt-sm" v-if="fields || $slots.bottomText || bottomText">

        <ui-data-fields
            :value="fields"
            v-if="fields"
            breakpoint="sm"
            label-width="63px"
        />

        <slot name="bottom" v-if="$slots.bottomText"/>

        <div v-else-if="bottomText" class="c-bottom-text s-font-lg text-grey-7">
          {{ bottomText }}
        </div>

      </div>

    </div>

  </div>

</template>

<script>


export default {
  props: {
    colClass: {},
    order: {},

    title: {},
    subtitle: {},
    subtitleLink: {},

    content: {},
    bottomText: {},

    mediaSize: {
      default: () => ({
        xs: '20px',
        sm: '30px',
        md: '40px',
        lg: '55px',
        xl: '70px',
      })
    },

    mediaBorderThickness: {default: 0.08},
    mediaBorderColor: {default: 'primary-light'},

    mediaColor: {default: 'primary'},

    mediaIcon: {},
    mediaIconSize: {default: ''},
    mediaIconClass: {default: 's-font-5xl'},

    mediaText: {},
    mediaTextClass: {default: 's-font-md s-font-md-md s-font-xl-lg text-weight-bold'},

    theme: {default: 'mini'},
    layoutClass: {},
    link: {},
    headerMoreLink: {},

    fields: {},

    mediaLeft: {}
  },

  data() {
    return {
      isMounted: false,
    }
  },
  mounted() {
    this.isMounted = true
  },
  computed: {

    haveMediaText() {
      return this.mediaText || this.mediaText === 0
    },

    mediaBorderThicknessComp() {
      return this.$q.screen.gt.md ? this.mediaBorderThickness : 0
    },

    mediaSizeComp() {
      if (typeof this.mediaSize === 'object') {
        return this.mediaSize[this.$q.screen.name]
      } else {
        return this.mediaSize
      }
    },

    bind() {
      const res = {
        class: {
          'com-profile-widget': true,
          'col-24 col-md-12 col-lg-8': !this.colClass,
          [this.colClass]: true,
        },
        style: {

        }
      }

      res.class['theme-' + this.theme] = true

      return res
    },

    bindInner() {
      const res = {
        class: {
          'c-inner': true,
          'self-stretch full-height flex-xl column-xl': true,
          'cursor-pointer': this.link
        },
        style: {

        }
      }

      if (this.layoutClass) {
        res.class[this.layoutClass] = true
      } else {
        res.class['q-px-md q-py-md q-px-md-md q-py-md-md q-px-lg-lg q-py-lg-lg'] = true
      }

      return res
    }
  },
  methods: {
    onClick() {
      if (this.link) {
        this.$router.push(this.link)
      }
    }
  }
}

</script>

