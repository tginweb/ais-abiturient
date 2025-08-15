<template>

  <q-card
    bordered
    class="my-card"
    flat
    ref="holder"
  >

    <q-scroll-area :style="{height: scrollHeight}" ref="scrollArea">

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
        @submit="onInputSubmit"
        class="c-input"
        ref="chatInput"
        v-model="inputValue"
      ></chat-input>

    </div>

  </q-card>

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
      messagesMaxHeight: 350,
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
        this.messagesData =  this.$util.base.cloneDeep(this.messages)
        this.scrollBottom();
      },
      deep: true
    },
  },
  computed: {},
  methods: {

    async scrollBottom() {
      this.$nextTick(async () => {
        this.$refs.scrollArea.setScrollPosition(100000);
      })
      await this.onMessagesRead();
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
          mutation: require('../gql/mutation/public_read.gql'),
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
        let {data} = await this.$apollo.mutate({
          mutation: require('../gql/mutation/public_send.gql'),
          variables: {
            chatId: this.chatId,
            data: msg
          }
        })
        this.resetInput();
        this.$emit('submit', msg)
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
