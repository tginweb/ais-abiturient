<template>

  <div class="com ">

    <q-tree
        ref="tree"
        :nodes="nodes"
        class="c-tree"
        :default-expand-all="false"
        label-key="title"
        node-key="path"
    >
      <template v-slot:default-header="prop">

        <div
            class="c-node flex items-center"
        >

          <div class="q-mr-sm">
            {{ getNodeTitle(prop.node) }}
          </div>

          <a
              v-if="!!getNodeUrl(prop.node)"
              :href="getNodeUrl(prop.node)"
              class="c-node inline-block"
              @click="onClickNode($event, prop.node)"
              style="text-decoration: none; vertical-align: bottom"
          >
            <q-icon :name="$icons.fasDownload" size="16px" class="q-mr-sm"/> <span v-if="prop.node.type==='field'">PDF</span>
          </a>

        </div>

      </template>

    </q-tree>

  </div>

</template>

<script>
import generateDownloadPdfUrl from '@project/lib/generateDownloadPdfUrlOld'

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

      const pref = 'http://acpi-res.cis.istu.edu'

      if (node.type === 'field') {

        if (node.children) {
          return pref + generateDownloadPdfUrl(node.children)
        }

        if (node.fileDoc) {
          return pref + '/api/file/download?id=' + node.fileDoc._id
        }

      } else if (!node.type) {
        return pref + '/api/file/download?id=' + node._id
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
        return node.nid + '.' + node.originalname.split('.').pop()
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
  computed: {
    nodes() {
      return this.orderData.allFiles.filter(item => {
        if (item.disable && (!item.file || Array.isArray(item.file) && !item.file.length)) {
          return false
        }

        return true
      })
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

.c-tree {
  /deep/ .q-tree__node-header {
    padding-top: 6px;
  }
}

</style>
