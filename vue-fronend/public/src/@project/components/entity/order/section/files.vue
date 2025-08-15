<template>

  <div class="com s-info-section">

    <div class="__header">Файлы документов</div>


    <q-tree
        ref="tree"
        :nodes="orderData.allFiles"
        class="c-tree"
        default-expand-all
        label-key="title"
        node-key="path"
    >
      <template v-slot:default-header="prop">

        <component
            :is="getNodeUrl(prop.node) ? 'a':'span'"
            :href="getNodeUrl(prop.node)"
            class="c-node"
            @click="onClickNode($event, prop.node)"
        >

          {{ getNodeTitle(prop.node) }}

        </component>

      </template>

    </q-tree>

  </div>

</template>

<script>
import generateDownloadPdfUrl from '@project/lib/generateDownloadPdfUrl'

export default {
  components: {},
  props: {
    order: {},
    mode: {default: 'public'}
  },
  data() {
    return {
      orderData: this.order,
    }
  },
  methods: {

    getNodeUrl(node) {

      if (node.type === 'field') {

        if (node.children && this.mode === 'admin') {
          return generateDownloadPdfUrl(node.children)
        }

        if (node.fileDoc) {
          return '/api/file/download?id=' + node.fileDoc._id
        }

      } else if (!node.type) {
        return '/api/file/download?id=' + node._id
      }
    },

    getNodeTitle(node) {

      if (node.type === 'field') {
        if (node.term) {
          return this.$store.getters[node.term.getter][node.term.id] && this.$store.getters[node.term.getter][node.term.id].name
        }
        return node.title
      } else if (node.type === 'group') {
        return node.title
      } else {
        return node.originalname
      }

    },

    onClickNode(e, item) {


      const url = this.getNodeUrl(item)

      if (url) {
        e.stopPropagation()
        e.preventDefault()

        var link = window.document.createElement("a");
        link.href = url;
        link.target = '_blank'
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
      }

    }
  },
  watch: {
    order(val) {
      this.orderData = val
    }
  },
}
</script>


<style lang="scss" scoped>

a.c-node {
  text-decoration: underline;
  color: #428bca;
}

</style>
