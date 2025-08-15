<template>

  <component
      v-model="visible"
      v-bind="bindRouterWrapper"
      :loading="fetching"
      title="Загрузка АИС заявлений"
      @hide="onHide"
      dialogWidth="450px"
      :tabs="modesTabs"
      :tab.sync="modeId"
  >
    <template v-slot:default>

      <q-tab-panels v-model="modeId" animated>

        <q-tab-panel class="q-px-none" name="upload">

          <q-file
              v-model="file"
              @input="onFileInput"
              label="Файл"
              filled
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="input">

          <q-input
              v-model="text"
              type="textarea"
              rows="6"
          />

        </q-tab-panel>

        <q-tab-panel class="q-px-none" name="upload">


        </q-tab-panel>

      </q-tab-panels>



    </template>

  </component>

</template>

<script>

import MVroute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MVroute],
  props: {
  },
  components: {

  },
  data() {
    return {
      file: null,
      text: null,
      modeId: 'upload'
    }
  },
  computed: {
    modes() {
      return [
        {type: 'tab', id: 'upload', label: 'Файл'},
        {type: 'tab', id: 'input', label: 'Текст'},
      ]
    },

    actions() {
      return [
        {
          label: 'Загрузка',
          callback: this.onSubmit
        }
      ]
    }
  },
  methods: {
    onSubmit() {

    },
    onFileInput() {
        this.processFile()
    },
    async processFile() {
      try {
        let contentBuffer = await this.$util.base.readFile(this.file, 'readAsText');
        this.text = contentBuffer
      } catch(err) {
        console.log(err);
      }
    }
  }
}

</script>

<style lang="scss" scoped>


</style>
