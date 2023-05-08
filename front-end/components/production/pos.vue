<template>
<div>

    <table class="table" style="width:50%">
        <tbody>
            <tr>
                <td><label>Supplier</label></td>
                <td> <model-list-select 
                        :list="vendors"
                        v-model="selected.vendor"
                        option-value="DCLink"
                        option-text="Name"
                        placeholder="Search suppliers"
                        style="width:420px; "> 
                    </model-list-select> 
                </td>
                <td><label>From</label></td>
                <td><input type="date" v-model="selected.from" :max="today()"></td>
                <td><label>To</label></td>
                <td><input type="date" v-model="selected.to" :max="today()"></td>
                <td><b-button @click="loadPOs()">Load</b-button></td>
            </tr>
        </tbody>
    </table>

    <!--table class="table table-bordered" style="font-size:13px">
        <thead>
            <th>PO No</th>
            <th>Order Date</th>
            <th>Due</th>
            <th>Ext Order No</th>
            <th>Item Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th>Delivery Note</th>
            <th>Invoice No</th>
            <th>GRV No</th>
        </thead>
        <tbody>
            <tr v-for="po in pos" :key="po.idInvoiceLines">
                <td>{{po.OrderNum}}</td>
                <td>{{po.OrderDate.split("T")[0]}}</td>
                <td>{{po.DueDate.split("T")[0]}}</td>
                <td>{{po.ExtOrderNum}}</td>
                <td>{{po.Code}}</td>
                <td>{{po.cDescription}}</td>
                <td>{{po.fQuantity}}</td>
                <td>R{{po.Price}}</td>
                <td>{{po.DeliveryNote}}</td>
                <td>{{po.InvNumber}}</td>
                <td>{{po.GrvNumber}}</td>
            </tr>
        </tbody>
    </table-->

    <v-client-table :data="pos" :columns="columns" :options="options" name="pos" style="width:100%; font-size:13px">
        <span slot="Price" slot-scope="{row}">
            R{{row.Price}}
        </span>

        <span slot="OrderDate" slot-scope="{row}">
            {{row.OrderDate.split("T")[0]}}
        </span>

         <span slot="DueDate" slot-scope="{row}">
            {{row.DueDate.split("T")[0]}}
        </span>
    </v-client-table>
   

</div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import { ServerTable, ClientTable } from 'vue-tables-2';

export default {
    components: { ModelListSelect, ClientTable },
    props: ['vendors'],
    data() {
        return {
            //vendors: [],
            selected: {
                    vendor: '',
                    from: '',
                    to: ''
                    },
            pos: [],
            columns: ['#','OrderNum', 'OrderDate', 'DueDate', 'ExtOrderNum', 'Code', 'cDescription', 'Quantity', 'Price', 'DeliveryNote','InvNumber','GrvNumber'], //'findings','corrective_action', 'preventative_action'
            options: {
                headings: { Quantity: 'Qty', Price: 'Unit Cost'},
                columnsDropdown: true,
                saveState: true,
                storage: 'session',
                dateFormat: 'DD/MM/YYYY',
                perPageValues: [4,10,50,100],
                texts: {
                  filterPlaceholder: 'Search POs'
                },

            }, //END OF OPTIONS
        }
    },

    methods: {

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },

        async loadPOs() {
            this.pos = await this.$axios.$post('/pos', this.selected)
        }

    },

    created: async function() {
        //this.vendors = await this.$axios.$get('/vendors')
        this.selected.to = this.today()
    }
    
}
</script>

<style scoped>

</style>
