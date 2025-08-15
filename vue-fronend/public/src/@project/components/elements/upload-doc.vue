<template>

  <div>

    <div v-if="label" class="q-mb-sm text-bold">
      {{ label }}:
    </div>

    <div class="q-mb-sm text-grey-7 s-font-sm" @dblclick="downloadPdfActive=true">
      <div>{{ compRestrictionsLabel }}</div>
    </div>

    <div v-if="false && downloadPdfActive" class="q-my-sm">
      <a :href="pdfUrl" class="text-primary underline" target="_blank">скачать в PDF</a>
    </div>

    <div class="">

      <div v-if="valueData.length" class="q-mt-sm q-mb-md" style="vertical-align: middle">

        <div v-for="file of valueData" class="c-file flex no-wrap items-center q-my-md">

          <q-icon class="q-mr-sm" name="far fa-file"/>

          <a
              :href="'/api//file/download?id='+file._id" class="text-primary c-file-link"
              style="text-decoration: underline"
              target="_blank"
          >
            <span>{{ file.originalname }}</span>
          </a>

          <q-btn
              v-if="!readonly"
              :icon="$icons.trush"
              class="text-weight-bold q-ml-sm"
              color="red"
              dense
              flat
              size="sm"
              @click.stop.prevent="onClickRemove(file)"
          />

        </div>

      </div>

      <q-uploader
          v-if="!readonly && (multiple || !valueData.length)"
          ref="uploader"
          :accept="compAccept"
          :factory="factoryFn"
          :filter="filterFiles"
          :form-fields="compFormFields"
          :max-file-size="compMaxFileSize"
          auto-upload
          class="c-uploader"
          field-name="file"
          no-thumbnails
          @rejected="onRejected"
          @removed="onRemoved"
          @uploaded="onUpload"
          :multiple="multiple"
      >
        <template v-slot:list="scope">
        </template>

        <template v-slot:header="scope">

          <div class="flex">

            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner"/>

            <q-btn
                class="q-pa-none"
                color="secondary"
                dense
                outline
                type="a"
                icon="add_box"
            >

               <span class="q-ml-sm q-mr-sm">
                  выбрать файлы
               </span>

              <q-uploader-add-trigger/>

            </q-btn>

          </div>

        </template>

      </q-uploader>


    </div>

  </div>

</template>

<script>
import generateDownloadPdfUrl from '@project/lib/generateDownloadPdfUrl'

export default {
  components: {},
  props: {
    buttonLabel: {},
    value: {},

    relDocType: {},
    relDocId: {},
    relDocPath: {},

    accept: {},
    maxFileSize: {default: 20000000},
    label: {},
    readonly: {},

    url: {
      default: '/api/order/upload'
    },

    multiple: {default: true}
  },
  data() {
    return {
      valueData: this.prepareValueInput(this.value),
      downloadPdfActive: false
    }
  },
  watch: {
    valueData(val) {
      this.$emit('input', val.map((item) => item._id))
    },
    value(val) {
      //this.valueData = this.$util.base.cloneDeep(val || [])
    }
  },
  methods: {

    prepareValueInput(val) {
      let cval = this.$util.base.cloneDeep(val || [])
      if (!Array.isArray(cval)) {
        cval = [cval]
      }
      return cval
    },

    onRejected(rejectedEntries) {

      rejectedEntries.forEach((item) => {
        switch (item.failedPropValidation) {
          case "max-file-size":
            this.$bus.emit('processMessage', {
              message: 'Файл "' + item.file.name + '" превышает максимальный размер в ' + this.maxFileSizeText
            })
            break;
        }
      })

    },

    clear() {
      this.valueData = []
    },

    factoryFn(files) {
      // returning a Promise

      return new Promise((resolve) => {
        // simulating a delay of 2 seconds
        //setTimeout(() => {
        resolve({
          url: this.url
        })
        //}, 1000)
      })
    },

    async onClickRemove(item) {

      if (this.relDocPath) {
        this.$q.dialog({
          title: 'Подтвердите удаление',
          message: 'Вы действительно хотите удалить файл?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          // scope.removeFile(file)
          try {
            await this.$api.post('/order/file-delete', {
              relDocPath: this.relDocPath,
              fileId: item._id
            })

          } catch (e) {
            console.log(e)
          }

          this.valueData = this.valueData.filter((file) => file._id !== item._id)

        })
      } else {
        // scope.removeFile(file)
      }


    },

    onRemoved(files) {
      this.valueData = this.valueData.filter((item) => {
        return !files.find(file => file.res._id == item._id)
      })
    },

    onUpload(info) {
      console.log(info)
      info.files.map((file) => {
        file.res = JSON.parse(info.xhr.response)
        return file.res
      }).filter((item) => item).forEach((item) => {
        this.valueData.push(item)
      })
    },

    filterFiles(files) {
      return files.filter(file => {
        return true
      })
    }

  },
  mounted() {

  },
  computed: {

    pdfUrl() {
      return generateDownloadPdfUrl(this.valueData)
    },

    compRestrictionsLabel() {

      let parts = [];

      if (this.accept)
        parts.push('формат файлов: ' + this.accept.split(', ').map(item => item.replace(/\./, '').toUpperCase()).join(', '))

      if (this.maxFileSize)
        parts.push('макс. размер: ' + this.maxFileSizeText)

      return parts.join('; ')
    },

    maxFileSizeText() {
      return Math.round(this.maxFileSize / 1000000) + 'MB'
    },

    compAccept() {
      return this.accept || ''
    },

    compMaxFileSize() {
      return this.maxFileSize
    },

    compFormFields() {
      return [
        {name: 'relDocType', value: this.relDocType || ''},
        {name: 'relDocId', value: this.relDocId || ''},
        {name: 'relDocPath', value: this.relDocPath || ''},
        {name: 'multiple', value: true},
      ]
    }

  }
}
</script>


<style lang="scss" scoped>

.c-uploader {
  background-color: transparent;
  max-height: 250px;
  max-width: none;
  width: auto;
  display: inline-block;
  box-shadow: none;

  /deep/ .q-uploader__header {
    &:before {
      display: none;
    }

    background-color: transparent;
    box-shadow: none;
    color: #222;
  }

  /deep/ .q-uploader__list {
    padding: 0px;
    min-height: auto;
  }

}


</style>
