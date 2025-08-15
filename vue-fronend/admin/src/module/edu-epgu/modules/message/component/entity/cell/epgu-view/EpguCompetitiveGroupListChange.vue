<template>

  <div>
    <q-markup-table
        v-if="groups && groups.length"
        bordered
        class="s-font-2xs full-width text-center"
        dense
        flat
    >
      <tr
          v-for="group of groups"
      >
        <td style="white-space: normal;">
          {{group.competitionName}}
        </td>
        <td style="white-space: normal;">
          {{group.statusName}}
        </td>
        <td style="white-space: normal;">
          {{group.priority}}
        </td>
      </tr>
    </q-markup-table>
  </div>

</template>

<script>
import Base from './base'

export default {
  extends: Base,
  props: {
    row: {},
  },
  computed: {
    groups() {
      return this.ensureArray(this.$util.base.deepGet(this.row, 'response.payload.EpguCompetitiveGroupListChange.CompetitiveGroupList.CompetitiveGroup')).map((item) => {
        const status = this.$store.getters['edu_app/statusesById'][item.IdStatus]
        const competition = this.$store.getters['edu_competition/byUid'][item.UidCompetition]
        return {
          ...item,
          statusName: status && status.title,
          competitionName: competition && competition.name,
          priority: item.Priority.PriorityOther || item.Priority.PriorityTarget
        }
      }).sort((a, b) => ((a.priority > b.priority) ? 1 : -1))
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
