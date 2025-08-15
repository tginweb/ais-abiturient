<template>
  <div class="com">
    <div class="content" style="">

      <q-scroll-area
          :style="{
            height: scrollHeight + 'px'
          }"
      >
        <div ref="items">

          <q-resize-observer @resize="onResize"/>

          <template v-if="notices.length">
            <notice-entity-item
                v-for="item of notices"
                :key="item.ID"
                :item="item"
                date-class="text-grey-6 s-font-3xs"
                class="q-py-sm q-px-md border-b-1 border-b-last-0 border-primary-brown-gray-1"
                @click.native="$router.push('/personal/notices/' + item.ID)"
            />
          </template>
          <template v-else>
            <div class="q-pa-md">нет новых уведомлений</div>
          </template>

        </div>

      </q-scroll-area>

      <div class="q-pb-md q-pt-sm q-px-md q-gutter-sm text-center" v-if="true">

        <q-btn
            color="primary"
            class="full-width"
            label="пометить как прочитанные"
            outline
            size="14px"
            to="/personal/notices"
            v-if="$store.getters['notice_pub/userNoticesUnreadedCount']"
        />

        <q-btn
            color="primary"
            class="full-width"
            label="все уведомления"
            outline
            size="14px"
            to="/personal/notices"
        />

      </div>

    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      scrollHeight: 100
    }
  },
  computed: {

    notices() {
      return this.$store.getters['notice_pub/userNoticesNew']
    }
  },
  methods: {
    onResize() {

      const maxHeight = window.innerHeight - 200;

      let height = this.$refs.items.clientHeight

      if (height > maxHeight) {
        height = maxHeight
      }

      this.scrollHeight = height
    }
  },
  mounted() {

    this.onResize()
  }
}
</script>

<style lang="scss" scoped>

.content {

}

.c-items {
  border: 1px solid #ddd;
}

.c-item {
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
}

.c-summary {
  border: 1px solid #ddd;

  .c-summary__info {
    border-bottom: 1px solid #ddd;
  }

  .c-summary__freedeliver {
    border-bottom: 1px solid #ddd;
  }
}

.c-scroll {

  max-height: 80vh;

  /deep/ {
    .scroll {
      max-height: 80vh;
      height: auto !important;
    }
  }
}
</style>
