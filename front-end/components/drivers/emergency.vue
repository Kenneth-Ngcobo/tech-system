<template>
<div>
    <table class="table table-bordered" style="font-size: 13px; width:90%">
        <thead>
            <tr>
                <th>Range <select style="width:20px;"><option v-for="(r,index) in range" :key="index">{{r}}</option></select></th>
                <th>Product <select style="width:20px;">
                    <option value=""><input type="text" style="width:100%"></option>
                    <option v-for="(p,index) in products" :key="index">{{p}}</option></select></th>
                <th>EM Output</th>
                <th>Duration</th>
                <th>Integration</th>
                <th>Self-Testing</th>
                <th>Stock Code</th>
                <th>Description</th>
                <th>Battery Type</th>
                <th>Dimensions</th>
                <th>Stock</th>
                <th>Last Cost</th>
             </tr>
            
        </thead>
        <tbody>
            <tr v-for="em in em_units" :key="em.id">
                <td>{{em.range}}</td>
                <td>{{em.product}}</td>
                <td>{{em.em_output}}%</td>
                <td>{{em.duration}}</td>
                <td>{{em.integration}}</td>
                <td>{{em.self_testing}}</td>
                <td>{{em.stock_code}}</td>
                <td>{{findStock(em.stock_code).Description_1}}</td>
                <td>{{em.battery_type}}</td>
                <td>{{em.dimensions}}</td>
                <td>{{findStock(em.stock_code).Qty_On_Hand}}</td>
                <td>R{{Math.round(findStock(em.stock_code).LatUCst)}}</td>
            </tr>
        </tbody>
    </table>

</div>
</template>

<script>
export default {
    data() {
        return {
            em_units: [],
            sage_em: [],
            range: [],
            products: [] 
        }
    },

    methods: {

        findStock(code) {
            let em = this.sage_em.find(d => d.Code == code)
            if(em != undefined) {
                return em
            }
            else return {}
        },

    },

    created: async function() {
        this.em_units = await this.$axios.$get('/em_units')
        this.sage_em = await this.$axios.$post('/sage_em', {em_units: JSON.stringify(this.em_units)})
        this.range = this.em_units.map(item => item.range.trim().toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
        this.range.unshift("")
        this.products = this.em_units.map(item => item.product.trim().toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
       // this.products.unshift("")
        
    }
}
</script>

<style scoped>

</style>