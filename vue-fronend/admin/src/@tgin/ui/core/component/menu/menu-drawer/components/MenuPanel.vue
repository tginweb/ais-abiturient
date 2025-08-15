<template>
  <div class="MenuPanel">
    <div
        :style="[
                functionalityStyle,
                positionStyle,
                (isTranslating) ? transitionStyle : {}
            ]"
        class="Menu__panel"
    >
      <div v-if="list.label" class="Menu__header bg-primary q-px-md">

        <q-btn
            dense
            flat
            @click="handleHeaderClicked"
        >
          <q-icon
              :name="$icons.chevronLeft"
              class="q-mr-md"
              size="14px"
          />
          {{ list.label }}
        </q-btn>

        <q-btn
            :icon="$icons.close"
            class="q-ml-auto"
            dense
            flat
            size="8px"
            @click="handleClose"
        />

      </div>

      <component :is="isTranslating ? 'div' : 'q-scroll-area'" style="height: calc(100vh - 50px)" visible>

        <ul class="Menu__list">

          <li
              v-for="item in listComp"
              class="Menu__item q-px-md"
              @click="handleItemClicked(item)"
          >

            <div
                v-if="item.icon"
                class="item-image q-mr-md  flex items-center"
            >
              <q-icon
                  :name="$icons[item.icon] ? $icons[item.icon] : item.icon"
                  class="q-mx-auto"
                  size="30px"
              />
            </div>
            <div
                v-else-if="item.image"
                :src="item.image.SRC"
                :style="{
                  backgroundImage: 'url('+item.image.SRC+')'
                }"
                class="item-image q-mr-md"
            >
            </div>
            <div
                v-else
                class="item-image q-mr-md"
            />

            <div class="text">{{ item.label }}</div>

            <q-btn
                v-if="item.children && (item.children.length > 0)"
                :icon="$icons.chevronRight"
                dense
                flat
                size="14px"
                class="q-ml-auto"
                @click.stop="handleItemClicked(item, true)"
            />

          </li>
        </ul>

      </component>


    </div>
  </div>
</template>

<script>
import RightArrowIcon from '../icons/RightArrowIcon.vue';
import LeftArrowIcon from '../icons/LeftArrowIcon.vue';
import {QIcon} from 'quasar'

export default {
  components: {
    RightArrowIcon,
    LeftArrowIcon,
    QIcon
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
    positionStyle: {
      type: Object,
      required: true,
    },
    showHeaderArrow: {
      type: Boolean,
      default: false,
    },
    isTranslating: {
      type: Boolean,
      default: false,
    },
    handleHeaderClicked: {
      type: Function,
      default: () => {
      },
    },
    handleItemClicked: {
      type: Function,
      default: () => {
      },
    },
    handleClose: {
      type: Function,
      default: () => {
      },
    },

    // @TODO: create createMenuPanel.js to assign `functionalityStyle` which is not diff from next, staging, and prev panel in parent component.
    functionalityStyle: {
      type: Object,
      required: true,
    },
    transitionStyle: {
      type: Object,
      required: true,
    },
  },
  computed: {
    listComp() {
      return this.list.children && this.list.children.map(item => ({
        ...item,
        image: item.image ? {
          ...item.IMAGE,
          SRC: this.$image.resolveUrl(item.image.SRC, 'r200')
        } : null
      }))
    }
  }
};
</script>

<style lang="scss" scoped>

ul {
  padding: 0;
  margin: 0;
}

li {
  margin: 0;
}

.Menu__header {
  display: flex;
  align-items: center;
  height: 50px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  .arrow {
    padding-top: 2px;
    fill: #fff;
    margin-right: 10px;
    width: 10px;
    height: 100%;
    display: flex;
    align-items: center;
  }
}

.Menu__list {
  list-style: none;
  padding-bottom: 2px;

  .separator {
    border-bottom: 1px solid #d5dbdb;
    padding: 2px 0 0 0;
    margin: 0;
  }
}

.Menu__item {
  color: #4a4a4a;
  height: 55px;
  display: flex;
  align-items: center;
  cursor: pointer;

  a {
    color: #4a4a4a;
    text-decoration: none;
  }

  .text {
    font-size: 15px;
  }

  .arrow {

  }
}

.item-image {
  width: 42px;
  height: 37px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
}
</style>
