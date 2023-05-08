<template>
<div>
    <!--h4>{{$route.params.maint}}</h4-->
    <b-card no-body >
        <b-tabs card>
            <b-tab> 
                <template #title><strong>{{maint.OrderNum}}</strong></template>
            <div class="row">
                    <div class="col-lg-6 float-left">
                        <table class="table-bordered" style="width:100%; font-size:13px">
                            <tr>
                                <td><label>Project</label></td>
                                <td colspan="3">{{maint.ProjectName}}</td>
                            </tr>
                            <tr>
                                <td><label>Maint. SO</label></td>
                                <td>{{maint.OrderNum}}</td>
                                <td><label>Orig Inv</label></td>
                                <td>{{maint.ExtOrderNum}}</td>
                            </tr>
                            <tr>
                                <td><label>Logged</label></td>
                                <td v-if="maint.OrderDate">{{maint.OrderDate.split("T")[0]}}</td>
                                <td><label>Due</label></td>
                                <td v-if="maint.DueDate">{{maint.DueDate.split("T")[0]}}</td>
                            </tr>
                            <tr>
                                <td><label>Team</label></td>
                                <td colspan="3"><input type="text" v-model="my_maint.team"></td>
                                
                            </tr>
                            <tr>
                                <td><label>Planned Visit</label></td>
                                <td ><input style="text"  v-model="my_maint.planned_date"></td>
                                <td><label>NCR NO</label></td>
                                <td>{{''}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-lg-6 float-right">
                        <table class="table-bordered" style="width:100%; font-size:13px">
                            <tr>
                                <td><label>Address</label></td>
                                <td>{{maint.Address1}}</td>
                            </tr>
                            <tr>
                                <td><label></label></td>
                                <td>{{maint.Address2}}</td>
                            </tr>
                            <tr>
                                <td><label></label></td>
                                <td>{{maint.Address3}}</td>
                            </tr>
                            <tr>
                                <td><label></label></td>
                                <td>{{maint.Address4}}</td>
                            </tr>
                            <tr>
                                <td><label></label></td>
                                <td>{{maint.Address5}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </b-tab>
        </b-tabs>
    </b-card>
    <b-card no-body style="margin-top:1%">
        <b-tabs card>
            <b-tab>
                 <template #title><strong>Fittings</strong></template>
            <div class="row">
                <table class="table table-bordered">
                    <thead>
                        <th>Fitting</th>
                        <th>Line Note</th>
                        <th>Qty</th>
                        <th>Site Feedback</th>
                    </thead>
                    <tbody>
                        <tr v-for="(p,index) in products" :key="index">
                            <td style="width:25%">{{p.fitting}}</td>
                            <td style="width:20%">{{p.note}}</td>
                            <td style="width:5%">{{p.qty}}</td>
                            <td style="width:40%">
                                <!--input type="text" style="width:100%"-->
                                 <multiselect v-model="p.category" style="margin-bottom:1%" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" 
                                    label="name" track-by="name" :hide-selected="true" :options="options" :multiple="true" :taggable="true" @tag="addTag"
                                   > <!-- -->
                                 </multiselect>
                                <textarea name="" id="" style="width:100%; height:100%" v-model="p.feedback"></textarea>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </b-tab>
            <b-tab>
                 <template #title><strong>Components</strong></template>
                 <table class="table table-bordered" style="width:50%">
                    <thead style="width:100%">
                    <th style="width:85%">Item</th>
                    <th style="width:7.5%">Qty</th>
                    <th style="width:7.5%">Add</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span class="dropdown" style="width:100%" > 
                                <!--select style="width:20px;" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></select-->
                                <input type="text" placeholder="Search item" v-model="search" style="width:100%" @keyup="filterItems($event)" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <div :class="{'dropdown-menu' : true, 'show': show}" style="width:100%">
                                    <!--center><input type="text" style="width:95%; margin-bottom:1%" placeholder="Search Quotes" ></center-->
                                    <a class="dropdown-item" style="white-space:normal" v-for="i in filtered_items" :key="i.StockLink" @click="search = i.Code_Des; show = false; item = i"><span>{{i.Code}} - {{i.Description_1}}</span></a>       
                                </div>
                                </span>
                            </td>
                            <td >
                                <input type="text" style="width:100%" v-model="qty">
                            </td >
                            <td ><b-button @click="addItem()">Add</b-button></td>
                        </tr>
                    </tbody>
                 </table>
                 <center>
                    <b-button v-if="!edit" style="margin-bottom:1%" @click="edit = true">Edit</b-button>
                    <b-button v-else style="margin-bottom:1%" @click="edit = false">Cancel</b-button>
                 </center>
                 <table class="table table-bordered">
                    <thead>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Qty Req</th>
                        <th>Qty Kitted</th>
                        <th>Cost</th>
                        <th>CheckOut</th>
                        <th>Qty Ret</th>
                        <th>CheckIn</th>
                        <th>Del</th>
                    </thead>
                    <tbody>
                        <tr v-for="(i,index) in selected_items" :key="i.StockLink">
                            <td>{{i.Code}}</td>
                            <td>{{i.Description_1}}</td>
                            <td v-if="!edit">{{i.qty}}</td>
                            <td v-else><input type="text" v-model="i.qty"></td>
                            <td v-if="!edit"></td>
                            <td v-else><input type="text"></td>
                            <td>R{{Math.round(i.LatUCst)}}</td>
                            <td><input type="checkbox"></td>
                            <td v-if="!edit"></td>
                            <td v-else><input type="text"></td>
                            <td><input type="checkbox"></td>
                            <td><span class="del" @click="Delete(index)">X</span></td>
                        </tr>
                        <tr>
                           <td colspan="3"></td> 
                           <td style="font-weight:bold">Tot</td>
                           <td style="font-weight:bold">R{{Math.round(totCost())}}</td>
                        </tr>
                    </tbody>
                 </table>

            </b-tab>
        </b-tabs>
    </b-card>

    <center><b-button style="margin:1% 0 1% 0" @click="saveFeedback()">Save</b-button></center>

</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { BasicSelect, ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
export default {
    middleware: ['auth'],
    components: {BasicSelect, ModelListSelect, Multiselect},
    props: ['stock_items'],

    data() {
        return {
            options: [{name:'Faulty Driver'},{name:'Faulty PCB'},{name:'Water/Moister Ingress'},{name:'Incorrect Wiring'},{name:'Overheating'},
                      {name:'Dimming issue'},{name:'Incorrect Spec'},{name:'Poor Quality'},{name:'Loose Connection'},{name:'Other'}],
            options2: ['Faulty Driver','Faulty PCB','Water/Moister Ingress'],
            value: [],
            edit: false,
            show: false,
            maint: {},
            my_maint: {},
            products: [],
            orig_products: [],
            feedback: [],
            comps: [],
            //stock_items: [],
            item: {
               
            },
            qty: '',
            //stock_items: [],
            search: "",
            filtered_items: [],
            selected_items: [],
            orig_comps: []
           
        }
    },


    methods: {

        addTag(p) {
            console.log('p = ', p)
            /*if(p.category == undefined) {
                p.category = []
            }
            p.category.push(p.value[0])*/
        },


        addTag2(p) {
            //console.log('index = ', index)
            let cat = []
            if(p.value.length>0) {
                cat = p.value[0].name
                for(let i = 1; i<p.value.length; i++) {
                    
                    cat = cat + ', ' + p.value[i].name
                }
            }
            if(p.category == undefined) {
                p.category = cat
            }
            else {
                p.category = p.category + ',' + cat
            }
            
            //this.product_obj.category = cat
        
        },

        totCost() {
            let tot = 0
            for(let i = 0; i<this.selected_items.length; i++) {
                tot = tot + this.selected_items[i].LatUCst*this.selected_items[i].qty
            }
            return tot
        },


        Delete(index) {
            this.selected_items[index].active = false
            //this.selected_items.splice(index,1)
        },

        addItem() {
            this.item.qty = this.qty
            this.selected_items.push(this.item)
            this.search = ""
            this.qty = ""
            //this.
        },

        filterItems(event) {
            //console.log('event = ', event)
            if(this.search.length>2) { // && event.key != 'Backspace'
                this.show = true
                this.filtered_items = this.stock_items.filter(i => 
                
                    {
                    
                        let code_des = i.Code_Des.toString().toLowerCase().trim()

                        
                        const searchTerm = this.search.toLowerCase().trim();

                        return code_des.includes(searchTerm)
                    })
            }
            else {
                //return this.stock_items
                //return []
                this.filtered_items = []
                this.show = false
            }
        },


        async saveFeedback() {
            let changes = []
            
            this.products.forEach(p => {
                let orig_p = this.orig_products.find(op => op.fitting == p.fitting)
                let push = false
                let obj = {}
                if(orig_p) {
                    for(let key in p) {
                        if(p[key] != orig_p[key]) {
                            push = true
                            obj[key] = p[key]
                        }
                    }
                    if(push) {
                        obj.id = orig_p.id
                        obj.action = 'modify'
                        changes.push(obj)
                    }
                }
                else {
                    p.action = 'add'
                    p.pastel_id = this.my_maint.id
                    changes.push(p)
                }

                /*if(p.feedback != undefined) {
                    let orig_p = this.orig_products.find(op => op.fitting == p.name)
                    p.pastel_id = this.my_maint.id
                    if(orig_p) {
                        if(orig_p.feedback != p.feedback || orig_p.category != p.category) {
                            //modify
                            p.action = 'modify'
                            p.id = orig_p.id
                        }
                    }
                    else {
                        p.action = 'add'
                    }
                }*/
               
            });
            await this.$axios.$post('/feedback', {products: JSON.stringify(changes)})

            this.selected_items.forEach(s => {
                if(s.id != undefined) {
                    let orig_comp = this.orig_comps.find(c => c.id == s.id)
                    if(orig_comp) {
                        s.action = 'modify'
                        s.maint_id = this.maint_id
                    }
                    else {
                        s.action = 'add'
                    }
                
                }
                else {
                    s.action = 'add'
                }
            })



            if(this.selected_items.length>0) {
                await this.$axios.$post('/save_maint_comps', {comps: JSON.stringify(this.selected_items), maint_id: this.my_maint.id})
            }
            this.orig_products = await this.$axios.$post('/get_feedback', {id: this.my_maint.id})
        }
        
    },

    created: async function() {
        
    },

    mounted: async function() {
       
      this.maint  = JSON.parse(window.sessionStorage.maint)
      this.my_maint = JSON.parse(window.sessionStorage.my_maint)
      //this.stock_items = JSON.parse(window.sessionStorage.stock_items)
      let fitting = this.maint.Fitting.split(',')
      let note = this.maint.LineNote.split(',')
      let qty = this.maint.Qty.split(',')
      this.orig_products = await this.$axios.$post('/get_feedback', {id: this.my_maint.id})
      this.selected_items = await this.$axios.$post('/maint_comps', {id: this.my_maint.id})
      this.orig_comps = JSON.parse(JSON.stringify(this.selected_items))
      this.products = []
      for(let i = 0; i<fitting.length; i++) {
        this.products[i] = {}
        this.products[i].fitting = fitting[i]
        this.products[i].note = note[i]
        this.products[i].qty = qty[i]
        let prod = this.orig_products.find(p => p.fitting == this.products[i].fitting)
        if(prod) {
            this.products[i].feedback = prod.feedback
            this.products[i].category = prod.category
            this.value = []
            let cat_arr = prod.category.split(",")
             for(let j = 0; j<cat_arr.length; j++) {

                    this.value.push({name: cat_arr[j]})
                }
        }
      }

      this.comps = await this.$axios.$post('/job_card', {so: this.maint.OrderNum})
    
      //this.stock_items = this.$attrs.stock_items
      //this.stock_items2 = this.stock_items.map(s => s.Code_Des)
      



        
   }
}
</script>

<style scoped>

td {
    padding:0.5%;
}

.del {
    color: rgb(66, 63, 63);
    font-size: 20px; 
    font-weight: bold;
}
.del:hover,
.del:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}

.dropdown-item {
  margin-left: 0%;
  padding: 0% 2% 1% 1%;
  font-size: 14px;
  color: rgb(0, 0, 0)
}

.dropdown-item :hover {
  /*background-color: rgb(255, 255, 255);*/
}

a:hover {
    background-color: #bbbbbb;
}

.dropdown-menu {
    width: 100%;
    background-color: #ffffff;
}


label {
    font-weight: bold;
    /*font-size:small*/
}

</style>