<template>
  <div class="Menu">

    <q-btn
        :icon="iconState"
        class="q-px-none"
        color="dark"
        dense
        flat
        size="sm"
        @click="clickBurger"
    />

    <MenuShadow :handleShadowClicked="clickShadow" :isActive="isActive"/>

    <div v-if="isActivated">

      <div
          :class="{'isActive': isActive}"
          :style="[style_wrapperStyle, isActive ? style_wrapperActiveStyle : {}]"
          class="Menu__panel-wrapper"
      >

        <!-- prev -->
        <MenuPanel
            :functionalityStyle="style_panelStyle"
            :isTranslating="isTranslating"
            :list="content_prevItem"
            :positionStyle="panel_prevPositionStyle"
            :showHeaderArrow="prevItemHasParent"
            :handleClose="handleClose"
            :transitionStyle="style_transitionStyle"
        />

        <!-- staging -->
        <MenuPanel
            :functionalityStyle="style_panelStyle"
            :handleHeaderClicked="clickPrevItem"
            :handleItemClicked="clickNextItem"
            :handleClose="handleClose"
            :isTranslating="isTranslating"
            :list="content_currentItem"
            :positionStyle="panel_stagingPositionStyle"
            :showHeaderArrow="currentItemHasParent"
            :transitionStyle="style_transitionStyle"
        />

        <!-- next -->
        <MenuPanel
            :functionalityStyle="style_panelStyle"
            :isTranslating="isTranslating"
            :list="content_nextItem"
            :handleClose="handleClose"
            :positionStyle="panel_nextPositionStyle"
            :showHeaderArrow="true"
            :transitionStyle="style_transitionStyle"
        />
      </div>

    </div>

  </div>
</template>

<script>

import functionalityStyle from './mixins/functionalityStyle.mixin';
import panelControl from './mixins/panelControl.mixin';
import contentControl from './mixins/contentControl.mixin';

import RightArrowIcon from './icons/RightArrowIcon.vue';
import LeftArrowIcon from './icons/LeftArrowIcon.vue';
import MenuBurger from './components/MenuBurger.vue';
import MenuShadow from './components/MenuShadow.vue';
import MenuPanel from './components/MenuPanel.vue';

export default {
  mixins: [
    functionalityStyle,
    panelControl,
    contentControl,
  ],
  components: {
    RightArrowIcon,
    LeftArrowIcon,
    MenuBurger,
    MenuShadow,
    MenuPanel,
  },
  props: {
    icon: {
      default: null,
    },
    source: {
      type: Object,
      default: () => ({}),
    },
    panelWidth: {
      type: Number,
      default: 300,
    },
    menuOpenSpeed: {
      type: Number,
      default: 350,
    },
    menuSwitchSpeed: {
      type: Number,
      default: 300,
    },

    itemNavBehavior: {
      type: String,
      default: 'auto',
    },
  },
  data() {
    return {
      iconState: this.icon || this.$icons.grid,
      isActive: false,
      isActivated: false,
      isTranslating: false,
    };
  },
  mounted() {
    this.content_currentItem = this.source;
    this.$bus.on('openNestedMenu', this.clickBurger);
  },
  beforeDestroy() {
    this.$bus.off('openNestedMenu', this.clickBurger);
  },
  computed: {
    currentItemHasParent() {
      return this.content_parentStack.length >= 1;
    },
    prevItemHasParent() {
      return this.content_parentStack.length >= 2;
    },
  },
  watch: {
    list() {
      this.content_currentItem = this.source;
    },
  },
  methods: {
    handleClose() {
      this.isActive = false;
    },
    clickBurger() {
      this.isActivated = true
      this.$nextTick(() => {
        this.isActive = !this.isActive;
      })
    },
    clickShadow() {
      this.isActive = false;
    },
    clickNextItem(targetItem, next = false) {

      if (this.itemNavBehavior==='split') {
        if (next) {
          this.slideToNext(targetItem);
        } else if (targetItem.url) {
          this.$router.push(targetItem.url)
          this.isActive = false
          return
        }
      }

      if (targetItem.url && (!targetItem.children || !targetItem.children.length)) {
        this.$router.push(targetItem.url)
        this.isActive = false
        return
      }

      if (this.isTranslating || !targetItem.children || targetItem.children.length <= 0) {
        return;
      }

      this.slideToNext(targetItem);
    },
    clickPrevItem() {

      if (this.isTranslating || !this.currentItemHasParent) {
        this.isActive = false
        return;
      }

      this.slideToPrev();
    },

    /*
     * main part of core
     * definite of how to handle panel sliding and item updating
     */
    slideToNext(targetItem) {

      // set target item as content of next panel
      this.content_setNextItem(targetItem);

      // switch animation on
      this.setTranslating(true);

      // activate panel sliding with animation after `.translating` class has updated to panel dom.
      this.$nextTick(() => {
        this.panel_slideNext();
      });

      // reset panel position
      this.homingAfterTranslatingNext();
    },
    slideToPrev() {

      // set prev item which is the parent of the current item.
      this.content_setPrevItem();

      // switch animation on
      this.setTranslating(true);

      // activate panel sliding with animation after `.translating` class has updated to panel dom.
      this.$nextTick(() => {
        this.panel_slideBack();
      });

      // reset panel position
      this.homingAfterTranslatingBack();
    },

    // handle homing after slide animation end
    homingAfterTranslatingNext() {
      setTimeout(() => {

        // switch off transition state of panel
        this.setTranslating(false);

        // push current to parent stack
        this.content_pushCurrentToParentStack();

        // homing
        this.panel_homingPosition(); // reset panel position just like the beginning.
        this.content_homingItemAfterNext(); // change item between these panels to meet updated panel position.
      }, this.menuSwitchSpeed);
    },
    homingAfterTranslatingBack() {
      setTimeout(() => {
        this.setTranslating(false);

        // homing
        this.panel_homingPosition();
        this.content_homingItemAfterBack();
      }, this.menuSwitchSpeed);
    },

    // utils
    setTranslating(status) {
      this.isTranslating = status;
    },
  },
};
</script>
