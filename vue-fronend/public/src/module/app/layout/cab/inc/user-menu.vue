<template>

  <div class="q-gutter-sm row items-center no-wrap">

    <q-btn
      :dense="$q.screen.lt.sm"
      :size="$q.screen.lt.md ? '15px' : '17px'"
      flat
      no-wrap
      color="primary"
      to="/pub/info"
      v-if="false"
    >

      <q-icon name="far fa-question-circle" size="sm"/>

      <span class="gt-sm q-pl-sm">Информация</span>

    </q-btn>


    <template v-if="userOrder">

      <q-btn
        :dense="$q.screen.lt.md"
        :size="$q.screen.lt.md ? '15px' : '17px'"
        flat
        no-wrap
        to="/cab/abit/messenger"
        color="primary"
      >
        <q-badge color="red"  floating  align="bottom" v-if="userOrder.chat.unreadedByClient">
          {{userOrder.chat.unreadedByClient}} новых
        </q-badge>

        <q-icon name="far fa-comment" class="s-font-xl"/>

        <span class="gt-md q-pl-sm">Сообщения</span>

      </q-btn>

    </template>

    <template v-if="$store.getters['user/authorized']">

      <q-btn
        :dense="$q.screen.lt.md"
        :size="$q.screen.lt.md ? '15px' : '17px'"
        flat
        no-wrap
        color="primary"
      >

        <q-icon name="far fa-user " class="s-font-xl"/>

        <span class="gt-md q-pl-sm">{{$store.getters['user/fullNameShort']}}</span>

        <q-icon name="arrow_drop_down" size="16px" />

        <q-menu auto-close>
          <q-list dense>

            <q-item clickable class="GL__menu-link-signed-in" to="/cab/order/view">
              <q-item-section>
                Ваше заявление
              </q-item-section>
            </q-item>

            <q-item clickable class="GL__menu-link-signed-in" to="/cab/abit/profile" v-if="false">
              <q-item-section>
                Настройки профиля
              </q-item-section>
            </q-item>

            <q-item
              clickable
              class="GL__menu-link-status"
              to="/cab/order/change-type"
              v-if="userOrder && userOrder.state.status=='draft'"
            >
              <q-item-section>
                Сменить уровень
              </q-item-section>
            </q-item>


            <q-item clickable class="GL__menu-link-status" @click="$store.dispatch('user/tokenLogout')">
              <q-item-section>
                Выход
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>

      </q-btn>

    </template>

    <template v-else>

      <q-btn
        :dense="$q.screen.lt.sm"
        :size="$q.screen.lt.md ? '15px' : '17px'"
        flat
        no-wrap
        color="primary"
        to="/pub/auth"
      >
        <q-icon name="far fa-user " size="sm"/>

        <span class="gt-sm q-pl-sm">Войти в кабинет</span>

      </q-btn>

    </template>
  </div>

</template>

<script>

  export default {
    components: {
    },
    props: {
      title: {}
    },
    data() {
      return {
        dialogs: {
          changeEduType: false
        }
      }
    },
    computed: {
      userOrder() {
        return this.$store.getters['edu_order/userOrder']
      }
    }
  }
</script>

<style lang="sass" scoped>


  .c-head-title
    .__logo
      max-height: 35px

    .__name
      font-size: 25px
      color: #428bca
      text-transform: uppercase
      font-weight: 700

    .__desc
      font-size: 20px
      line-height: 1em
      font-weight: 300
      color: #666

    @media (max-width: $breakpoint-xs-max)
      .__name
        font-size: 17px
      .__logo
        max-height: 23px


</style>
