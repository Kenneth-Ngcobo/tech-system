<template>
<div>

<center v-if="$auth.user.username == 'Kenneth' || $auth.user.username == 'Chetan'">
    <b-button v-if="!edit" @click="edit = true">Edit</b-button>
    <b-button v-else @click="edit = false">Cancel</b-button>
    <b-button @click="saveChanges()">Save</b-button>
</center>


<table class="table table-bordered table-hover table-striped" style="width:90%; margin-top:1%; font-size:13px">
    <thead>
        <tr>
            <th colspan="7" style="text-align: center">Description</th>
            <th colspan="6" style="text-align: center">Stock Level</th>
        </tr>
        
        <tr>
            <th>Fitting</th>
            <th>Product Code</th>
            <th>Length</th>
            <th>Colour</th>
            <th>Current</th>
            <th>CCT</th>
            <th>Lens</th>
            <th>Min</th>
            <th>Max</th>
            <th>WH3 Stock</th>
            <th>Qty on SO</th>
            <th>Available</th>
            <th>Comments</th>
        </tr>
        
    </thead>
    <draggable v-model="products" tag="tbody" preventOnFilter: false  v-if="$auth.user.username == 'Kenneth' || $auth.user.username == 'Chetan'">       
        <tr v-for="prod in products" :key="prod.id" style="width:100%" @contextmenu.prevent="$refs.menu.open($event, prod)">
            <td style="width:10%" v-if="!edit">{{prod.name}}</td>
            <td style="width:10%" id="mod" v-else><input type="text" v-model="prod.name" style="width:100%"></td>
            <td style="width:18%" v-if="!edit">{{prod.code}}</td>
            <td style="width:18%" id="mod" v-else><input type="text" v-model="prod.code" style="width:100%"></td>
            <td style="width:7%" v-if="!edit">{{prod.length}}</td>
            <td style="width:7%" id="mod" v-else><input type="text" v-model="prod.length" style="width:100%"></td>
            <td style="width:6%" v-if="!edit">{{prod.colour}}</td>
            <td style="width:6%" id="mod" v-else><input type="text" v-model="prod.colour" style="width:100%"></td>
            <td style="width:7%" v-if="!edit">{{prod.current}}</td>
            <td style="width:7%" id="mod" v-else><input type="text" v-model="prod.current" style="width:100%"></td>
            <td style="width:6%" v-if="!edit">{{prod.cct}}</td>
            <td style="width:6%" id="mod" v-else><input type="text" v-model="prod.cct" style="width:100%"></td>
            <td style="width:8%" v-if="!edit">{{prod.lens}}</td>
            <td style="width:8%" id="mod" v-else><input type="text" v-model="prod.lens" style="width:100%"></td>
            <td style="width:5%" class="center" v-if="!edit">{{prod.min}}</td>
            <td style="width:5%" class="center" id="mod" v-else><input type="text" v-model="prod.min" style="width:100%"></td>
            <td style="width:5%" class="center" v-if="!edit">{{prod.max}}</td>
            <td style="width:5%" class="center" id="mod" v-else><input type="text" v-model="prod.max" style="width:100%"></td>
            <td style="width:5%" class="center">{{findStock(prod.code).Qty}}</td>
            <td style="width:5%" class="center">{{findStock(prod.code).QtyOnSO}}</td>
            <td style="width:5%;" class="available center">{{Available(prod.code)}}</td>
            <td style="width:15%" v-if="!edit">{{prod.comments}}</td>
            <td style="width:15%" id="mod" v-else><input type="text" v-model="prod.comments" style="width:100%"></td>
        </tr>
    </draggable>
    <tbody v-else>
        <tr v-for="prod in products" :key="prod.id" style="width:100%">
            <td style="width:10%" v-if="!edit">{{prod.name}}</td>
            <td style="width:10%" id="mod" v-else><input type="text" v-model="prod.name" style="width:100%"></td>
            <td style="width:18%" v-if="!edit">{{prod.code}}</td>
            <td style="width:18%" id="mod" v-else><input type="text" v-model="prod.code" style="width:100%"></td>
            <td style="width:7%" v-if="!edit">{{prod.length}}</td>
            <td style="width:7%" id="mod" v-else><input type="text" v-model="prod.length" style="width:100%"></td>
            <td style="width:6%" v-if="!edit">{{prod.colour}}</td>
            <td style="width:6%" id="mod" v-else><input type="text" v-model="prod.colour" style="width:100%"></td>
            <td style="width:7%" v-if="!edit">{{prod.current}}</td>
            <td style="width:7%" id="mod" v-else><input type="text" v-model="prod.current" style="width:100%"></td>
            <td style="width:6%" v-if="!edit">{{prod.cct}}</td>
            <td style="width:6%" id="mod" v-else><input type="text" v-model="prod.cct" style="width:100%"></td>
            <td style="width:8%" v-if="!edit">{{prod.lens}}</td>
            <td style="width:8%" id="mod" v-else><input type="text" v-model="prod.lens" style="width:100%"></td>
            <td style="width:5%" class="center" v-if="!edit">{{prod.min}}</td>
            <td style="width:5%" class="center" id="mod" v-else><input type="text" v-model="prod.min" style="width:100%"></td>
            <td style="width:5%" class="center" v-if="!edit">{{prod.max}}</td>
            <td style="width:5%" class="center" id="mod" v-else><input type="text" v-model="prod.max" style="width:100%"></td>
            <td style="width:5%" class="center">{{findStock(prod.code).Qty}}</td>
            <td style="width:5%" class="center">{{findStock(prod.code).QtyOnSO}}</td>
            <td style="width:5%;" class="available center">{{Available(prod.code)}}</td>
            <td style="width:15%" v-if="!edit">{{prod.comments}}</td>
            <td style="width:15%" id="mod" v-else><input type="text" v-model="prod.comments" style="width:100%"></td>
        </tr>
    </tbody>
