<template>

  <component
    v-model="visible"
    v-bind="bindRouterWrapper"
    :actions="actions"
    :actionsClose="true"
    :loading="fetching"
    title="Аватар"
    @hide="onHide"
  >

    <div v-if="imageSrc" class="c-avatar q-mb-md text-center">

      <ui-avatar :src="imageSrc" size="64px"/>

    </div>

    <q-form ref="formAvatar" class="">

      <div class="q-mb-md">
        <div class="q-mb-sm">
          Выберите аватарку
        </div>
        <ui-options
          v-model="model.selected"
          :options="avatarsOptions"
        />
      </div>

      <div class="">

        <div class="q-mb-sm">
          Или загрузите свою
        </div>

        <q-btn
          class="full-width"
          color="primary-brown-1"
          label="Выбрать фото"
          text-color="dark"
          unelevated
          @click="$refs.imageFile.pickFiles()"
        />

        <q-file
          v-show="false"
          ref="imageFile"
          v-model="model.image"
          label="Standard"
          @input="onFileInput"
        />

      </div>

    </q-form>

  </component>

</template>

<script>

import MRequestable from '@common/core/mixin/requestable'
import MVRoute from '@common/router/mixin/vroute'

export default {
  mixins: [MVRoute, MRequestable],
  props: {},
  components: {},
  data() {
    return {
      imageSrc: '',
      model: {
        selected: 0,
        image: null
      },
      request: {
        process: null,
        status: null
      }
    }
  },
  computed: {

    actions() {

      const result = [];

      result.push({
        label: 'Сохранить и закрыть',
        color: 'primary',
        loading: this.request.process,
        callback: () => {
          this.onSubmit()
        }
      })

      return result
    },

    avatarsOptions() {
      return this.$store.state.user.app.avatarElements.map(item => ({
        value: item.ID,
        image: 'img:' + item.PICTURE.SRC,
        imageSrc: item.PICTURE.SRC
      }))
    },

    avatarsOptionsByValue() {
      return this.avatarsOptions.reduce((map, item) => (map[item.value] = item, map), {});
    },
  },
  methods: {

    onFileInput(v) {
      this.imageSrc = URL.createObjectURL(this.model.image);
      this.model.selected = ''
    },

    onSubmit() {
      this.$refs.formAvatar.validate().then(async (success) => {

        if (success) {

          var bodyFormData = new FormData();
          bodyFormData.append('avatarElementId', this.model.selected);
          bodyFormData.append('avatarImage', this.model.image);

          try {
            const {data} = await this.$api.post('/avatar/user/update', bodyFormData)

            if (data.payload.AVATAR) {
              this.$store.commit('user/AVATAR', data.payload.AVATAR)
            }

            this.visible = false

          } catch (e) {

            console.log(e)
          }

        }
      })
    },
  },
  created() {

    const user = this.$store.getters['user/user']

    if (user.AVATAR) {
      this.model.selected = user.AVATAR.ELEMENT_ID
      this.imageSrc = user.AVATAR.IMAGE && user.AVATAR.IMAGE.SRC || ''
    } else {
      this.model.selected = 0
      this.imageSrc = ''
    }

  },
  watch: {
    'model.selected'(val) {
      if (val) {
        const avatarOption = this.avatarsOptionsByValue[val]
        if (avatarOption) {
          this.imageSrc = avatarOption.imageSrc
        }
      }
    },
  }
}

</script>

<style lang="scss" scoped>


</style>
