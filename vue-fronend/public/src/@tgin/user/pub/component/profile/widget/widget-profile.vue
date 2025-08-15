<template>
  <div v-bind="bind">

    <div v-bind="bindInner">

      <div class="c-main full-width">

        <div class="c-header row no-wrap items-center1 q-col-gutter-md q-col-gutter-md-lg ">

          <div
              class="c-title full-width col-shrink q-mr-auto"
          >

            <div class="flex items-center">
              <div class="c-title s-font-md s-font-md-lg s-font-lg-lg s-font-xl-xl text-weight-bold">
                {{$store.getters['user/nameTeaser']}}
              </div>

              <div class="q-ml-auto">
                <q-btn
                    :label="$q.screen.gt.md ? 'изменить' : null"
                    class="c-header-more-link"
                    color="primary"
                    no-wrap
                    :icon-right="$icons.chevronRight"
                    flat
                    dense
                />
              </div>
            </div>


            <div class="q-mt-sm q-gutter-sm">
              <div style="overflow:hidden;text-overflow: ellipsis;">89501102996</div>
              <div style="overflow:hidden;text-overflow: ellipsis;">xanderweb@gmail.com</div>
            </div>

          </div>

          <div
              class="c-media col-auto order-first q-mt-sm q-mt-sm-none"
          >

            <q-circular-progress
                show-value
                :value="100"
                :size="mediaSizeComp"
                :thickness="0"
            >
              <q-icon
                  :name="'img:'+$store.getters['user/avatarImageSrc']"
                  :size="mediaSizeComp"
              />
            </q-circular-progress>

          </div>

        </div>

      </div>

      <div class="c-bottom q-mt-auto q-pt-sm flex">

        <div class="c-bottom-text" >
            <router-link :to="{name: 'user:profile.edit'}" class="s-link">профиль</router-link>
        </div>

        <div class="c-bottom-site q-ml-auto">
            <router-link :to="{name: 'user:logout'}" class="s-link">выйти</router-link>
        </div>

      </div>

    </div>

  </div>
</template>

<script>

import Parent from './widget'

export default {
  extends: Parent,
  props: {
    theme: {default: 'card'},
    link: {default: () => ({name: 'user:profile.edit'})},
  }
}

</script>
