<template>

  <div class="com q-mt-xl q-pt-lg">

    <div style="display: flex">

      <q-btn
        @click="$emit('save')"
        color="secondary"
        label="Сохранить"
        rounded
        v-if="canSave"
      />

      <q-space></q-space>

      <q-btn
        @click="$emit('next')"
        color="secondary"
        label="Далее"
        rounded
        outline
      />

    </div>

  </div>

</template>

<script>

  export default {
    props: {
      canSave: {},
      nextStep: ''
    },
    methods: {},
  }
</script>


<style lang="sass" scoped>

  .com
    border-top: 1px solid #dddddd


</style>
