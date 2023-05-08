<template>
<div>
    <span class="close" @click="$emit('closeReport')">&times;</span>
    <table class="table table-bordered table-striped table-hover" style="font-size:13px;">
        <thead>
            <th>NCR No</th>
            <th>Site/Department</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Issue Category</th>
            <th>Failure Description</th>
        </thead>
        <tbody>
            <tr v-for="r in prod_report" :key="r.ncr_no">
                <td><nuxt-link :to="`/ncr/${r.ncr_no}`" target="_blank">{{r.ncr_no}}</nuxt-link></td>
                <td>{{r.site}}</td>
                <td>{{productName(r)}}</td>
                <td>{{r.qty}}</td>
                <td>{{r.category}}</td>
                <td>{{r.failure}}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    props: ['filter'],
    data() {
        return {
            prod_report: []
        }
    }, 

    methods: {
        productName(prod) {
            let name = prod.product_name
            if(prod.wattage != null) {
                if(prod.wattage.length>0) {
                    name = name + ' ' + prod.wattage+'W' 
                }
            }
            if(prod.length != null) {
                if(prod.length.length>0) {
                    name = name + ' ' + prod.length+'mm' 
                }
            }
            if(prod.dimming != null) {
                if(prod.dimming.length>0) {
                    name = name + ' ' + prod.dimming
                }
            }
            if(prod.bb) {
                name = name + ' BB' 
            }
          return name  
           
        }
    },

    created: async function() {
        this.prod_report = await this.$axios.$post('/product_report', this.filter)
    }
}
</script>

<style scoped>

.close {
  color: rgb(66, 63, 63);
  float: right;
  font-size: 45px;
  font-weight: bold;
  /*margin-top: -1%;*/
}
.close:hover,
.close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}

.table-stripedd>tbody>tr:nth-child(odd)>td:hover {
    background-color: yellow; /* Choose your own color here */
}

</style>