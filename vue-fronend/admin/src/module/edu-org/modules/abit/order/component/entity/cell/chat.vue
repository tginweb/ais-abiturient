<template functional>

  <span :class="data.staticClass || ''" v-bind="data.attrs" class="">

    <div class="flex no-wrap q-mb-sm" v-if="props.row.chat.clientCount">
      <div class="flex no-wrap">
          <q-badge class="c-messages-badge " :color="props.row.chat.unreadedByCompany ? 'red' : 'grey-5'" title="Новых / всего сообщений от абитуриента">
            {{props.row.chat.unreadedByCompany}} / {{props.row.chat.clientCount}}
          </q-badge>
      </div>
    </div>

    <div class="flex no-wrap q-mb-sm items-center" v-if="props.row.chat.companyCount">

      <div class="q-mr-xs s-font-2xs" title="Сообщения от ИРНИТУ">ВУЗ:</div>

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
