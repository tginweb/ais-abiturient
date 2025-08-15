<template>

  <div class="com" v-if="valMessages.length">

    <q-banner
        :key="index"
        v-bind="bindItem(item)"
        v-for="(item, index) in valMessages"
        class="__item"
        inline-actions
    >
      <template v-slot:avatar>
        <q-icon
            v-bind="bindItemIcon(item)"
            size="20px"
        />
      </template>

      <template v-if="Array.isArray(item.message)">

        <ul class="__item-rows q-ma-none">
          <li
              v-for="(messageRow, messageRowIndex) of item.message"
              :key="messageRowIndex"
              class="q-mb-sm"
          >
            <template v-if="typeof messageRow == 'object'">
              {{ messageRow[tLang] }}
            </template>
            <template v-else>
              {{ messageRow }}
            </template>

          </li>
        </ul>

      </template>
      <template v-else>

        <template v-if="typeof item.message == 'object'">
          {{ item.message[tLang] }}
        </template>
        <template v-else>
          {{ item.message }}
        </template>

      </template>

      <template v-slot:action v-if="item.actions">
        <q-btn
            v-bind="bindItemAction(item, action)"
            unelevated
            size="md"
            v-for="(action, index) of item.actions"
            :key="index"
        />
      </template>

    </q-banner>

  </div>

</template>

<script>

export default {
  props: {
    alertClass: {
      default: () => {
        return {}
      }
    },
    messages: {},
    type: {},
    messageClass: {},
    outlined: {}
  },
  data() {
    return {
      valMessages: this.prepareMessages(this.messages || []),
      schema: {
        error: {
          class: 'text-white bg-red',
          classOutline: 'text-red',
          icon: this.$icons.fasExclamationTriangle,
          iconColor: 'white',
          iconColorOutline: 'red',
        },
        success: {
          class: 'text-white bg-green',
          classOutline: 'text-green',
          icon: this.$icons.fasCheck,
          iconColor: 'white',
          iconColorOutline: 'green',
        },
        warning: {
          class: 'text-white bg-yellow-8',
          classOutline: 'text-yellow-8',
          icon: this.$icons.fasExclamationTriangle,
          iconColor: 'white',
          iconColorOutline: 'yellow-8',
        },
      }
    }
  },

  watch: {
    messages(val) {
      this.valMessages = this.prepareMessages(val);
    }
  },
  methods: {

    prepareMessages(items) {
      return items.map((item) => {
        return typeof item === 'string' || Array.isArray(item) ? {
          message: item,
          type: this.type
        } : item
      })
    },

    bindItem(message) {
      let res = {
        class: {
          '__item': true,
          'q-mb-md q-pa-md': true
        }
      }

      let typeInfo = this.schema[message.type || this.type]

      if (this.outlined) {
        res.class['--outlined'] = true
        res.class[typeInfo.classOutline] = true
      } else {
        res.class['--outlined'] = true
        res.class[typeInfo.class] = true
      }

      if (this.messageClass) {
        res.class[this.messageClass] = true
      }

      return res
    },

    bindItemIcon(message) {
      let res = {}
      let typeInfo = this.schema[message.type || this.type]

      res.name = typeInfo.icon

      if (this.outlined) {
        res.color = typeInfo.iconColorOutline

      } else {
        res.color = typeInfo.iconColor
      }

      return res
    },

    bindItemAction(message, action) {
      let res = {}
      let typeInfo = this.schema[message.type || this.type]

      res.name = typeInfo.icon

      if (this.outlined) {
        res.color = 'primary'
      } else {
        res.color = 'white'
        res.outline = true
      }

      res = {
        ...res,
        ...action
      }

      return res
    },

    setMessages(data) {
      this.valMessages = this.prepareMessages(data || [])
    },
  }
}

</script>

<style lang="scss" scoped>

.com {
  .__item {
    /deep/ {
      .q-banner__content {
        font-size: 17px;
      }
    }

    &.--outlined {
      border: 1px solid currentColor;
    }
  }

  .__item-rows {
    li:last-child {
      margin-bottom: 0;
    }
  }
}

</style>
