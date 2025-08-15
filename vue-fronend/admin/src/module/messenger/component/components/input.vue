<template>

  <div class="com q-pa-lg">

    <div class="row items-start1 no-wrap q-col-gutter-lg">

      <div class="col-grow">

        <q-input
          v-model="valueData.text"
          class="bg-white"
          input-class="q-pa-sm"
          outlined
          input-style="height: 100px;"
          type="textarea"
        />

      </div>

      <div class="col-shrink">

        <q-btn
          block
          class="c-send ma-0 fit"
          color="primary"
          @click="onSubmit"
        >
          Отправить
        </q-btn>

      </div>

    </div>

    <div v-if="false" class="q-mt-sm">
      <el-upload-docs
        ref="files"
        v-model="valueData.files"
        buttonLabel="Прикрепить файлы"
        url="/api/order/upload-chat"
      ></el-upload-docs>
    </div>

  </div>

</template>
<script>

export default {
  components: {},
  props: {
    value: {},
    placeholder: {},
    sending: {},
  },
  data() {
    return {
      valueData: this.$util.base.cloneDeep(this.value),
      send: false,
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.valueData)
    },
  },
  watch: {

    valueData: {
      handler: function (val) {
        this.$emit('input', val)
      },
      deep: true
    },
    value: {
      handler: function (val) {
        this.valueData = val
      },
      deep: true
    },
  },


}
</script>

<style lang="scss" scoped>

.c-uploader {
  /deep/ {
    .q-uploader__header {
      background-color: #fff;
      color: #111;
    }
  }
}

</style>
