<template>
  <div
    ref="chatLogContainer"
    class="chat-log"
  >
    <chat-message
      v-for="(message,index) in messages"
      :key="index"
      :context="context"
      :message="message"
    />

  </div>
</template>

<script>
import ChatMessage from './message';

function scrollBottom() {
  this.$el.scrollTo(0, this.$el.scrollHeight);
}

export default {
  components: {
    ChatMessage
  },
  props: {
    messages: {},
    context: {}
  },
  data() {
    return {
      showTypingIndicator: false,
    };
  },
  computed: {},
  created() {

  },
};
</script>

<style scoped>
.chat-log {
  display: block;
  height: inherit;
  width: 100%;
  box-sizing: border-box;
  overflow-y: scroll;
}

.chat-log::-webkit-scrollbar {
  display: none;
}

.typing-indicator {
  display: block;
  width: 36px;
  height: 36px;
  margin-bottom: 4px;
  float: left;
  clear: both;
}

.typing-on {
  display: block;
}

.typing-off {
  display: none;
}
</style>
