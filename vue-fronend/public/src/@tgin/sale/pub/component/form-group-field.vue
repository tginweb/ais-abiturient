<template>

    <q-field
        :label="label"
        outlined
        stack-label
        @click.native="$emit('toggle')"
        :rules="rulesComp"
        v-model="valueState"
        v-bind="bind"
        lazy-rules="ondemand"
        ref="field"
    >
      <template v-slot:label>

        <div class="flex no-wrap items-center">
          <div class="q-mr-auto">{{label}}</div>
          <slot name="label-side"/>
          <q-icon v-if="(!haveErrors || !validated)" :name="$icons.chevronRight" size="14px" class="q-ml-sm" style=""/>
        </div>

      </template>

      <template v-slot:control>

        <div class="self-center full-width">
          <slot v-bind="{validated, haveErrors}"/>
        </div>

        <div v-if="hint" class="s-font-xs text-grey-6 q-mt-xs">
          {{hint}}
        </div>

      </template>
      <template v-slot:append>

      </template>
    </q-field>


</template>

<script>

export default {
  props: {
    name: {},
    label: {},
    hint: {},
    rules: {default: ()=>([])},
    value: {},
  },
  data() {
    return {
      valueState: this.value,
      validated: false
    }
  },
  watch: {
    value() {
      this.validated = true
    }
  },
  methods: {
    setValidated() {
      this.$refs.field.validate()
      this.validated = true
    }
  },
  computed: {
    rulesComp() {
      return this.rules
    },
    haveErrors() {
      return !!this.rulesComp.find(rule => rule(this.valueState) !== true)
    },
    bind() {
      const res = {
        class: {
          'com-form-group-field': true
        }
      }

      if (this.haveErrors && this.validated) {
        res.class['--error'] = true
      }

      return res
    }
  }
}
</script>

<style lang="scss" scoped>

.com-form-group-field {


  cursor: pointer;

  /deep/ {
    .q-field__label {
      color: #888;
      margin-top: 3px;
      white-space1: normal;
    }

    .title {
      font-weight: 600;
      border-bottom1: 1px dashed currentColor;
      display: inline-block;
      color: #555;

    }
  }

  &.--error {
    /deep/ {
      .title {
        color: #ab2929;
      }
    }
  }

  /deep/ {
    .q-field__label {
      transform1: translateY(-40%) scale(0.95);
      transform: none;
      font-size: 14px;
      width: 100%;
      margin-top: -7px;
    }

    .q-field__native,
    .q-field__prefix,
    .q-field__suffix {
      padding-top: 13px;
      padding-bottom: 16px;
    }
  }

}


</style>
