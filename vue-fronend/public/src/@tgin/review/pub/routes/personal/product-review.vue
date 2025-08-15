<template>

  <component
      v-bind="bindRouterWrapper"
      :loading="requestState.fetching"
      :loaded="requestState.fetched"
      :title="pageTitle"
      @hide="onHide"
      dialogWidth="500px"
  >

    <div v-if="modeId==='view'" class="q-mb-md q-px-sm q-py-xs text-red s-font-sm text-center border-1 border-red">
      На этот товар найден Ваш отзыв, оставленный ранее
    </div>

    <div class="q-mb-md row q-col-gutter-lg items-center" v-if="entity">

      <div class="col-4">
        <img v-if="entity.LIST_IMAGE" :src="$image.resolveUrl(entity.LIST_IMAGE.SRC, 'r200')"/>
      </div>

      <div class="col-20">
        {{ entity.NAME }}
      </div>

    </div>

    <q-form
        ref="form"
        class="q-gutter-md"
        @submit="onSubmit"
    >

      <q-rating
          v-model="form.RATING"
          class="c-reviews__rating__stars"
          color="primary-brown-gray-1"
          color-selected="actions-yellow"
          icon="star"
          icon-selected="star"
          max="5"
          size="44px"
          :readonly="modeId === 'view'"
      />

      <q-input
          v-model="form.TEXT"
          label="Ваш комментарий"
          outlined
          type="textarea"
          :readonly="modeId === 'view'"
          maxlength="3000"
      />

    </q-form>

  </component>

</template>

<script>
import MRoute from "@tgin/user/pub/component/profile/route.mixin"
import MVRoute from '@tgin/main/router/mixin/vroute'

export default {
  mixins: [MRoute, MVRoute],
  components: {},
  props: {
    onSuccess: {}
  },
  data() {
    return {
      modeId: 'fetch',
      productElement: null,
      form: {
        ID: null,
        ELEMENT_ID: null,
        TEXT: null,
        RATING: 0,
      },
    }
  },
  computed: {
    actions() {
      const result = []

      if (this.modeId === 'view') {
        result.push({
          label: 'Изменить свой отзыв',
          color: 'primary',
          callback: () => {
            this.modeId = 'edit'
          }
        })
      } else {
        result.push({
          label: 'Оценить',
          color: 'primary',
          disable: !this.form.RATING,
          loading: this.requestState.mutating,
          callback: this.onSubmit
        })
      }
      return result
    },

    pageTitle() {
      return 'Отзыв о товаре'
    },
  },
  methods: {
    async fetch() {


      try {

        if (this.action === 'edit') {

          let review = await this.$store.dispatch('review_pub/userReviewFetch', {
            id: this.entityIdState,
          })

          review = this.$store.getters['iblock/prepareElement'](review)

          if (!review || !review.PROPV.ELEMENT_ID) {
            return;
          }

          let product = await this.$store.dispatch('catalog_pub/productElementQuery', {
            filter: {
              ID: {eq: review.PROPV.ELEMENT_ID}
            },
          })

          this.assignEntity(product, this.requestState)

          this.form = {
            ELEMENT_ID: review.PROPV.ELEMENT_ID,
            TEXT: review.DETAIL_TEXT,
            RATING: review.PROPV.RATING
          }

          this.modeId = 'edit'

        } else {

          let product = await this.$store.dispatch('catalog_pub/productElementQuery', {
            filter: {
              ID: {eq: this.entityIdState}
            },
            options: {
              state: this.requestState,
            }
          })

          this.assignEntity(product, this.requestState)

          if (product) {

            let review = await this.$store.dispatch('review_pub/userReviewFetch', {
              elementId: this.entityIdState,
            })

            if (review) {
              review = this.$store.getters['iblock/prepareElement'](review)
              this.modeId = 'view'
              this.form.ELEMENT_ID = this.entityIdState
              this.form.TEXT = review.DETAIL_TEXT
              this.form.RATING = review.PROPV.RATING
            } else {
              this.modeId = 'create'
              this.form.ELEMENT_ID = this.entityIdState
            }
          }
        }


      } catch (e) {
        console.log(e)
      }

    },

    async onSubmit() {
      try {
        if (await this.$refs.form.validate())
          await this.onSubmitCommit()
      } catch (e) {}
    },

    async onSubmitCommit() {

      try {
        await this.$store.dispatch('gql/mutation', {
          mutation: require('@tgin/review/pub/gql/mutation/user_product.gql'),
          variables: {
            model: this.form
          },
          state: this.requestState,
        })

        this.visible = false

      } catch (e) {
        console.log(e)
      }
    },


  },
  async created() {

    await this.fetch();
  }
}
</script>
<style lang="scss" scoped>

.c-orders {
  border: 1px solid #EFEEEE;

  .c-orders__order:not(:last-child) {
    border-bottom: 1px solid #EFEEEE;
  }
}

</style>
