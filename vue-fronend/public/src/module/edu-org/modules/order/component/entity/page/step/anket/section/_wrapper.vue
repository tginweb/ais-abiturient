<template>

  <div class="s-form-section-controls">

    <slot/>

    <div class="c-actions q-mt-lg q-pt-lg">

      <div style="display: flex">

        <q-btn
          @click="$emit('save')"
          color="secondary"
          label="Сохранить данные"
          rounded
          size="lg"
          v-if="canSave"
        />

        <q-space></q-space>

        <q-btn
          @click="$emit('next')"
          color="brown-5"
          label="Далее"
          rounded
          outline
          icon-right="fas fa-arrow-right"
        />

      </div>

    </div>

  </div>

</template>

<script>

  export default {
    components: {

    },
    props: {
      response: {},
      canSave: {}
    },
    data() {
      return {

      }
    },
  }
</script>


<style lang="sass" scoped>


</style>
