<template>

  <div class="bg-white">

    <div v-if="!items.length">
      нет сохраненных способов оплаты
    </div>

    <q-list
      v-else
      class="c-options border-primary-brown-gray-1 border-lg-1 border-radius-xs"
    >
      <template
        v-for="(item, index) of items"
      >
        <q-item
          :key="item.VALUE"
          v-ripple
          class="q-px-none q-py-sm q-px-md-md q-py-md-md border-b-lg-1 border-primary-brown-gray-1 border-b-last-0"
          manual-focus
          tag="label"
        >

          <q-item-section avatar>
            <q-radio v-model="valueState" :val="item.VALUE" color="teal"/>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-dark">
              {{ item.NAME }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label class="text-center">

              <q-btn
                :icon="$icons.trush"
                dense
                flat
                @click="onDelete(item)"
              />

            </q-item-label>
          </q-item-section>

        </q-item>
      </template>

    </q-list>

  </div>

</template>

<script>
import CParent from "./list";
export default {
  extends: CParent
}
</script>
<style lang="scss" scoped>


</style>
