<template>

  <div class="com-props-group" v-show="!dialog">

    <ui-dialog
        v-model="valueState"
        v-if="dialog"
        :title="group.NAME"
        @hide="valueState = false, $emit('toggle', false)"
        :actions="dialogActionsComp"
        dialog-width="550px"
        sheet-header-class="q-py-md"
    >

      <div class="q-pb-sm s-order-form">
        <slot v-if="$slots.default"/>
      </div>

      <div
          v-if="loading"
          class="flex"
          style="z-index: 40; background-color: rgba(255,255,255, 0.5); position: absolute; left:0; top:0; bottom:0; right:0; pointer-events: none; "
      >
        <q-spinner
            :thickness="8"
            class="q-mx-auto"
            color="primary"
            size="3em"
            style="position: sticky; top: 30vh;"
        />
      </div>

    </ui-dialog>

    <div v-else class="bg-white">

      <div class="row q-pa-md q-pa-lg-none ">

        <div class="col-24 -col-md-5 q-mb-md" v-if="$q.screen.gt.md1 || group.NAME">

          <div class="flex items-center">
            <div class="c-name -q-mt-md-sm -q-mb-md q-mb-md-none s-font-lg">{{ group.NAME }}</div>
            <slot name="header-side"/>
          </div>

        </div>

        <div class="col-24 -col-md-19" :style="colFieldsStyle">

          <div v-if="readonly" style="float:right;">
            <a
                class="text-primary"
                href="#"
                style="position:relative; z-index:1;"
                @click.prevent.stop.capture="onEdit(item)"
            >
              Изменить
            </a>
          </div>

          <slot name="prepend" v-if="$slots.prepend"/>

          <slot v-if="$slots.default"/>

          <template v-else>

            <template
                v-for="prop of propsComp"
            >
              <template v-if="propIf(prop)">


                <slot
                    v-if="$scopedSlots['prop-' + prop.CODE]"
                    v-bind="{prop: prop}"
                    :name="'prop-' + prop.CODE"
                />
                <component
                    v-else
                    :key="prop.ID"
                    v-bind="bindPropInput(prop)"
                    :prop="prop"
                    :value="prop.VALUE"
                    class="q-mb-md"
                    @change="onChange(prop, $event)"
                    @changeMultuple="onChange(prop, $event)"
                    @input="onInput(prop, $event)"
                />

              </template>

            </template>

          </template>

          <slot name="append" v-if="$slots.append"/>

        </div>

      </div>

    </div>
  </div>

</template>

<script>
import Parent from './group'
export default {
  extends: Parent,

}
</script>

<style lang="scss" scoped>

.com-props-group {
  padding-bottom: 25px;

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
}

.c-name {
  font-weight: bold;
  color: #666;
}

@media (max-width: $breakpoint-lg-min) {
  .com-props-group {
    margin-top1: 10px !important;
    margin-bottom: 0;
    padding-bottom: 3px;
  }
  .c-name {
    font-weight: bold;
  }
}

</style>
