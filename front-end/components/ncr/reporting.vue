<template>
<div>
    <!--h4>Reporting</h4-->
    <div class="row">
        <div class="col-lg-7 float-left">
            <div class="form-group">
                <label class="col-lg-3">Maintenance/Internal</label>
                <select v-model="filter.type">
                    <option value="All">All</option>
                    <option value="Site">Maintenance</option>
                    <option value="Internal">Internal</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-lg-3">Issue Category</label>
                <select v-model="filter.issue">
                    <option value="" disabled selected>Please select</option>
                    <option v-for="opt in options" :key="opt" :value="opt">{{opt}}</option>
                </select>
                <select v-model="filter.qty">
                    <!--label class="col-lg-2">Where qty</label-->
                    <option value="0">>=0</option>
                    <option value="5">>=5</option>
                    <option value="10">>=10</option>
                    <option value="15">>=15</option>
                    <option value="20">>=20</option>
                    <option value="30">>=30</option>
                    <option value="40">>=40</option>
                    <option value="50">>=50</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-lg-3">From</label>
                <input type="date" v-model="filter.from">
                <label style="margin-left:3%;">To</label>
                <input type="date" style="margin-left:3%" v-model="filter.to">
                <b-button style="margin-left: 3%" @click="clear()">Clear</b-button>
            </div>
            <div class="form-group">
                <label class="col-lg-3"></label>
                <b-button @click="loadData">Load Data</b-button>
            </div>

            <no-ssr>
            
            <GChart
                v-if="display"
                type="BarChart"
                :data="chartData2"
                :options="chartOptions2"
                @ready="onChartReady2"
                ref="gChart2"
                style="width:80%; height:80%; margin-top: 0%; padding:0%"
            />

            <div id="chart_div" style="border: 1px solid #ccc"></div>   
            
            </no-ssr>

        </div>
        <div class="col-lg-5 float-right">
            <h6 style="margin-left:8%">Common Faults</h6>
            <GChart
                type="PieChart"
                :data="faults"
                style="margin-left: -26%"
                title="Common Defects"
            />
            <no-ssr>
            <!--h6 style="margin-left:8%">Supplier Issue Count</h6-->
            <GChart
                type="ColumnChart"
                :data="chartData"
                :options="chartOptions"
                @ready="onChartReady"
                ref="gChart"
                style="margin-left: -15%"
            />
            </no-ssr>

        </div>
    </div>

    <div v-if="filter.selected.length>0" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content" style="width:95%">
            <product-report  @closeReport="closeReport" :filter="filter"></product-report>
        </div>
    </div>



</div>
</template>

<script>
import { GChart } from 'vue-google-charts'
import productReport from '../../components/ncr/product_report'
export default {

     middleware: ['auth'],
     components: { GChart, productReport },

    data() {
        return {
            options: ['All', 'Faulty Driver','Faulty PCB','Water/Moister Ingress','Incorrect Wiring','Overheating','Dimming issue','Incorrect Spec','Poor Quality','Loose Connection'],
            faults: [],
            supplier_faults: [],
            chartData: null,
            chartData2: null,
            chartOptions: {
                title: 'Supplier Issue Count',
                curveType: 'function',
                lineWidth: 2,
                intervals: { 'style': 'line' },
                legend: 'none',
                width: 750,
                height: 450,
                padding: 0
            },
            chartOptions2: {
                title: 'Common Defects',
                curveType: 'function',
                lineWidth: 4,
                intervals: { 'style': 'line' },
                legend: 'none',
                width: 500,
                height: 250
            },
            product_issues: [],
            google: {},
            chart: {},
            display: false,
            filter: {
                type: 'All',
                issue: 'All',
                to: '',
                from: '',
                qty: '0',
                selected: ''
            }
            
        }
    },

    methods: {

        closeReport() {
            this.filter.selected = ''
        },

        async clear() {
           
            this.filter = {
                type: 'All',
                issue: 'All',
                to: '',
                from: '',
                qty: '0',
                selected: ''
            }
            await this.loadData()

        },

      
        onChartReady (chart, google) {
            // now we have google lib loaded. Let's create data table based using it.
            
            this.createDataTable(chart,google);

            },
        async createDataTable(chart,google) {
            //console.log('supplier_faults = ', this.supplier_faults.length)
            if(this.supplier_faults.length == 0) {
                await this.loadSupplierFaults()
            }
            var data = google.visualization.arrayToDataTable(this.supplier_faults);

            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                { calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation" }
        ])

        //this.chartData = data;
        chart.draw(view, this.chartOptions);
        
        },

        onChartReady2 (chart, google) {
            // now we have google lib loaded. Let's create data table based using it.
            console.log('google = ', google)
            console.log('chart = ', chart)
            this.google = google
            this.chart = chart
            this.createDataTable2(chart,google);

        },

        async createDataTable2(chart, google) {
            //console.log('supplier_faults = ', this.supplier_faults.length)
            //console.log('google2 = ', google)
            /*if(this.product_issues.length == 0) {
                await this.loadData()
            }*/
            /*console.log('google.visualization = ', google.visualization)
            console.log('google.visualization.arrayToDataTable = ', google.visualization.arrayToDataTable(this.product_issues))*/
            var data = new google.visualization.arrayToDataTable(this.product_issues);

           
            var view = new google.visualization.DataView(data);
            view.setColumns([0, 1,
                { calc: "stringify",
                    sourceColumn: 1,
                    type: "string",
                    role: "annotation" }
            ])

            let selected = ''
            let _this = this
            chart.draw(view, this.Options);
            google.visualization.events.addListener(chart, 'select', selectHandler);
            function selectHandler() {
                var selectedItem = chart.getSelection()[0];
                //console.log(selectedItem)
                    if (selectedItem) {
                    var selectedValue = data.getValue(selectedItem.row, 0);
                    //console.log('The user selected ' + selectedValue);
                    selected = selectedValue
                    console.log('selected = ', selected)
                    _this.filter.selected = selected
                    //assignSelection(selectedValue)
                    }
            }

                      
        
        },

        



        async loadData(chart, google) {
            let product_issues = []
            this.product_issues = []


            product_issues = await this.$axios.$post('/fault_cat', this.filter) //{type: this.type, issue: this.issue, to: this.to, from: this.from, qty: this.qty}
            for(let i = 0; i<product_issues.length; i++) {
                this.product_issues[i] = Object.values(product_issues[i])
            }

            if(this.product_issues.length>0) {
                this.product_issues.unshift(['Product', 'Qty'])
                this.display = true
                //this.onChartReady2()
                this.createDataTable2(this.chart, this.google);
            }
            else {
                this.display = false
            }
            
        },

        async loadSupplierFaults() {
            let supplier_faults = await this.$axios.$get('/supplier_faults')
            for(let i = 0; i<supplier_faults.length; i++) {
                this.supplier_faults[i] = Object.values(supplier_faults[i])
            }
        
            this.supplier_faults.unshift(['Supplier', 'Count'])
        }
    },

  

    created: async function() {
        await this.loadSupplierFaults()
        let faults = await this.$axios.$get('/fault_count')
        this.faults = Object.entries(faults[0])
        this.faults.unshift(['Fault', 'Count'])
        

    }
    
}
</script>

<style scoped>

rect {
    width: 500
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