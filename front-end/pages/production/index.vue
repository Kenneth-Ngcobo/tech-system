<template>
<div>

  
  <b-card no-body >
        <b-tabs card >

       

        <div class="row" style="margin:1% 0 0 1%">
            <div class="col-md-4">
                <span v-if="tab < 3">
                    <strong>Search</strong>
                    <input type="text" style="width:50%">
                </span>
            </div>
            <div class="col-md-4">
                <span v-if="($auth.user.username == 'Kenneth' || $auth.user.username == 'Chetan') && tab < 3">
                    <b-button v-if="!edit" @click="edit = true">Edit</b-button>
                    <b-button v-else @click="edit = false">Cancel</b-button>
                    <b-button @click="saveChanges()">Save</b-button>
                </span>
                
            </div>
             <div class="col-md-4">

            </div>

        </div>
            
        
            
            <b-tab title="JHB (WH3) Stock" @click="tab = 1">
               
                <!--mfd-stock v-if="stock1.length" :products="products" :stock="stock1" :orig_products="orig_products" @saveChanges="saveChanges"></mfd-stock-->
                <table class="table table-bordered table-hover table-striped" style="width:90%; margin-top:0%; font-size:13px">
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
                            <td style="width:5%" class="center">{{findStock(prod.code, 1).Qty}}</td>
                            <td style="width:5%" class="center">{{findStock(prod.code, 1).QtyOnSO}}</td>
                            <td style="width:5%;" class="available center">{{Available(prod.code, 1)}}</td>
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
                            <td style="width:5%" class="center">{{findStock(prod.code, 1).Qty}}</td>
                            <td style="width:5%" class="center">{{findStock(prod.code, 1).QtyOnSO}}</td>
                            <td style="width:5%;" class="available center">{{Available(prod.code, 1)}}</td>
                            <td style="width:15%" v-if="!edit">{{prod.comments}}</td>
                            <td style="width:15%" id="mod" v-else><input type="text" v-model="prod.comments" style="width:100%"></td>
                        </tr>
                    </tbody>
                </table>
            </b-tab>
            <b-tab title="CPT (WH8) Stock" @click="tab = 2">
                <table class="table table-bordered table-hover table-striped" style="width:90%; margin-top:0%; font-size:13px">
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
                            <td style="width:5%" class="center">{{findStock(prod.code, 2).Qty}}</td>
                            <td style="width:5%" class="center">{{findStock(prod.code, 2).QtyOnSO}}</td>
                            <td style="width:5%;" class="available center">{{Available(prod.code, 2)}}</td>
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
                            <td style="width:5%" class="center">{{findStock(prod.code, 2).Qty}}</td>
                            <td style="width:5%" class="center">{{findStock(prod.code, 2).QtyOnSO}}</td>
                            <td style="width:5%;" class="available center">{{Available(prod.code, 2)}}</td>
                            <td style="width:15%" v-if="!edit">{{prod.comments}}</td>
                            <td style="width:15%" id="mod" v-else><input type="text" v-model="prod.comments" style="width:100%"></td>
                        </tr>
                    </tbody>
                </table>        
        
            </b-tab>
            <b-tab title="Sell-Off (WH20)" @click="tab = 3">
                <sell-off :stock="stock3"></sell-off>
            </b-tab>
            <b-tab title="MRP" @click="tab = 4">
             <sos :bins="bins" :order_status="order_status"></sos>
            </b-tab>
            <b-tab title="POs" @click="tab = 5">
               <pos :vendors="vendors"></pos>
            </b-tab>
        </b-tabs>
  </b-card>

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
import sellOff from '../../components/production/sellOff'
import pos from '../../components/production/pos'
import sos from '../../components/production/sos'
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css'




export default {
    middleware: ['auth'],

    components: { sellOff, pos, sos, VueContext},

    data() {
        return {
            products: [],
            orig_products: [],
            stock1: [],
            stock2: [],
            stock3: [],
            vendors: [],
            bins: [],
            order_status: [],
            edit: false,
            changes: [],
            new_products: [],
            tab: 1
        }
    },

    methods: {

     
        async saveChanges() {
            this.changes = []
            this.new_products = []
            for(let i = 0; i<this.products.length; i++) {
                this.products[i].prio = i
                let changed_obj = {}
                let push = false
                let orig_product = this.orig_products.find(p => p.id == this.products[i].id)
               
                if(orig_product != undefined) {
                     for(var key in this.products[i]) {
                        //console.log('i = ', i)
                        //console.log('this.products[i] = ', this.products[i])
                      
                        
                        if(this.products[i][key] != orig_product[key]) {
                            changed_obj[key] = this.products[i][key]
                            push = true
                            
                        } 
                    }
                    if(push) {
                        changed_obj.id = this.products[i].id
                        this.changes.push(changed_obj)
                    }
                }
                else {
                    this.new_products.push(this.products[i])
                }
            }
            if(this.changes.length > 0) {
                await this.$axios.$post('/change_stock', {changes: JSON.stringify(this.changes)})
            }

            for(let i = 0; i<this.new_products.length; i++) {
                this.new_products[i].prio = (this.products.length+i)-1
                await this.$axios.$post('/add_product', this.new_products[i])
            }
            
            let products = await this.$axios.$get('/stock_products')
            this.products = products.sort((a,b) => a['prio'] - b['prio'])
            this.orig_products = JSON.parse(JSON.stringify(this.products))
            this.stock1 = await this.$axios.$post('/stock', {products: JSON.stringify(this.products)})
            this.stock2 = await this.$axios.$post('/stock2', {products: JSON.stringify(this.products)})
            this.edit = false
            
        },

        Available(code, wh) {
            let dif = this.findStock(code, wh).Qty - this.findStock(code, wh).QtyOnSO
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

        findStock(code, wh) {
            let item = undefined
            if(wh == 1) {
                item = this.stock1.find(i => i.Code == code)
            }
            if(wh == 2) {
                item = this.stock2.find(i => i.Code == code)
            }
            //console.log(item)
            if(item != undefined) {
                return {Qty: item.Qty, QtyOnSO: item.WHQtyOnSO}
            }
            else {
                return {Qty: 'Not found', QtyOnSO: 'Not found'}
            }
        },

        /*async saveChanges() {
            this.$emit('saveChanges')
            this.edit = false
        }*/
    },

    created: async function() {
        let products = await this.$axios.$get('/stock_products')
        this.products = products.sort((a,b) => a['prio'] - b['prio'])
        this.orig_products = JSON.parse(JSON.stringify(this.products))
        this.stock1 = await this.$axios.$post('/stock', {products: JSON.stringify(this.products)})
        this.stock2 = await this.$axios.$post('/stock2', {products: JSON.stringify(this.products)})
        this.stock3 = await this.$axios.$get('/stock3')
        this.vendors = await this.$axios.$get('/vendors')
        this.bins = await this.$axios.$get('/bins')
        this.order_status = await this.$axios.$get('/order_status')
        this.order_status.unshift({id: 0, status: 'All'})
    },

   /*async fetch() {
        
   },*/
    
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