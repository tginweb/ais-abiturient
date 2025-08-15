<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :path="pagePathFull"
      :title="orderTitle"
      @hide="onHide"
  >

    <template v-slot:default>

      <div v-if="cmode==='view'" class="q-mb-md q-px-sm text-red text-center border-1 border-red">
        Ваш отзыв, оставленный ранее
      </div>

      <q-form ref="form">

        <div class="q-mb-sm">
          Оцените заказ и отдельные позиции:
        </div>

        <div class="c-items flex items-center q-gutter-x-sm">

          <div
              :class="{
            'border-1 border-primary-brown-gray-2': !selectedProductId
          }"
              class="c-item-image q-pa-xs s-font-xs text-center cursor-pointer leading-tight flex"
              @click="selectedProductId = null"
          >
            <div
                class="c-item-image__inner flex"
            >
              <div
                  v-if="form.RATING"
                  class="c-item-rating flex text-center items-center leading-none s-font-4xs text-white text-weight-bold bg-primary"
                  style="padding:2px;"
              >
                <q-icon
                    :name="$icons.star"
                    style="margin-right: 2px;"
                />
                <span>{{ form.RATING }}</span>
              </div>

              <div class="q-mx-auto q-my-auto">
                заказ
              </div>
            </div>
          </div>

          <div
              v-for="basketItem of entity.BASKET"
              :key="basketItem.ID"
              :class="{
            'border-1 border-primary-brown-gray-2': basketItem.PRODUCT_ID === selectedProductId
          }"
              class="c-item-image q-pa-xs cursor-pointer"

              @click="onSelectItem(basketItem)"
          >
            <div
                :style="{
                  backgroundImage: basketItem.ELEMENT.LIST_IMAGE ? 'url(' +$image.resolveUrl(basketItem.ELEMENT.LIST_IMAGE.SRC, 'r100')+ ')' : null
                }"
                class="c-item-image__inner"
            >
              <div
                  v-if="productsForm[basketItem.PRODUCT_ID].RATING"
                  class="c-item-rating flex items-center leading-none s-font-4xs text-white text-weight-bold bg-primary"
                  style="padding:2px;"
              >
                <q-icon
                    :name="$icons.star"
                    style="margin-right: 2px;"
                />
                <span>{{ productsForm[basketItem.PRODUCT_ID].RATING }}</span>
              </div>

            </div>

          </div>

        </div>

        <template v-if="selectedOrderItem">

          <div class="q-mt-md">
            <div class="q-mb-xs text-weight-bold">Ваша оценка товара:</div>
            <div>{{ selectedOrderItem.NAME }}</div>
          </div>

          <div class="q-mt-sm">

            <q-rating
                v-model="productsForm[selectedProductId].RATING"
                class="c-reviews__rating__stars"
                color="primary-brown-gray-1"
                color-selected="actions-yellow"
                icon="star"
                icon-selected="star"
                max="5"
                size="34px"
                :readonly="cmode === 'view'"
            />

            <q-input
                v-model="productsForm[selectedProductId].COMMENT"
                class="q-mt-md"
                label="Ваш комментарий к товару"
                maxlength="2000"
                outlined
                rows="4"
                type="textarea"
                :readonly="cmode === 'view'"
            />

          </div>

        </template>
        <template v-else>

          <div class="q-mt-md">
            <div class="q-mb-xs text-weight-bold">Ваша оценка всего заказа:</div>
          </div>

          <div class="q-mt-sm">

            <q-rating
                v-model="form.RATING"
                class="c-reviews__rating__stars"
                color="primary-brown-gray-1"
                color-selected="actions-yellow"
                icon="star"
                icon-selected="star"
                max="5"
                size="34px"
                :readonly="mode === 'view'"
            />

            <q-input
                v-model="form.COMMENT"
                class="q-mt-md"
                label="Ваш комментарий к заказу"
                maxlength="5000"
                outlined
                rows="4"
                type="textarea"
                :readonly="cmode === 'view'"
            />

          </div>

        </template>

      </q-form>

    </template>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  name: 'page.profile',
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    onSuccess: {}
  },
  data() {
    return {
      page: {
        title: 'Оценить заказ'
      },
      productsForm: {},
      form: {
        COMMENT: null,
        RATING: 0,
        ELEMENT_ID: null
      },
      submitRequest: {
        success: false
      },
      selectedProductId: null,
      fetched: false,
      cmode: 'fetch',
    }
  },
  watch: {},
  computed: {

    filled() {
      return this.form.RATING || Object.keys(this.productsForm).find(productId => this.productsForm[productId].RATING)
    },

    actions() {

      const result = []

      if (this.cmode === 'view') {
        result.push({
          label: 'Изменить свой отзыв',
          color: 'primary',
          callback: () => {
            this.cmode = 'edit'
          }
        })
      } else {
        result.push({
          label: 'Отправить отзыв',
          color: 'primary',
          disable: !this.filled,
          callback: this.onSubmit
        })
      }

      return result
    },

    orderTitle() {
      return this.entity ? 'Оценить заказ №' + this.entity.ID : null
    },

    orderItemsByProductId() {
      return this.entity.BASKET.reduce((map, item) => {
        map[item.PRODUCT_ID] = item
        return map
      }, {})
    },

    selectedOrderItem() {
      return this.selectedProductId && this.orderItemsByProductId[this.selectedProductId]
    },
  },
  methods: {
    onSubmit() {

      this.$refs.form.validate().then(async success => {
        if (success) {

          this.submitRequest.proccess = true

          try {
            const {data} = await this.$apollo.mutate({
              mutation: require('@tgin/review/pub/gql/mutation/user_order.gql'),
              variables: {
                orderId: this.entityId,
                model: this.review
              }
            })

            this.$bus.emit('processMessages', data.res.result.messages);

            if (data.res.result.success) {
              this.submitRequest.success = true
              this.visible = false

              this.$emit('event', 'review', 'saved', this.entityId)
            }

          } catch (e) {
            console.log(e)
          }

          this.submitRequest.proccess = false

        }
      })
    },

    onSelectItem(basketItem) {
      this.selectedProductId = basketItem.PRODUCT_ID
    },

    async fetch() {

      const entity = this.entityData || await this.$store.dispatch('sale_pub/userOrderFetch', {id: this.entityId})

      if (entity) {

        this.entity = this.$util.base.cloneDeep(entity)

        let dbProductReviews = await this.$store.dispatch('review_pub/userReviewsFetch', {
          filter: {
            CONTEXT_ID: {eq: this.entityId}
          }
        })

        dbProductReviews = this.$store.getters['iblock/prepareElement'](dbProductReviews)

        const dbProductReviewsByTargetId = {}

        if (dbProductReviews.length) {
          this.cmode = 'view'

          dbProductReviews.forEach((item) => {

            if (!item.PROPV.ELEMENT_ID) {
              this.form.ELEMENT_ID = item.ID
              this.form.COMMENT = item.DETAIL_TEXT
              this.form.RATING = item.PROPV.RATING
            } else {
              dbProductReviewsByTargetId[item.PROPV.ELEMENT_ID] = item
            }

          })
        } else {
          this.cmode = 'create'
        }

        this.productsForm = entity.BASKET.reduce((map, item) => {

          item = this.$store.getters['iblock/prepareElement'](item)

          const rateModel = {
            COMMENT: null,
            RATING: 0,
          }

          const dbReview = dbProductReviewsByTargetId[item.PRODUCT_ID]

          if (dbReview) {
            rateModel.ELEMENT_ID = dbReview.ID
            rateModel.COMMENT = dbReview.DETAIL_TEXT
            rateModel.RATING = dbReview.PROPV.RATING
          }

          map[item.PRODUCT_ID] = rateModel

          return map
        }, {});

        this.requestState.fetched = true
      }
    }
  },
  async created() {
    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>


.c-item-image {

  padding: 3px;

  .c-item-image__inner {
    width: 45px;
    height: 45px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;
  }
}

.c-item-rating {
  position: absolute;
  top: -4px;
  right: -3px;
}

</style>
