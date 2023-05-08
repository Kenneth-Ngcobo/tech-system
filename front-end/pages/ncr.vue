<template>
<div>
    <nuxt-child :tabIndex="tabIndex" :ncrs="ncrs" :filter2="filter2" :products="products" :components="components" :joined_ncr="joined_ncr" :fittings="fittings"  
    :rec="rec" :new_rec="new_rec" :my_rec="my_rec" :my_orig_rec="my_orig_rec" :stock_items="stock_items" :suppliers="suppliers"
    @reloadNCRs="reloadNCRs" @clearFilters="clearFilters" @changeTabIndex="changeTabIndex" @loadPastelNCR="loadPastelNCR"></nuxt-child>
</div>
</template>

<script>
export default {
    data() {
        return {
            ncrs: [],
            products: [],
            components: [],
            joined_ncr: [],
            fittings: [],
            
            filter2: {region: 'All', type: 'All', liable_entity: 'All', maint_status: 'All', reg_status: 'All', from: '', to: '', charge: 'All'},
            tabIndex: 0,
            new_rec: [],
            rec: [],
            my_rec: [],
            my_orig_rec: [],
            sos: [],
            stock_items: [],
            suppliers: []
        }
    },

    methods: {

        
        changeTabIndex(index) {

            this.tabIndex = index
        },

        clearFilters() {
            
            this.filter2 = {region: 'All', type: 'All', liable_entity: 'All', maint_status: 'All', reg_status: 'All',  from: '', to: this.today(), charge: 'All'}
            
        },

        async reloadNCRs() {
            /*this.ncrs = await this.$axios.$get('/ncr')
            this.products = await this.$axios.$get('/ncr_products')
            this.components = await this.$axios.$get('/ncr_components')*/
            console.log('Reload called on NCR mother page')
            this.joined_ncr = await this.$axios.$get('/joined_ncr')
            this.joined_ncr.forEach(n => {
                n.selected = false
            })
            this.$forceUpdate()

            //window.sessionStorage.joined_ncr = JSON.stringify(this.joined_ncr)

        },

        async loadPastelNCR() {
            this.new_rec = []
            this.rec = await this.$axios.$get('/pastel_maint') //pastel maintenance records
            this.sos = this.rec.map(r => r.OrderNum)
            //console.log(this.rec.length)
            this.my_rec = await this.$axios.$post('/pastel_ncr', {sos: JSON.stringify(this.sos)}) //get existing records

            this.my_rec.forEach(r => {
                if(r.team != null) {
                    r.team = r.team.split(",")
                }
                else {
                    r.team = []
                }

                } 
            )
            
            for(let i = 0; i<this.rec.length; i++) { //Only new maintenance records are loaded on mysql
                let exist = this.my_rec.find(r => r.AutoIndex == this.rec[i].AutoIndex) 
                if(exist == undefined) {
                    this.new_rec.push(this.rec[i]) //push new records
                }
            
            }
            await this.$axios.$post('/add_pastel_ncr', {new_rec: JSON.stringify(this.new_rec)}) //post new records
            
            this.my_rec = []
            this.my_rec = await this.$axios.$post('/pastel_ncr', {sos: JSON.stringify(this.sos)})

            //this.my_rec = this.my_rec.concat(this.new_rec) //new records not saved on database

            this.my_orig_rec = JSON.parse(JSON.stringify(this.my_rec))
        },

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },
    },

    created: async function() {
        if(this.filter2.to.length == 0) {
            this.filter2.to = this.today()
        }
        await this.reloadNCRs()
        
        await this.loadPastelNCR()
        let fittings = await this.$axios.$get('/sfa_fittings')
        this.fittings = fittings//.recordset
        this.fittings.unshift({FittingCode: '001', FittingName: 'Sita Tower', nFittingID: 0, nFittingRange: 0})
        this.stock_items = await this.$axios.$get('/stock_items')
        this.suppliers = await this.$axios.$get('/vendors')

       
        
    }
}
</script>

<style scoped>

</style>