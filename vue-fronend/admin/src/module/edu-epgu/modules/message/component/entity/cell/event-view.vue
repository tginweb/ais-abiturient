<template>

  <div>
    <q-expansion-item
        v-model="expanded"
        label="Развернуть"
        switch-toggle-side
    >
      <component
          :is="row.type"
          :row="row"
      />
    </q-expansion-item>
  </div>

</template>

<script>

import EpguCompetitiveGroupListChange from './epgu-view/EpguCompetitiveGroupListChange'
import EpguApplication from './epgu-view/EpguApplication'
import EpguApplicationCancel from './epgu-view/EpguApplicationCancel'
import EpguCompetitiveGroupPriorityListChange from './epgu-view/EpguCompetitiveGroupPriorityListChange'
import PersonProfileChange from './epgu-view/PersonProfileChange'
import EpguApplicationChange from './epgu-view/EpguApplicationChange'
import EpguTestAgreed from './epgu-view/EpguTestAgreed'
import EpguOriginalEducationDocument from './epgu-view/EpguOriginalEducationDocument'
import * as cells from "~module/edu-epgu/modules/message/component/entity/cell/index";

export default {
  components: {
    EpguOriginalEducationDocument,
    EpguTestAgreed,
    PersonProfileChange,
    EpguApplication,
    EpguCompetitiveGroupListChange,
    EpguApplicationCancel,
    EpguApplicationChange,
    EpguCompetitiveGroupPriorityListChange
  },
  props: {
    row: {},
  },
  data() {
    return {
      expanded: false
    }
  },
}
</script>

<style lang="scss" scoped>


</style>
