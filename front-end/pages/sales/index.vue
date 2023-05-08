<template>
<div>
  <b-card no-body >
        <b-tabs card >
            <b-tab title="Forecast">
                <quotes :range="range" :fittings="fittings" :project_status="project_status" :quote_status="quote_status" :sales_reps="sales_reps"></quotes>
            </b-tab>
            <b-tab title="Quotes To SOs">
               <sos :projects="projects" :project_status="project_status" :quote_status="quote_status" :accessories="accessories"></sos>
            </b-tab>
            
        </b-tabs>
  </b-card>
 
   
</div>
</template>

<script>
import quotes from '../../components/sales/quotes'
import sos from '../../components/sales/sos'


export default {
    middleware: ['auth'],

    components: { quotes, sos},

    data() {
        return {
            projects: [],
            range: [],
            fittings: [],
            project_status: [],
            quote_status: [],
            sales_reps: [],
            accessories: []
        }
    },

    methods: {

      
    },

    created: async function() {
        this.projects = await this.$axios.$get('/projects')
        
        this.range = await this.$axios.$get('/range') //sfa_fittings
        this.range.unshift({RangeDescription: "All", nRangeID: 0})

        //this.fittings = await this.$axios.$get('sfa_fittings')

        this.project_status = await this.$axios.$get('/project_status') //project_status
        this.project_status.unshift({ProjectStatusID: 0, Description: "All"})
        
        this.quote_status = await this.$axios.$get('/quote_status') //quote_status
        this.quote_status.unshift({QuotationStatusID: 0, Description: "All"})

        this.sales_reps = await this.$axios.$get('/sfa_reps')
        this.sales_reps.unshift({EmployeeID: 0, Name: 'All'})

        this.accessories = await this.$axios.$get('/accessories')


    }
    
}
</script>

<style scoped>

</style>