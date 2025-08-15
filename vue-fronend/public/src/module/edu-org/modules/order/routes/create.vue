<template>
  <q-page class="flex flex-center">

    <q-btn color="secondary" size="xl" @click="onSubmit" :loading="proc" :disable="proc">
      Создать заявление
    </q-btn>

  </q-page>
</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
        proc: false
      }
    },
    mounted() {

    },
    methods: {
      async onSubmit() {

        this.proc = true;

        try {
          let {data: {res}} = await this.$apollo.mutate({
            mutation: require('~module/edu-org/modules/order/gql/order/mutation/old/create.gql'),
          })

          console.log(res.result)

          if (res.result.success) {
            await this.$store.dispatch('edu_order/userOrderFetch')
            this.$router.push('/cab/abit/order/step/anket')
          }


        } catch (e) {

          console.log(e)
        }

        this.proc = false;

      }
    }
  }

</script>
