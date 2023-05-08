<template>
<div>

    <table class="table" style="font-size:14px; width:70%">
        <tr>
            <td style="vertical-align: middle;"><label>Expected OrderDate From</label></td>
            <td style="vertical-align: middle;"><input type="date" v-model="selected.from"></td>
            <td></td>
            <td style="vertical-align: middle;"><label>Expected OrderDate To</label></td>
            <td style="vertical-align: middle;"><input type="date" v-model="selected.to"></td>
        </tr>
        <tr>
            <td style="vertical-align: middle;"><label>Fitting Range</label></td>
            <td style="vertical-align: middle;"><select  v-model="selected.range" @change="filterFittings()">
                    <option value="" selected disabled>Select</option>
                    <option :value="r.nRangeID" v-for="r in range" :key="r.nRangeID">{{r.RangeDescription}}</option>
                </select>  
            </td>
            <td></td>
            <td style="vertical-align: middle;"><label>Fitting</label></td>
            <td style="vertical-align: middle;"><model-list-select 
                    :list="filtered_fittings"
                    v-model="selected.fitting"
                    option-value="FittingCode"
                    option-text="FittingName"
                    placeholder="Search fittings"
                    style="width:100%"
                    > 
                </model-list-select>
            </td>
        </tr>
        
    </table>


    <!--div class="row">
        <div class="col-lg-6 float-left">
            <div class="form-group">
                <label class="col-md-6" style="font-size:15px">Expected OrderDate From</label>
                <input type="date" v-model="selected.from">
            </div>
    
            <div class="form-group">
                <label class="col-md-6" style="font-size:15px">Fitting Range</label>
                <select  v-model="selected.range" @change="filterFittings()">
                    <option value="" selected disabled>Select</option>
                    <option :value="r.nRangeID" v-for="r in range" :key="r.nRangeID">{{r.RangeDescription}}</option>
                </select>  
            </div>
           
        </div>
        <div class="col-lg-6">
            <div class="form-group">
                <label  class="col-md-6" style="font-size:15px">Expected OrderDate To</label>
                <input type="date" v-model="selected.to">
            </div>

             <div class="form-group">
                <label class="col-md-6" style="font-size:15px">Fitting</label>
                 <model-list-select 
                    :list="filtered_fittings"
                    v-model="selected.fitting"
                    option-value="FittingCode"
                    option-text="FittingName"
                    placeholder="Search fittings"
                    style="width:220px; margin-left:50%; margin-top:-5%"
                    > 
                </model-list-select>
                <!--select  v-model="selected.fittingID">
                    <option value="" selected disabled>Select</option>
                    <option :value="fitting.nFittingID" v-for="fitting in filtered_fittings" :key="fitting.nFittingID">{{fitting.FittingName}}</option>
                </select--c>  
            </div>
            
        </div>
 
    </div-->

    
    <b-button style="margin-left: 30%" @click="fittingCount2()">Load</b-button>
    


    <div class="row">
        <div class="col-lg-3 float-left"></div>
        <center v-if="row_index != null" class="col-lg-9 float-right">
            <div  class="form-group">
                <label>{{fitting}} [<a style="color:red">Qty: {{qtyCheck().total}}</a> || <a style="color:blue">Prob. Qty: {{qtyCheck().prob_qty}}</a> || <a style="color: orange">Value: R{{Value()}}</a>]</label>
            </div>
           
        </center>
    </div>
    <!--div class="row"><div class="col-lg-3 float-left"></div></div-->

    <div class="row">
        <div class="col-sm-2 float-left">
            
            <table class="table table-bordered" style="width:100%;font-size:13px">
                <thead>
                    <th>Fitting</th>
                    <th>Qty</th>
                </thead>
                <tbody>
                    <tr v-for="(fitting,index) in quoted_fittings" :key="fitting.FittingCode"
                    :class="{'background' : row_index == index}">
                        <td>
                            <a href="#" @click.prevent="loadQuotes(fitting,index)">{{fitting.FittingName}}</a>
                        </td>
                        <td>{{fitting.Quantity}}</td>
                    </tr>
                </tbody>
                
            </table>
        </div>
        <div class="col-sm-10 float-right">
            <div v-if="quotes.length>0">
             <b-row class="justify-content-center text-center">

                <strong style="font-size:15px; margin-top:0.3%">Use to Estimate :</strong>
                <b-form-select style="width:12%; margin-left:0.5%" v-model="estimate" @change="filterQuotes()">
                    <b-form-select-option :value = null>All</b-form-select-option>
                    <b-form-select-option :value = true>YES</b-form-select-option>
                    <b-form-select-option :value = false>NO</b-form-select-option>
                </b-form-select>

                <strong style="margin-left: 2%; font-size:15px; margin-top:0.3%">Rep :</strong>
                <b-form-select style="width:12%; margin-left:0.5%" v-model="rep" @change="filterQuotes()">
                    <b-form-select-option v-for="rep in sales_reps" :key="rep.EmployeeID" :value="rep.EmployeeID" >{{rep.Name}}</b-form-select-option>
                </b-form-select>

                <strong style="margin-left: 2%; font-size:15px; margin-top:0.3%">Quote Status :</strong>
                    <b-form-select style="width:14%; margin-left:0.5%" v-model="q_status" @change="filterQuotes()">
                        <b-form-select-option v-for="status in quote_status" :key="status.QuoteStatusID" :value="status.Description" selected>{{status.Description}}</b-form-select-option>
                    </b-form-select>
                    
                <b-button style="margin-left: 1%" @click="exportExcel()">Export Excel</b-button>
                    
            </b-row>

            
            <v-client-table :data="filterQuotes()" :columns="columns" :options="options" name="quotes" style="width:100%; font-size:12px; margin-top:1%">
                <span slot="Code" slot-scope="{row}">{{displayCode(row)}}</span>
                <span slot="QuotationDate" slot-scope="{row}">
                    <span v-if="row.QuotationDate">{{row.QuotationDate.split("T")[0]}}</span>
                    <span v-else>{{}}</span>
                </span>
                <span slot="UnitCost" slot-scope="{row}">R{{row.UnitCost}}</span>
                    <span slot="TotalCost" slot-scope="{row}">R{{row.TotalCost}}</span>
                <span slot="Exp. Order Date" slot-scope="{row}">
                    <span v-if="row.ExpectedOrderDate">{{row.ExpectedOrderDate.split("T")[0]}}</span>
                    <span v-else>{{}}</span>
                </span>
                <span slot="Prob Qty" slot-scope="{row}">
                    {{Math.round(row.Quantity*(row.PercentageConfidence/100))}}
                </span>

            </v-client-table>
            

        </div>
        </div>

    </div>
     

