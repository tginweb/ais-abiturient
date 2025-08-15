<template>

  <div class="c-row ">


    <q-chat-message
      v-bind="bind"
      class="c-message q-mb-lg"
      size="12"
      text-color="black"
    >
      <template v-if="message.message.files.length" v-slot:default>
        <div class="c-files">
              <span v-for="(file, index) of message.message.files" class="c-files__item q-mr-md">
                <a :href="file.downloadUrl" target="_blank">{{ file.originalname }}</a>
              </span>
        </div>
      </template>

    </q-chat-message>

  </div>

</template>

<script>
const dayjs = require('dayjs')
export default {
  props: ['message', 'context'],
  data() {
    return {};
  },
  computed: {

    senderCompanyUserName() {
      if (this.message.senderUserId && typeof this.message.senderUserId === 'object') {
        if (this.message.senderUserId.roles.indexOf('fac') > -1 || this.message.senderUserId.roles.indexOf('admin') > -1) {
          return this.message.senderUserId.firstName + ' ' + this.message.senderUserId.lastName
        }
      }
    },

    bind() {
      let res = {}

      let sent, name, avatar, text = '';

      if (this.context === 'company') {
        switch (this.message.senderType) {
          case 'system':
            avatar = '/statics/logo.png'
            sent = true;
            name = this.senderCompanyUserName || 'Сообщение от системы'
            break;
          case 'company':
            sent = true;
            name = this.senderCompanyUserName || 'Вы'
            break;
          case 'client':
            sent = false;
            name = 'Абитуриент'
            break;
        }
      } else {
        switch (this.message.senderType) {
          case 'system':
            avatar = '/statics/logo.png'
            sent = false;
            name = 'ИРНИТУ'
            break;
          case 'company':
            sent = false;
            name = 'ИРНИТУ'
            break;
          case 'client':
            sent = true;
            name = 'Bы'
            break;
        }
      }

      switch (this.message.senderType) {
        case 'system':
          avatar = '/statics/logo.png'
          break;
        case 'client':
          avatar = 'https://www.gofulllife.com.ua/wp-content/uploads/2015/12/Portrait_Placeholder.png'
          break;
        case 'company':
          avatar = '/statics/logo.png'
          break;
      }

      if (sent) {
        res['bg-color'] = 'green-2'
      } else {
        res['bg-color'] = 'grey-3'
      }

      if (this.message.message.title)
        text = '<div class="c-message-title">' + this.message.message.title + "</div>"

      if (this.message.message.text)
        text = text + '<div class="c-message-body">' + this.message.message.text + "</div>"

      res.text = [text];
      res.sent = sent;
      res.name = name;
      res.avatar = avatar
      res.stamp = dayjs(this.message.createAt).tz().format('DD.MM.YYYY HH:mm')

      return res
    },


  },
  methods: {}
};

</script>

<style lang="scss" scoped>

.c-message {
  /deep/ {
    .c-message-title {
      font-weight: bold;
    }

    .c-message-body {
      margin-bottom: 10px;
    }

    .c-message-title + .c-message-body {
      margin-top: 10px;
    }

    .q-message-stamp {
      margin-top: 7px;
    }
  }
}

</style>
