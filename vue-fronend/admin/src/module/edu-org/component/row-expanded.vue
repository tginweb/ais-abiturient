<template>

   <div>

     <q-tree
       v-if="row.subdocsTree"
       :nodes="row.subdocsTree"
       children-key="children"
       label-key="label"
       node-key="key"
       selected-color="primary"
       :ticked.sync="ticked"
       tick-strategy="strict"
     >
       <template v-slot:default-header="prop">

         <div class="flex items-center full-width q-pb-xs no-wrap" style="border-bottom: 1px dotted #ddd">

           <div class="text-weight-bold">

             {{ prop.node.label }} [{{prop.node.key}}]

             <span v-if="prop.node.id">
               [{{ prop.node.id }}]
             </span>

           </div>

           <div class="q-ml-auto text-right flex q-gutter-x-md" v-if="prop.node.epgu">

             <div>
               {{ prop.node.epgu.step || '' }}
             </div>

             <div>

               {{ prop.node.epgu.status || '' }}

               <q-tooltip :hide-delay="2000">

                 <ul v-if="prop.node.epgu.statusMessage" style="font-size: 19px;">
                   <li v-for="(item, index) of prop.node.epgu.statusMessage" :key="index">
                     {{item}}
                   </li>
                 </ul>

               </q-tooltip>
             </div>

             <div>
               <q-icon
                  :name="prop.node.epgu.exported ? 'check_circle' : 'remove_circle'"
                  :color="prop.node.epgu.exported ? 'primary' : 'red'"
               />
             </div>

           </div>

         </div>
       </template>

     </q-tree>

   </div>
</template>

<script>

export default {
  props: {
    row: {},
    tickedRows: {default: () => []}
  },
  data() {
    return {
      ticked: this.tickedRows,
    }
  },

  watch: {
    tickedRows(val) {
      this.ticked = val
    },
    ticked(val) {
      this.$emit('update:tickedRows', val)
    }
  }
}
</script>

<style lang="scss" scoped>


</style>
