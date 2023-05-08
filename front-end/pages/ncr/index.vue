<template>
<div>
    <b-card no-body >
        <b-tabs card v-model="ncr_tab">
            <b-tab title="NCR Log" @click="changeTab(0)">
               
                <ncr-log v-if="joined_ncr.length>0" :joined_ncr="joined_ncr" :tabindex="tabIndex" :products="products" :components="components"  :fittings="fittings" :filter2="filter2" :suppliers="suppliers" @reloadNCRs="$emit('reloadNCRs')"></ncr-log>
            </b-tab>
            <b-tab title="Maintenance Scheduling" @click="changeTab(1)">
                <pastel :joined_ncr="joined_ncr" :stock_items="stock_items" :fittings="fittings" :new_rec="new_rec" :rec="rec" :my_rec="my_rec" :my_orig_rec="my_orig_rec" @reloadNCRs="$emit('reloadNCRs')" @loadPastelNCR="$emit('loadPastelNCR')"></pastel>
            </b-tab>

            <b-tab title="Supplier Audit" @click="changeTab(2)">
                <supplier></supplier>
            </b-tab>

            <b-tab title="Projects" @click="changeTab(3)">
                <projects></projects>
            </b-tab>

        </b-tabs>
  </b-card>

</div>
</template>

<script>
import ncrLog from '../../components/ncr/ncrLog'
import pastel from '../../components/ncr/pastel.vue'
import projects from '../../components/ncr/projects.vue'
import supplier from '../../components/ncr/supplier_audit.vue'

export default {

    middleware: ['auth'],

    components: { ncrLog, pastel, projects, supplier },

    props: ['tabIndex','products', 'components', 'joined_ncr', 'fittings', 'filter2', 'new_rec', 'rec', 'my_rec', 'my_orig_rec', 'stock_items', 'suppliers'],

    data() {
        return {
            ncr_tab: 0
        }
    },

    methods: {
        changeTab(index) {
            window.sessionStorage.ncr_tab = JSON.stringify(index)
        }
    },

    created() {
        if(window.sessionStorage.hasOwnProperty('ncr_tab'))
        {
          this.ncr_tab = JSON.parse(window.sessionStorage.ncr_tab)
          console.log('ncr_tob = ', window.sessionStorage.ncr_tab)
        }

    },

    mounted() {
        console.log('parent2 mounted this.joined_ncr.length = ', this.joined_ncr.length)
    }


    
}
</script>

<style scoped>

</style>