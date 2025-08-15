<template>

  <div class="com-props-group row q-col-gutter-md-md bg-white ">

    <div class="col-24" v-if="false">
      <div class="c-name q-mt-md-sm q-mb-md q-mb-md-none">{{ group.NAME }}</div>
    </div>

    <div class="col-24" :style="colFieldsStyle">

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
</template>

<script>
import Parent from './group'
export default {
  extends: Parent
}
</script>

<style lang="scss" scoped>

@media (max-width: $breakpoint-md-max) {
  .com-props-group {
    margin-bottom: 10px !important;
  }
  .c-name {
    font-weight: bold;
  }
}

</style>
