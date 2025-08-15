<template>

  <div >

      <template
        v-for="(order, index) of appsWithAchievements"
      >
              <span
                v-for="doc of order.achievements"
                :key="doc._id"
                :class="{}"
              >
                  {{ doc.name }};
              </span>
      </template>

  </div>

</template>

<script>
export default {
  props: {
    row: {},
  },
  computed: {

    appsWithAchievements() {
      return this.row.appsAis.filter(app => {
        return app.achievements && (app.achievements.length > 0)
      })
    }
  },
  methods: {


  }
}
</script>

<style lang="scss" scoped>

.deleted, .deleted td {
  color: #d97d89 !important;
}

</style>
