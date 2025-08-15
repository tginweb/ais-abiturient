<script>
import {QSelect} from 'quasar'

export default {
  extends: QSelect,

  props: {
    inputTextarea: {},
    searchInput: {}
  },

  methods: {

    __getInput(h, fromDialog, isTarget) {

      if (this.inputTextarea) {

        const options = {
          ref: isTarget === true ? 'target' : void 0,
          key: 'i_t',
          staticClass: 'q-field__input q-placeholder col',
          style: this.inputStyle,
          class: this.computedInputClass,
          domProps: {value: this.inputValue !== void 0 ? this.inputValue : ''},
          attrs: {
            // required for Android in order to show ENTER key when in form
            type: 'search',
            ...this.qAttrs,
            id: this.targetUid,
            maxlength: this.maxlength, // this is converted to prop by QField
            tabindex: this.tabindex,
            autocomplete: this.autocomplete,
            'data-autofocus': fromDialog === true ? false : this.autofocus,
            disabled: this.disable === true,
            readonly: this.readonly === true,
            rows: 1,
            ...this.comboboxAttrs
          },
          on: this.inputControlEvents
        }

        if (fromDialog !== true && this.hasDialog === true) {
          options.staticClass += ' no-pointer-events'
        }

        this.textareaHeightRecalcDeounced()

        return h('textarea', options)

      } else {

        const attrs = isTarget === true ? {...this.comboboxAttrs, ...this.qAttrs} : void 0

        const options = {
          ref: isTarget === true ? 'target' : void 0,
          key: 'i_t',
          staticClass: 'q-field__input q-placeholder col',
          style: this.inputStyle,
          class: this.computedInputClass,
          domProps: {value: this.inputValue !== void 0 ? this.inputValue : ''},
          attrs: {
            // required for Android in order to show ENTER key when in form
            type: 'search',
            ...attrs,
            id: isTarget === true ? this.targetUid : void 0,
            maxlength: this.maxlength, // this is converted to prop by QField
            autocomplete: this.autocomplete,
            'data-autofocus': (fromDialog === true ? isTarget === true : this.autofocus) || void 0,
            disabled: this.disable === true,
            readonly: this.readonly === true
          },
          on: this.inputControlEvents
        }

        if (fromDialog !== true && this.hasDialog === true) {
          options.staticClass += ' no-pointer-events'
        }

        return h('input', options)
      }

    },

    textareaHeightRecalc() {
      const el = this.$refs.target
      if (!el) return;
      el.style['overflow-y'] = "hidden";
      el.style.height = "auto";
      el.style.height = (el.scrollHeight) + "px";
    }
  },

  computed: {
    textareaHeightRecalcDeounced() {
      return this.$util.base.debounce(this.textareaHeightRecalc, 100)
    },
  },

  watch: {
    inputValue(v) {
      //if (this.inputTextarea) this.textareaHeightRecalc()
    }
  },
};
</script>
<style lang="scss" scoped>


</style>
