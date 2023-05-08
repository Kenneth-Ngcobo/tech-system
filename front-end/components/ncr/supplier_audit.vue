<template>
<div>

    <div class="row">
        <div class="col-md-7">
            <table class="table table-bordered" style="width:100%">
                <tr>
                    <td style="width:30%">Select Supplier</td>
                    <!--td></td-->
                    <td style="width:70%" colspan="3"><model-list-select
                       
                        :list="suppliers"
                        v-model="selected.id"
                        option-value="DCLink"
                        option-text="Name"
                        placeholder="Search suppliers"
                        style="width:100%;"> <!-- style="width:38%; margin-left:25.5%; margin-top:-5%"-->
                        </model-list-select>
                    </td>

                
                </tr>
                <tr>
                    <td>Date From</td>
                    <td><input type="date" v-model="selected.from"></td>
                    <td>Date To</td>
                    <td><input type="date" v-model="selected.to"></td>
                    
                </tr>
                <tr>
                    <td colspan="4" style="text-align:center"><b-button @click="getPOs()">Load</b-button></td>
                </tr>
            </table>

            <table class="table table-bordered" style="width:100%; font-size:12px">
                <thead>
                    <th>#</th>
                    <th>Order Num</th>
                    <th>Order Date</th>
                    <th>Due Date</th>
                    <th>Delivery Date</th>
                    <th>Inv Date</th>
                    <th>Variance</th>
                </thead>
                <tbody>
                    <tr v-for="(p,index) in pos" :key="p.AutoIndex">
                        <td>{{index+1}}</td>
                        <td>{{p.OrderNum}}</td>
                        <td>{{p.OrderDate.split('T')[0]}}</td>
                        <td>{{p.DueDate.split('T')[0]}}</td>
                        <td>{{p.DeliveryDate.split('T')[0]}}</td>
                        <td>{{p.InvDate.split('T')[0]}}</td>
                        <td>{{Variance(p)}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="col-md-5">
            <table class="table table-bordered" style="width:70%; font-size:12px">
                <tr>
                    <td colspan="2" class="bold" style="text-align:center">{{supplier_name}}</td>
                </tr>
                <tr>
                    <td class="bold">Time Measured</td>
                    <td class="bold">{{selected.from}} to {{selected.to}}</td>
                </tr>
                <tr>
                    <td class="bold">Total Orders</td>
                    <td>{{pos.length}}</td>
                </tr>
                <tr>
                    <td class="bold">Orders Recieved Prior to Delivery Date</td>
                    <td>{{early}}</td>
                </tr>
                <tr>
                    <td class="bold">Orders Recieved On Delivery Date</td>
                    <td>{{on_time}}</td>
                </tr>
                <tr>
                    <td class="bold">Orders Recieved Late</td>
                    <td>{{late}}</td>
                </tr>
                <tr>
                    <td class="bold">Performance</td>
                    <td
                    :class="{A: Performance()>= 80, B: Performance() >= 60 && Performance() <= 79, C: Performance() >= 40 && Performance() <= 59, D: Performance() >= 0 && Performance() <= 39}"
                    >{{Performance()}}%</td>
                </tr>
            </table>
            <img src="@/assets/supplier_criteria.JPG" alt="Flowers in Chania">
        </div>

    </div>



    

</div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
export default {
    components: {ModelListSelect},
    
    data() {
        return {
            suppliers: [],
            selected: {
                id: '',
                from: '',
                to: ''
            },
            supplier_name: '',
            pos: [],
            early: 0,
            on_time: 0,
            late: 0,
            count: 0
            
        }
    },


    methods: {
        

        Performance() {
            return Math.round(((this.early+this.on_time)/this.pos.length)*100,0)
        },

        async getPOs() {
            this.early = 0
            this.on_time = 0
            this.late = 0
            this.count = 0
            this.pos = []
            this.pos = await this.$axios.$post('/supplier_aud', this.selected)
            this.supplier_name = this.suppliers.find(s => s.DCLink == this.selected.id).Name
            this.Counts()

        },

        Counts() {

            this.pos.forEach(p => {
                this.count = this.count+1
                let variance = this.Variance(p)
                if(variance<0) {
                    this.early = this.early+1
                }
                if(variance == 0) {
                    this.on_time = this.on_time+1
                    //console.log(`count = ${this.count}: on_time = ${this.on_time}`)
                }
                if(variance>0) {
                    this.late = this.late+1
                }
            })
           
        },

        Variance(p) {
           
           let variance = new Date(p.InvDate.split('T')).getTime() - new Date(p.DueDate.split('T')).getTime()
                      
           return variance / (1000*60*60*24)
        }
    },

    created: async function() {
        this.suppliers = await this.$axios.$get('/vendors')
    }
    
}
</script>

<style scoped>

thead {
    position: sticky;
    top: 5px;
    background-color:rgb(13, 14, 14); 
    color:white;
}

.bold {
    font-weight: bold;
}

.A {
    color: white;
    background-color: green;
}

.B {
    color: white;
    background-color: blue;
}

.C {
    color: black;
    background-color: yellow;
}

.D {
    color: white;
    background-color: red;
}


</style>