</table>

<vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <!--ul-->
        <template v-if="data">
            <li v-if="!edit" @click="edit = true"><a>Edit</a></li>
            <li v-else @click="edit = false"><a>Cancel</a></li>
            <li v-on:click.prevent="addNew()"><a>Add New</a></li>
            <li v-on:click.prevent="deleteProduct(data)"><a>Delete</a></li>
            <li @click="saveChanges()"><a>Save</a></li>
        </template>
      <!--/ul-->   
</vue-context>



</div>
</template>

<script>
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css'
export default {
    //middleware: ['auth'],
    components: { VueContext },
    props: ['products', 'orig_products', 'stock'],

    data() {
        return {
            //products: [],
            //stock: [],
            edit: false,
            //orig_products: [],
            changes: [],
            new_products: [],
      
        }
    },

    computed: {
        
    },

    methods: {

       

        Available(code) {
            let dif = this.findStock(code).Qty - this.findStock(code).QtyOnSO
            if(dif >= 0) {
                return dif
            }
            else {
                return 0
            }
        },

        addNew() {
            this.products.push({})
            window.scrollTo(0, document.body.scrollHeight);
            this.edit = true
        },

        async deleteProduct(product) {
            if((`Are you sure you want to delete ${product.code}?`)) {
                product.active = false
                await this.saveChanges()
            }
        },

        findStock(code) {
            let item = this.stock.find(i => i.Code == code)
            //console.log(item)
            if(item != undefined) {
                return {Qty: item.Qty, QtyOnSO: item.WHQtyOnSO}
            }
            else {
                return {Qty: 'Not found', QtyOnSO: 'Not found'}
            }
        },

        async saveChanges() {
            this.$emit('saveChanges')
            this.edit = false
        }
    

    },

    /*async fetch() {
        console.log('fetch products = ', this.products.length)
        this.stock = await this.$axios.$post('/stock2', {products: JSON.stringify(this.products)})
    },*/
   

    created: async function() {
        
        
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

.center {
    text-align: center
}

#mod {
    padding: 0.75rem 0 0.75rem 0;
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


</style>