<template>

  <div>

    <vue-final-modal
        :value="true"
        classes="modal-container"
        content-class="modal-content"
        v-for="(vroute, index) of $store.state.router.vroutes"
        :key="vroute.uid"
    >
      <button class="modal__close" @click="showModal = false">
        X
      </button>
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">

        <component
            :is="vroute.is"
            :ref="'vroute-'+index"
            v-bind="vroute.props"
            :vrouterIndex="index"
            vrouterType="dialog"
        />
      </div>
    </vue-final-modal>


  </div>

</template>
<script>

import {ModalsContainer, VueFinalModal} from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
    ModalsContainer
  },
  props: {},
  data() {
    return {}
  },
}
</script>
<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}

.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}

.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
