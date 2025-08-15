<template>
  <div class="bg-white relative-position">

    <div v-if="!items.length">
      нет сохраненных компаний
    </div>

    <div
        v-else
    >

      <q-list
          class="c-options border-primary-brown-gray-1 border-1 border-radius-xs"
      >
        <q-item
            v-ripple
            class="q-px-none q-py-sm q-px-md-md q-py-md-md border-b-1 border-primary-brown-gray-1 border-b-last-0"
            manual-focus
            tag="label"
            v-for="item of itemsComp"
            :key="item.ID"
            @click.stop.prevent="onView(item)"
        >
          <q-item-section class="col-auto">
            <q-radio
                v-model="valueState"
                :val="item.ID"
                color="primary"
            />
          </q-item-section>

          <q-item-section class="">
            <q-item-label class="text-dark">
              {{item.NAME}}
            </q-item-label>
            <q-item-label caption>
              <div v-if="item.PROP_VAL.INN">
                ИНН: {{item.PROP_VAL.INN}}
              </div>
              <div v-if="item.PROP_VAL.KPP">
                КПП: {{item.PROP_VAL.KPP}}
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section top class="q-ml-auto col-auto ">
            <q-item-label class="text-right flex no-wrap q-gutter-sm">

              <q-btn
                  :icon="$icons.farEye"
                  dense
                  flat
                  @click.stop="onView(item)"
                  no-wrap
                  color="primary"
              />

              <q-btn
                  :icon="$icons.pencil"
                  dense
                  flat
                  @click.stop="onEdit(item)"
                  no-wrap
                  color="primary"
              />

              <q-btn
                  :icon="$icons.trush"
                  dense
                  flat
                  @click.stop="onDelete(item)"
                  color="red-4"
                  no-wrap
                  class="gt-sm"
              />

            </q-item-label>
          </q-item-section>

        </q-item>

      </q-list>

      <div class="q-mt-md s-fon-sm text-grey-6">
        Кликните по <q-radio size="25px" :value="false" val="1" color="teal"/> чтобы использовать компанию в заказах по умолчанию.
      </div>
    </div>

  </div>

</template>

<script>

import CParent from "./list";

export default {
  extends: CParent,
  props: {
    allowNewItem: {},
  },
  data() {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>


</style>
