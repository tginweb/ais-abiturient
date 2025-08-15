<template>
  <q-page class="q-pa-md q-pa-md-xl">

    <CInner
      :order="$store.getters['edu_order/userOrder']"
      v-if="$store.getters['edu_order/userOrder']"
    />
    <div v-else>
      <q-btn color="secondary" size="xl" @click="onCreate" :loading="proc" :disable="proc">
        Создать заявление
      </q-btn>
    </div>

  </q-page>
</template>

<script>
import CInner from '../component/entity/page/view'

export default {
  components: {
    CInner
  },
  data() {
    return {
      proc: false
    }
  },
  methods: {
    async onCreate() {

      this.proc = true;

      try {
        let {data: {res}} = await this.$apollo.mutate({
          mutation: require('../gql/order/mutation/create.gql'),
        })

        console.log(res.result)

        if (res.result.success) {
          //this.$router.push('/cab/abit/order/step/anket')
        }


      } catch (e) {

        console.log(e)
      }

      this.proc = false;

    }
  }
}
</script>
