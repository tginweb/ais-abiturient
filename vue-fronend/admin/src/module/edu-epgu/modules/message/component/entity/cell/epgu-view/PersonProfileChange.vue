<template>

  <div class="q-gutter-md">
    <div v-for="change of changes">
      <div class="q-mb-sm text-bold">
        {{change.EntityType}}
      </div>
      <div>
        <q-markup-table
            bordered
            class="s-font-2xs full-width text-center"
            dense
            flat
            v-if="change.EntityList && change.EntityList.Entity"
        >
          <template v-for="entity of ensureArray(change.EntityList.Entity)">

            <tr v-for="field of entity.FieldList.Field">
              <td style="white-space: normal;">
                {{field.Name}}
              </td>
              <td style="white-space: normal;">
                {{field.OldValue}}
              </td>
              <td style="white-space: normal;">
                {{field.NewValue}}
              </td>
            </tr>

          </template>
        </q-markup-table>
      </div>
    </div>
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
    changes() {
      return this.ensureArray(this.$util.base.deepGet(this.row, 'response.payload.PersonProfileChange.ChangeList.Change'))
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
