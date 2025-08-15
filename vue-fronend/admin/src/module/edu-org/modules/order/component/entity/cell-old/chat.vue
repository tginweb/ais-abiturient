<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="">

    <div class="flex q-gutter-x-xs no-wrap q-mb-sm" v-if="props.row.chat.clientCount">

      <div class="q-mr-auto" title="Сообщения от клиента">Клиент:</div>

      <div class="flex no-wrap">
        <div>
          <q-badge class="c-messages-badge " color="grey-5" title="Количество сообщений от клиента">
            {{props.row.chat.clientCount}}
          </q-badge>
        </div>
        <div class="q-ml-xs" v-if="props.row.chat.unreadedByCompany">
          <q-badge class="c-messages-badge " color="red" title="Новых сообщений от клиента" >
            {{props.row.chat.unreadedByCompany}}
          </q-badge>
        </div>
      </div>

    </div>

    <div class="flex q-gutter-x-xs no-wrap q-mb-sm" v-if="props.row.chat.companyCount">

      <div class="q-mr-auto" title="Сообщения от ИРНИТУ">ИРНИТУ:</div>

      <div>
        <q-badge class="c-messages-badge " color="grey-5" title="Количество сообщений от ИРНИТУ">
          {{props.row.chat.companyCount}}
        </q-badge>
      </div>

    </div>

  </span>

</template>

<script>
  export default {
    functional: true,
    props: {
      row: {},
    },
  }
</script>

<style lang="scss" scoped>


</style>
