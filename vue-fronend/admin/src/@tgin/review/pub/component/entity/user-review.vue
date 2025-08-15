<template>
  <li class="parent_li q-py-md border-b-1 border-primary-brown-gray-1">

    <div>

      <div class="c-info">

        <div class="c-date text-primary-brown-gray-4">
          {{ item.ACTIVE_FROM }}
        </div>

        <div class="flex items-center q-gutter-sm">

          <template v-if="item.PROP.TARGET.VAL_ID === 'product'">

            <div class="text-weight-bold">
              Отзыв к товару:
            </div>

            <div class="">

              <router-link
                  :to="item.ELEMENT.URL"
                  v-if="item.ELEMENT"
              >
                <img
                    v-if="productElementImage"
                    :src="$image.resolveUrl(productElementImage.SRC, 'r100')"
                    style="max-height:30px;vertical-align: middle;"
                    class="q-mr-sm"
                />
                <span class="s-link">{{ item.ELEMENT.NAME }}</span>
              </router-link>

            </div>

          </template>
          <template v-else>


            <div class="text-weight-bold">
              Отзыв к заказу:
            </div>

            <div class="">

              <router-link
                  :to="{name: 'sale:order.view', params: {entityId: item.ORDER_ID}}"
                  class="s-link"
              >
                <template v-if="item.ORDER">
                  № {{item.ORDER.ACCOUNT_NUMBER}} от {{item.ORDER.DATE_FORMATTED}}
                </template>
                <template v-else>
                  ID {{item.ORDER_ID}}
                </template>
              </router-link>

            </div>

          </template>

          <div class="c-rating q-ml-auto" style="">

            <div
                :class="{
               'flex items-center q-pa-xs leading-none': true,
               [ratingClass]: true
              }"
            >
              <q-icon :name="$icons.star" class="q-mr-xs" size="16px"/>
              <span>{{ item.PROPV.RATING }}</span>
            </div>

          </div>

        </div>

      </div>

      <div class="c-text q-mt-sm" v-html="item.DETAIL_TEXT_FORMATTED"></div>

      <div class="q-mt-sm">
        <q-btn
            dense
            label="изменить"
            color="primary"
            outline
            size="14px"
            class="--normal"
            :to="{name: 'review:product.edit', params: {entityId: item.ID}}"
        />
      </div>

    </div>

    <ul v-if="item.CHILDREN && item.CHILDREN.length" class="q-mt-md">

      <li
          v-for="child of item.CHILDREN"
          :key="child.ID"
          class="q-pb-md"
      >
        <div class="c-info q-mt-sm">

          <div class="flex items-center no-wrap q-gutter-sm">

            <div class="text-weight-bold gt-md">
              Отзыв к товару:
            </div>

            <div class="">

              <router-link
                  :to="child.ELEMENT.URL"
                  v-if="child.ELEMENT"
              >
                <img
                    v-if="child.ELEMENT.LIST_IMAGE"
                    :src="$image.resolveUrl(child.ELEMENT.LIST_IMAGE.SRC, 'r100')"
                    style="max-height:24px;vertical-align: middle;"
                    class="q-mr-sm"
                />
                <span class="s-link">{{ child.ELEMENT.NAME }}</span>
              </router-link>

            </div>

            <div class="c-rating q-ml-auto" style="">

              <div
                  :class="{
                     'flex no-wrap items-center q-pa-xs leading-none': true,
                     [ratingClass]: true
                    }"
              >
                <q-icon :name="$icons.star" class="q-mr-xs" size="16px"/>
                <span>{{ child.PROPV.RATING }}</span>
              </div>

            </div>

          </div>

        </div>

        <div class="c-text q-mt-sm" v-html="child.DETAIL_TEXT_FORMATTED"></div>

      </li>

    </ul>

  </li>
</template>

<script>
import CParent from '@tgin/ui/core/component/entity/entity-element'

export default {
  extends: CParent,
  components: {},
  props: {
    colImageClass: {default: 'col-1 q-mr-2md'},
    colProductEnable: {default: false},
    ratingClass: {default: 'bg-primary-brown-1 text-dark'},
  },
  data() {
    return {}
  },

  computed: {

    productElementImage() {
      return this.item.ELEMENT && this.item.ELEMENT.LIST_IMAGE
    },

    authorAvatarSrc() {
      if (this.item.USER && this.item.USER.AVATAR && this.item.USER.AVATAR.IMAGE) {
        return this.item.USER.AVATAR.IMAGE.SRC
      } else {
        return '/statics/profile.png'
      }
    },

    authorName() {
      if (this.item.PROPV.AUTHOR_NAME) {
        return this.item.PROPV.AUTHOR_NAME
      } else if (this.item.USER) {
        return this.item.USER.NAME
      } else {
        return 'Клиент'
      }
    }
  }

}
</script>

<style lang="scss" scoped>


</style>
