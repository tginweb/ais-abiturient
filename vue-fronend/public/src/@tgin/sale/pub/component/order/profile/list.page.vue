<template>

  <div class="bg-white relative-position">

    <div v-if="!items.length">
      нет сохраненных адресов доставки
    </div>

    <div
        v-else
    >

      <q-list
          class="c-options border-primary-brown-gray-1 border-1 border-radius-xs"
      >
        <template
            v-for="(item, index) of items"
        >
          <q-item
              :key="item.ID"
              v-ripple
              class="q-px-none q-py-sm q-px-sm q-px-md-md q-py-md-md border-b-1 border-primary-brown-gray-1 border-b-last-0"
              manual-focus
              tag="label"
          >

            <q-item-section class="col-auto" v-if="allowSelect && items.length>1">
              <q-radio
                  v-model="valueState"
                  :val="item.ID"
                  color="primary"
              />
            </q-item-section>

            <CProfile
                :item="item"
                :show-person-type="showPersonType"
                :show-company="showCompany"
                class=""
            />

            <q-item-section top class="q-ml-auto col-auto ">
              <q-item-label class="text-right flex no-wrap q-gutter-sm">

                <q-btn
                    :icon="$icons.pencil"
                    dense
                    flat
                    @click="onEdit(item)"
                    no-wrap
                    color="primary"
                />

                <q-btn
                    :icon="$icons.trush"
                    dense
                    flat
                    @click="onDelete(item)"
                    color="red-4"
                    size="14px"
                    no-wrap
                    class="gt-sm"
                />

              </q-item-label>
            </q-item-section>

          </q-item>
        </template>

      </q-list>

      <div class="q-mb-md s-fon-sm text-grey-6" v-if="allowSelect && items.length>1">
        Кликните по <q-radio size="25px" :value="false" val="1" color="teal"/> чтобы использовать адрес в заказах по умолчанию.
      </div>

    </div>

    <q-btn
        :icon="$icons.fasPlus"
        :label="addLabel"
        color="primary"
        class="q-mt-md"
        v-if="allowAdd"
        :to="{name: 'sale:profile.add', params: {personTypeId: personTypeId}}"
    />

    <ui-progress-inner-loading :value="fetching"/>

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
