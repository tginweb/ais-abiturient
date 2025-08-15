<template>

  <div>

    <div class="flex q-mb-sm">

      <q-btn
        @click="onMessagesRead"
        label="отметить сообщения от абитуриента как прочитанные"
        color="primary"
        outline
        class=""
        dense
      />

    </div>

    <q-card
      ref="holder"
      bordered
      class="my-card"
      flat
    >
      <q-scroll-area ref="scrollArea" :style="{height: scrollHeight}">

        <q-card-section>

          <chat-messages
            :context="context"
            :messages="messagesData"
            class="c-messages"
          />

        </q-card-section>

      </q-scroll-area>

      <div ref="footer">

        <chat-input
          ref="chatInput"
          v-model="inputValue"
          class="c-input"
          @submit="onInputSubmit"
        ></chat-input>

      </div>

    </q-card>

  </div>

</template>
<script>

import ChatMessages from "./components/messages";
import ChatInput from "./components/input";

export default {
  components: {
    ChatMessages,
    ChatInput
  },
  props: {
    value: {type: Object},
    messages: {},
    chatId: {},
    scrollHeight: {},
    context: {default: 'company'},
  },
  data() {
    return {
      inputValue: {
        text: '',
        haveFiles: false,
        files: []
      },
      inputParams: {
        type: 'text'
      },
      sending: false,
      messagesMode: false,
      messagesData: this.$util.base.cloneDeep(this.messages)
    }
  },
  mounted() {
    this.scrollBottom();
  },
  watch: {
    messages: {
      handler: async function () {
        this.messagesData = this.$util.base.cloneDeep(this.messages)
        this.scrollBottom();
      },
      deep: true
    },
  },
  computed: {


  },
  methods: {

    async scrollBottom() {
      this.$nextTick(async () => {
        this.$refs.scrollArea.setScrollPosition(100000);
      })
    },

    resetInput() {
      this.inputValue = {
        text: '',
        haveFiles: false,
        files: []
      }
      // this.$refs.chatInput.$refs.files.clear()
    },

    async onMessagesRead() {
      try {
        let {data} = await this.$apollo.mutate({
          mutation: require('../gql/mutation/admin_read.gql'),
          variables: {
            chatId: this.chatId
          }
        })
      } catch (e) {
        console.log(e)
      }
    },

    async onInputSubmit(msg) {

      try {
        let {data: {res: {result}}} = await this.$apollo.mutate({
          mutation: require('../gql/mutation/admin_send.gql'),
          variables: {
            chatId: this.chatId,
            data: msg
          }
        })

        this.resetInput();

        this.$emit('submit', msg)

        this.$bus.emit('processMessages', result.messages);

      } catch (e) {
        console.log(e)
      }

    },
  },

}
</script>

<style lang="scss" scoped>

.com {


}

.c-tabs {
  margin: 0 0 0px 0;
}

.c-input {
  background-color: #fafbfc;
  border-top: 1px solid #e4e6e9;
}

</style>