</div>
</template>

<script>
import { ServerTable, ClientTable } from 'vue-tables-2';
import XLSX from "xlsx-js-style";
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'

export default {
    middleware: ['auth'],
    components: { ClientTable, ModelListSelect },
    props: ['range', 'project_status',  'sales_reps'],

    data() {
        return {
            /*range: [],*/
            fittings: [],
            quote_status: [{QuoteStatusID: 0, Description: 'All'},{QuoteStatusID: 9, Description: 'Forwarded to Client'}, {QuoteStatusID: 6, Description: 'Approved'}],
            filtered_fittings: [],
            selected: {
                range: 0,
                fitting: 'All',
                fittingID: 0,
                from: '',
                to: '',
                qty: '20'
            },
            fitting: "",
            quotes: [],
            quoted_fittings: [],
            row_index: null,
            columns: ['Rep', 'QuotationID', 'QuotationDate', 'QuoteStatus', 'ProjectName', 'ClientName', 'Code', 'Quantity', 'PercentageConfidence', 'Prob Qty', 'UnitCost', 'Discount', 'TotalCost', 'Exp. Order Date'],
            options: {
                headings: { QuotationID: 'Quote No', QuoteStatus: 'Q. Status', Quantity: 'Qty',  ProjectName: 'Project', ProjectStatus: 'P. Status', ClientName: 'Client', QuotationDate: 'Quoted On', Discount: 'Disc', UnitCost: 'Unit Cost', TotalCost: 'Total Cost', PercentageConfidence: 'Prob. %' },
                columnsDropdown: true,
                saveState: false,
                dateFormat: 'DD/MM/YYYY',
                perPageValues: [10, 50, 100, 200, 500],
                texts: {
                  filterPlaceholder: 'Search Quotes'
                },

            }, //END OF OPT
            /*project_status: [],
            quote_status: [],*/
            rep: 0,
            q_status: 'All',
            estimate: null,
            //sales_reps: []
            //count: []
        }
    },

    methods: {


        filterQuotes() {
            let new_quotes = this.quotes
            if(this.rep == 0 && this.q_status == 'All' && this.estimate == null) {
                return new_quotes//.filter(q => q.EmployeeID == this.rep)
            }
            else {
                if(this.rep != 0) {
                    new_quotes = new_quotes.filter(q => q.EmployeeID == this.rep)
                }
                if(this.q_status != 'All') {
                     new_quotes = new_quotes.filter(q => q.QuoteStatus == this.q_status)
                }
                if(this.estimate != null) {
                    console.log(`quote[0].UseToEstimate = ${this.quotes[0].UsetoEstimate}, this.estimate = ${this.estimate}`)
                     new_quotes = new_quotes.filter(q => q.UseToEstimate === this.estimate )
                }

                /*if(this.rep != 0 && this.q_status == 'All' && this.estimate == null) {
                    new_quotes = new_quotes.filter(q => q.EmployeeID == this.rep)
                    //filter(q => q.QuoteStatus == this.q_status)
                }
                if(this.rep == 0 && this.q_status != 'All' && this.estimate == null) {
                     new_quotes = new_quotes.filter(q => q.QuoteStatus == this.q_status)
                }

                if(this.rep == 0 && this.q_status == 'All' && this.estimate != null) {
                     new_quotes = new_quotes.filter(q => q.UsetoEstimate == this.estimate ) //UsetoEstimate
                }*/

                return new_quotes
            }
        },


        exportExcel() {
            let export_list = []
            for(let i = 0; i<this.filterQuotes().length; i++) {
                export_list[i] = {}
                export_list[i]['Rep'] = this.filterQuotes()[i].Rep
                export_list[i]['Quote No'] = this.filterQuotes()[i].QuotationID
                export_list[i]['Use to Estimate'] = this.filterQuotes()[i].UsetoEstimate
                export_list[i]['Date Quoted'] = this.filterQuotes()[i].QuotationDate.split("T")[0]
                export_list[i]['QuoteStatus'] = this.filterQuotes()[i].QuoteStatus
                export_list[i]['Project'] = this.filterQuotes()[i].ProjectName
                export_list[i]['ProjectStatus'] = this.filterQuotes()[i].ProjectStatus
                export_list[i]['Client'] = this.filterQuotes()[i].ClientName
                /*export_list[i]['QuotationOptionID'] = this.filterQuotes()[i].QuotationOptionID*/
                export_list[i]['Code'] = this.displayCode(this.filterQuotes()[i])
                export_list[i]['Description'] = this.filterQuotes()[i].Description
                export_list[i]['Qty'] = this.filterQuotes()[i].Quantity
                export_list[i]['Prob. %'] = this.filterQuotes()[i].PercentageConfidence
                export_list[i]['Prob. Qty'] = Math.round(this.filterQuotes()[i].Quantity*(this.filterQuotes()[i].PercentageConfidence/100))
                export_list[i]['Unit Cost'] = this.filterQuotes()[i].UnitCost
                export_list[i]['Discount'] = this.filterQuotes()[i].Discount
                export_list[i]['Total Cost'] = this.filterQuotes()[i].TotalCost
                export_list[i]['Expected Order Date'] = this.filterQuotes()[i].ExpectedOrderDate.split("T")[0]
            }
            var sheet = XLSX.utils.json_to_sheet(export_list);
            for(let i in sheet) {
                if(i != '!ref') {
                    //console.log(i)
                    sheet[i].s = {
                        font: {
                            name: 'Arial',
                            sz: 8
                        }
                    }
                }
            }
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, sheet, `${this.fitting}`);
            XLSX.writeFile(
                wb,
                `${this.fitting} ${this.selected.from} - ${this.selected.to} Forecast.xlsx`
            ); // name of the file is 'book.xlsx'
        },

        filterFittings() {
            this.filtered_fittings = []
            if(this.selected.range != 0) {
                this.filtered_fittings = this.fittings.filter(f => f.nRangeID == this.selected.range)
            }
            else {
                console.log('this.fittings.length = ', this.fittings.length)
                Object.assign(this.filtered_fittings, this.fittings)
            }
            this.filtered_fittings.unshift({FittingName: "All", nFittingID: 0, nRangeID: 0, FittingCode: "All"})
        },

        async loadQuotes(fitting,index) {
            this.quotes = []
            this.row_index = index
            this.fitting = fitting.FittingName
            this.selected.fitting = fitting.FittingCode //FittingCode
            console.log(this.selected)
            let quotes = await this.$axios.$post('/quotes', this.selected)
            //if(quotes.hasOwnProperty('recordset')) {
                this.quotes = quotes//.recordset
            //}
            /*for(let i = 0; i<quotes.length; i++) {
                let project_quotes = quotes.filter(q => q.ProjectID == quotes[i].ProjectID)
                let max = Math.max.apply(Math, project_quotes.map(function(o) { return o.QuotationID; }))
                console.log(max)
                this.quotes.push(project_quotes.find(pq => pq.QuotationID == max))
            }*/

            this.qtyCheck()

           
        },

        /*Count(FittingCode) {
            return this.count.find(c => c.FittingCode == FittingCode).Count
        },*/

        
        async fittingCount2() {

            let fittings = await this.$axios.$post('/fitting_count', this.selected)
            //if(fittings.hasOwnProperty('recordset')) {
                this.quoted_fittings = fittings//.recordset
            //}
            this.quotes = []
            this.row_index = null

        },

        qtyCheck() {
            let total = 0
            let prob_qty = 0
            for(let i = 0; i<this.filterQuotes().length; i++) {
                total = total + this.filterQuotes()[i].Quantity
                prob_qty = prob_qty + (this.filterQuotes()[i].Quantity*this.filterQuotes()[i].PercentageConfidence)/100
            }
            return {total: Math.round(total), prob_qty: Math.round(prob_qty)}
        },

        Value() {
            let total = 0
            for(let i = 0; i<this.filterQuotes().length; i++) {
                total = total + this.filterQuotes()[i].TotalCost
            }
            return Math.ceil(total)
        },

        


        displayCode(quote) {
          
            let des = quote.Description.split("\n")
            let index = des.findIndex(el => el.includes("Code:"))
            
            if(index != -1) {
                return des[index].split(" ")[1]
            }
            else {
                return " "
            }
            
        },

    },

   

    async mounted() {
        
        //this.fittings = await this.$axios.$get('/sfa_fittings')
        console.log('mounted fittings = ', this.fittings.length)
        

    },

    async created() {
        this.fittings = await this.$axios.$get('/sfa_fittings')
        console.log('created fittings = ', this.fittings.length)
        this.filterFittings()
    }
    
}
</script>

<style scoped>

.background {
    background-color: aqua;
}

/* mouse over link */
a:hover {
  color: red;
}

/* selected link */
a:active {
  color: yellow;
}

input, select {
    width: 220px
}

label {
    font-weight: bold;
}

/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 5; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 2% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  word-wrap: break-word;
}



.close {
  color: rgb(66, 63, 63);
  float: right;
  font-size: 45px;
  font-weight: bold;
}



.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

</style>