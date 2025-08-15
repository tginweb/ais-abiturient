<template>

  <div class="com cursor-pointer" @click="onProfileEdit">

    <div class="row q-col-gutter-x-md  items-center">

      <div class="col-auto">
        <ui-avatar :src="$store.getters['user/avatarImageSrc']" class="q-mb-sm" size="40px"/>
      </div>

      <div class="col-grow col-lg-24">

        <div class="s-font-lg s-font-lg-md text-weight-bold">{{ $store.getters['user/fullNameShort'] }}</div>

        <div class="s-font-3xs q-mt-xs">{{ $store.getters['user/userPhoneFormatted'] }}</div>

        <div class="s-font-3xs q-mt-xs">{{ $store.getters['user/userEmail'] }}</div>

        <div v-if="$q.screen.gt.md" class="s-font-2xs q-mt-xs text-primary">
          Изменить профиль
        </div>

      </div>

      <div class="text-right" v-if="$q.screen.lt.lg">
        <q-btn
            flat
            dense
            color="primary-brown-gray-3"
            size="14px"
        >
          <span class="gt-sm q-mr-md" style="line-height:1.4;">изменить<br>профиль</span>
          <q-icon
              :name="$icons.chevronRight"
              size="sm"
          />
        </q-btn>
      </div>


    </div>

  </div>

</template>

<script>

export default {
  props: {},
  computed: {},
  methods: {
    onProfileEdit() {
      this.$router.push({name: 'user:profile.edit'})
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
