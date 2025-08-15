<template>
  <span class="com">
     <input class="el" type="checkbox" checked v-if="!!value"/>
     <input class="el" type="checkbox"  v-else/>
  </span>
</template>

<script>
  export default {
    props: {
      value: {},
    },
  };
</script>
<style lang="scss" scoped>

  .com {
    line-height: 1;
  }

  .el {
    transform: scale(1.5);
    line-height: 1;
  }
</style>
