<template>
<div>
    <strong>Search</strong>
    <input type="text" style="width:20%; margin-bottom:0.5%" v-model="search" placeholder="Search Items">
   <table class="table table-bordered table-hover table-striped" style="width:60%; margin-top:0%; font-size:13px">
        <thead>
            <tr>
                <th>Item Code</th>
                <th>Item Description</th>
                <th>Qty on Hand</th>
                <th>Qty on SO</th>
                <th>Available</th>
                <th>Proj. Price Exl</th>
                
            </tr>
            
            
        </thead>
        <tbody>
            <tr v-for="i in filterStock()" :key="i.StockLink">
                <td>{{i.Code}}</td>
                <td>{{i.cExtDescription}}</td>
                <td class="center">{{i.Qty_On_Hand}}</td>
                <td class="center">{{i.QtyOnSO}}</td>
                <td class="available center">{{i.Qty_On_Hand - i.QtyOnSO}}</td>
                <td class="center">R{{i.fExclPrice}}</td>
            </tr>
        </tbody>
    </table>

</div>
</template>

<script>
export default {
    props: ['stock'],
    data() {
        return {
            //stock: [],
            search: ''
        }
    },

    methods: {
        filterStock() {
             return this.stock.filter(s => 
                
                {
                    const des = s.cExtDescription.toString().toLowerCase();
                    const code = s.Code.toString().toLowerCase()
                    const searchTerm = this.search.toLowerCase();

                    return des.includes(searchTerm) ||  code.includes(searchTerm)
                })
        }
    }, 

    created: async function() {
        //this.stock = await this.$axios.$get('/stock3')
    }
    
}
</script>

<style scoped>

thead {
    position: sticky;
    top: 5px;
    background-color:rgb(110, 112, 114); 
    color:white;
}

.table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
  background-color: yellow;
}

.available {
    background-color:#00FF7F
}

.available:hover {
    background-color: yellow;
}

.center {
    text-align: center
}

</style>