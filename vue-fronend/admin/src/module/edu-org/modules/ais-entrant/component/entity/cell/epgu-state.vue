<template>
  <div class="q-gutter-md">
    <div v-if="row.epgu.guid">
      <b>GUID</b>: {{row.epgu.guid}}
    </div>
    <div v-if="row.epgu.guidChanged">
      <b>GUID changed</b>: {{row.epgu.guidChanged}}, prev: {{row.epgu.prevGuid}}
    </div>
    <div v-if="row.epgu.identUid">
      <b>Ident UID</b>: {{row.epgu.identUid}}
    </div>
    <div v-if="row.epgu.eduUid">
      <b>Edu UID</b>: {{row.epgu.eduUid}}
    </div>
    <json-viewer  :value="row.epgu.state" v-if="row.epgu.state"/>
  </div>
</template>

<script>
export default {
  props: {
    row: {},
  },
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
