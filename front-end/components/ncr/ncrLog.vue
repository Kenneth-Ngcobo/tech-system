<template>
<div>
    

    
 
    <b-row  style="">
    <div class="col-md-1">
        <b-button @click="log = true" style="margin-bottom:1%; font-size:14px">Log Issue</b-button>
    </div>

    <div class="col-md-10 center">
        <strong style="font-size:13px; margin-top:0.3%">RGN :</strong>
        <b-form-select style="width:7%; margin-left:0.5%" v-model="filter2.region" @change="filterNCRS2()"> 
            <b-form-select-option value="All" selected>All</b-form-select-option>
            <b-form-select-option value="JHB" selected>JHB</b-form-select-option>
            <b-form-select-option value="CPT">CPT</b-form-select-option>
            <b-form-select-option value="DBN">DBN</b-form-select-option>
        </b-form-select>

        <strong style="margin-left: 2%; font-size:13px; margin-top:0.3%">NCR Type :</strong>
        <b-form-select style="width:8%; margin-left:0.5%" v-model="filter2.type"  @change="filterNCRS2()"> 
            <b-form-select-option value="All" selected>All</b-form-select-option>
            <b-form-select-option value="Site">Maintenance</b-form-select-option>
            <b-form-select-option value="Internal">Internal</b-form-select-option>
            <b-form-select-option value="Aluminium">Aluminium</b-form-select-option>
        </b-form-select>
    
        <strong style="margin-left: 2%; font-size:13px; margin-top:0.3%">Liable :</strong>
        <b-form-select style="width:7%; margin-left:0.5%" v-model="filter2.liable_entity"  @change="filterNCRS2()"> 
            <b-form-select-option value="All">All</b-form-select-option>
            <b-form-select-option value="Regent">Regent</b-form-select-option>
            <b-form-select-option value="Site">Site</b-form-select-option>
            <b-form-select-option value="Supplier">Supplier</b-form-select-option>
        </b-form-select>
        <strong style="margin-left: 2%;font-size:13px; margin-top:0.3%">Maint. Status :</strong>
        <b-form-select style="width:7%; margin-left:0.5%" v-model="filter2.maint_status"  @change="filterNCRS2()"> 
            <b-form-select-option value="All" selected>All</b-form-select-option>
            <b-form-select-option value="active">Active</b-form-select-option>
            <b-form-select-option value="complete">Complete</b-form-select-option>
        </b-form-select>

        <strong style="margin-left: 2%;font-size:13px; margin-top:0.3%">Reg. Status :</strong>
        <b-form-select style="width:7%; margin-left:0.5%" v-model="filter2.reg_status"  @change="filterNCRS2()"> 
            <b-form-select-option value="All" selected>All</b-form-select-option>
            <b-form-select-option value="open">Open</b-form-select-option>
            <b-form-select-option value="assessed">Assessed</b-form-select-option>
            <b-form-select-option value="closed">Closed</b-form-select-option>
        </b-form-select>

        <strong style="margin-left: 2%;font-size:13px; margin-top:0.3%">Inv/Crd :</strong>
        <b-form-select style="width:7%; margin-left:0.5%" v-model="filter2.charge"  @change="filterNCRS2()"> 
            <b-form-select-option value="All" selected>All</b-form-select-option>
            <b-form-select-option value="Yes">Yes</b-form-select-option>
            <b-form-select-option value="No">No</b-form-select-option>
        </b-form-select>
    </div>
    <div class="col-md-1">
        <nuxt-link to="/ncr/reporting">
            <b-button style="font-size:14px">Reporting</b-button>
        </nuxt-link>
    </div>
    </b-row>


    <center style="margin-top:1%">
        <table>
            <tr>
                <td><strong style="font-size:13px">From: </strong></td>
                <td> <b-form-input id="from" type="date" style="width:100%;"  v-model="filter2.from" :max="today()" @change="filterNCRS2()"></b-form-input></td>
                <td style="width:5%"></td>
                <td><strong style="font-size:13px">To: </strong></td>
                <td><b-form-input type="date"  style="width:100%; font-size:13px" v-model="filter2.to" :max="today()" @change="filterNCRS2()"></b-form-input></td>
                <td style="width:2%"></td>
                <td><b-button style="font-size:13px" @click="$emit('clearFilters')" >Clear Filters</b-button></td>
                <td style="width:2%"></td>
                <td><b-button style="font-size:13px" @click="exportExcel()">Export Excel</b-button> <strong style="font-size:13px">Selected: {{getSelected()}}</strong></td>
            </tr>
        </table>
    
    </center>
    

    <div style="margin-top:0.5%; margin-left:43%; font-size:13px">
        <strong>Value: R{{value()}}</strong> 
        <!--div>filterNCRS2: {{filterNCRS2().length}}</div>
        <div>filtered_data: {{filtered_data.length}}</div-->
    </div>






    <div v-if="log" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content" style="width:95%">
            <log-issue @closeLog="closeLog"  :fittings="fittings"></log-issue>
        </div>
    </div>

   

    <div v-if="view" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        <div>
        <span class="close" @click="view = false">&times;</span>
          <center>
          <h5 style="align-center;">{{heading}}</h5>
          </center>
          <center>
               <!--{{body}}-->
               <table class="table table-bordered">
                   <thead>
                        <th>Product</th>
                        <th>Value</th>
                   </thead>
                  <tbody>
                      <tr v-for="(item,index) in body" :key="index">
                          <td>{{item.product}}</td>
                           <td>{{item.value}}</td>
                      </tr>
                  </tbody>
                
               </table>
          </center>
           
         </div>
    </div>
    </div>

    <div v-if="view_comps" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        <div>
        <span class="close" @click="view_comps = false">&times;</span>
          <center>
          <h5 style="align-center;">{{heading}}</h5>
          </center>
          <center>
               <!--{{body}}-->
               <table class="table table-bordered">
                   <thead>
                        <th>Component</th>
                        <th>Qty</th>
                        <th>Supplier</th>
                   </thead>
                  <tbody>
                      <tr v-for="comp in body" :key="comp.id">
                          <td>{{comp.component}}</td>
                          <td>{{comp.qty}}</td>
                          <td>{{comp.supplier}}</td>
                      </tr>
                  </tbody>
                
               </table>
          </center>
           
         </div>
    </div>
    </div>
    <!--div class="row">
        <div class="col-md-6">
            <div style="margin-bottom:0%; z-index: 3; position:relative;">Filter: <input type="text" v-model="filter2.text"  @change="filterNCRS2()" placeholder="Search NCRs" style="height:30px; width:250px"></div>
        </div>
    </div-->

    <no-ssr placeholder="Loading...">
    <v-client-table :data="filterNCRS2()" :columns="columns" :options="options" name="ncrs" ref="ncrs" @filter="onFilter($event)" style="width:100%; font-size:12px; padding:0.2rem;">
        
        <template slot="h__item" aria-sort="false">
            <input type="checkbox" id='checkbox' v-model="select_all" @change="selectAll(select_all)"> <!--$emit('selectAll', $event.srcElement.checked)-->
        </template>

        <span slot="item" slot-scope="props">
             <!--{{props.index}}--> <input type="checkbox" :checked="props.row.selected" @change="selectOne($event.srcElement.checked, props.row.id)"> <!--:checked="props.row.selected" @change="selectOne($event.srcElement.checked, props.row.ncr_no)"-->
        </span>

        <span slot="Inv/Cr" slot-scope="{row}">
            <span v-if="row.invoice_no != null">{{row.invoice_no}}</span>
            <span v-if="row.credit_no != null">{{row.credit_no}}</span>
        </span>

        <span slot="ncr_no" slot-scope="{row}"  @contextmenu.prevent="$refs.menu.open($event, row)">
            <!--nuxt-link @click.native="ncrObj = row" :to="`/ncr/${row.ncr_no}`">{{row.ncr_no}}</nuxt-link-->
            <nuxt-link @click.native="ncrObj = row; storeData()" :to="{path: `/ncr/${row.ncr_no}`, params: {data: JSON.stringify(filtered_data)}}">{{row.ncr_no}}</nuxt-link>
        </span>

        <span slot="value" slot-scope="{row}">
            R{{row.value}}
        </span>

        <span slot="product_name" slot-scope="{row}">
            {{productName(row)}}
        </span>

        <span slot="images" slot-scope="{row}" style="text-align: center">
            <div v-if="row.images != null"> <!--v-if="row.images != null"-->
            <i class="fa fa-eye"  @click="showImages(row.images)"></i> <!--loadImages(row.images)-->
            </div>
            <!--div v-else></div-->
        </span>

        <span slot="failure" slot-scope="{row}" style="text-align: center">
            <div>
            <i class="fa fa-eye" @click="view = true; heading = 'Failure'; body = viewFailure(row.product_name, row.failure, row.category)"></i>
            </div>
        </span>

         <span slot="component" slot-scope="{row}" style="text-align: center">
            <div v-if="row.component != null">
            <i class="fa fa-eye"  @click="view_comps = true; heading = 'Components'; body = showComps(row.component, row.c_qty, row.supplier)"></i> <!--body = row.components showComps(ncr)-->
            </div>
        </span>

         <span slot="findings" slot-scope="{row}" style="text-align: center">
            <div v-if="row.findings != null">
            <i class="fa fa-eye" @click="view = true; heading = 'Findings'; body = viewSummary(row.product_name, row.findings)"></i>
            </div>
        </span>

        <span slot="log_date" slot-scope="{row}">
            {{row.log_date.split(" ")[0]}}
        </span>


    </v-client-table>
    </no-ssr>

    <viewer :images="images">
      <img v-for="src in images" :key="src" :src="src">
    </viewer>

    <vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <template v-if="data">
          <li><a :href="`/ncr/${data.ncr_no}`" target="_blank">Open link in new tab</a></li>
          <li v-on:click.prevent="deleteNCR(data)"><a>Delete {{data.ncr_no}}</a></li>
      </template>
        
   </vue-context>

    <nuxt-child :ncrObj="ncrObj" :test="test" :filtered_data="filtered_data"/>

   

</div>
</template>

<script>
import logIssue from '../../components/ncr/logIssue2'
import { ServerTable, ClientTable } from 'vue-tables-2';
import { component as Viewer } from 'v-viewer';
import 'viewerjs/dist/viewer.css'
import XLSX from "xlsx-js-style";
import VueContext from 'vue-context';

const defaultTableOpt = {
    skin: 'table table-hover',
    sortIcon: {
    is: 'fa-sort',
    base: 'fas',
    up: 'fa-sort-up',
    down: 'fa-sort-down',
    
   
  }
};
export default {
    middleware: ['auth'],
    props: ['tabIndex','products', 'components', 'joined_ncr', 'fittings', 'filter2', 'suppliers'],
    components: { logIssue, ClientTable, Viewer, VueContext },

    data() {
        return {
            select_all: false,
            log: false,
            //ncrs: [],
            view_ncr: false,
            ncrObj: {},
            selected: [],
            filtered_data: [],
            test: 'Kenneth',
            columns: ['item','ncr_no', 'value', 'Inv/Cr', 'maint_status', 'status', 'site', 'product_name', 'liable', 'type', 'region','images','failure','component','findings','logged_by','log_date', 'due_date','responsible'], //'findings','corrective_action', 'preventative_action'
            options: {
                sortable: ['ncr_no', 'value', 'Inv/Cr', 'maint_status', 'status', 'site', 'product_name', 'liable', 'type', 'region','images','failure','component','findings','logged_by','log_date', 'due_date','responsible'],
                headings: {site: 'Site/Dep', maint_status: 'M_Stat',  product_name: 'Products', failure:'Fault', component: 'Comps', images: 'Pics', region: 'Reg', logged_by: 'By', findings:'Finds', status: 'R_Stat', due_date: 'Due' },
                columnsDropdown: true,
                saveState: true,
                storage: 'session',
                dateFormat: 'DD/MM/YYYY',
                perPageValues: [4,10,50,100],
                filterable: true,
                texts: {
                  filterPlaceholder: 'Search NCRs'
                },
                padding: 0.25

            }, //END OF OPTIONS
            view: false,
            view_comps: false,
            heading: '',
            body: '',
            images: [],
            view_images: false,
            slide: 0,
            sliding: null,
            filter: 'All',
            liable_entity: 'All',
            maint_status: 'All',
            reg_status: 'All',

            rowClassCallback(row) {

                if(row.ncr_no.length>0) {
                    console.log('Row class')
                    return "bis"
                }
                
                 
            }
                        //from: '',
            //to: '',
            //new_ncrs: [],
            //filter2: {region: 'All', type: 'All', liable_entity: 'All', maint_status: 'All', reg_status: 'All'}
           
        }
    },

    methods: {

        storeData() {
            console.log('Storing new data, length = ', this.filterNCRS2().length)
            window.sessionStorage.filtered_data = JSON.stringify(this.filterNCRS2())
        },

        getSelected() {
           return this.filtered_data.filter(n => n.selected == true).length 
        },


        selectOne(checked, id) {
            let ncr = this.joined_ncr.find(n => n.id == id)
            let ncr2 = this.filtered_data.find(n => n.id == id)
        
            if(checked) {
                ncr.selected = true
                ncr2.selected = true
                //this.selected.push(ncr)
            }
            else {
                ncr.selected = false
                ncr2.selected = false
                //this.selected.splice(index, 1)
            }
            console.log(this.selected)
        },


        selectAll(checked) {
            
            //this.onFilter()
            console.log('selectAll running')
            let length = this.filterNCRS2().length
            
            for (let i = 0; i < length; i++) {
                if (checked) {
                    
                    this.filterNCRS2()[i].selected = true
                    this.joined_ncr.find(n => n.id == this.filterNCRS2()[i].id).selected = true
                } 
                else {
                    
                   this.filterNCRS2()[i].selected = false
                   this.joined_ncr.find(n => n.id == this.filterNCRS2()[i].id).selected = false
                }
            }

        },

        
        exportExcel() {
          if(this.getSelected()>0) {
                let export_list = []
                let maintenance = this.filtered_data.filter(n => n.selected == true)
                maintenance.sort((a,b) => {
                    let fa = a.product_name.toLowerCase()
                    let fb = b.product_name.toLowerCase()
                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                    }) 
                //console.log(maintenance)

                for(let i = 0; i<maintenance.length; i++) {
                    export_list[i] = {}
                    export_list[i]['NCR No'] = maintenance[i].ncr_no
                    export_list[i]['Region'] = maintenance[i].region
                    export_list[i]['Reg Status'] = maintenance[i].status
                    export_list[i]['Maint Status'] = maintenance[i].maint_status
                    export_list[i]['Inv/Crd No'] = this.invCr(maintenance[i])
                    export_list[i]['Orig INV/SO'] = maintenance[i].orig_so
                    export_list[i]['Site'] = maintenance[i].project
                    export_list[i]['Product'] = maintenance[i].product_name
                    export_list[i]['Qty'] = maintenance[i].p_qty
                    export_list[i]['Fault Category'] = maintenance[i].category
                    export_list[i]['Failure Description'] = maintenance[i].failure
                    export_list[i]['Findings'] = maintenance[i].findings
                    export_list[i]['Date Logged'] = maintenance[i].log_date.split(" ")[0]
                    export_list[i]['Date Supplied'] = maintenance[i].manufactured
                    export_list[i]['Access'] = maintenance[i].access
                    export_list[i]['Elements Costed'] = maintenance[i].cost_elements
                    export_list[i]['Tot. Cost'] = maintenance[i].value
                    export_list[i]['Responsible'] = maintenance[i].responsible
                    export_list[i]['Corrective Action'] = maintenance[i].corrective_action
                    export_list[i]['Preventative Action'] = maintenance[i].preventative_action
                    export_list[i]['Liable Entity'] = maintenance[i].liable_entity
                    export_list[i]['Liable'] = maintenance[i].liable

                }


                //export_list.sort((a,b) => { return a.maint_status - b.maint_status})
                let ws1 = export_list
                
                var sheet1 = XLSX.utils.json_to_sheet(ws1);
                
                for(let i in sheet1) {
                    if(i != '!ref') {
                        //console.log(i)
                        sheet1[i].s = {
                            font: {
                                    name: 'Arial',
                                    sz: 8
                                }
                        }

                    }
                    
                }
                
                /*var sheet2 = XLSX.utils.json_to_sheet(export_list.filter(l => l['Maint Status'] == 'active'));
                //var sheet3 = XLSX.utils.json_to_sheet(export_list.filter(l => l['Liable Entity'] == 'Supplier'));
                for(let i in sheet2) {
                    if(i != '!ref') {
                        //console.log(i)
                        sheet2[i].s = {
                            font: {
                                    name: 'Arial',
                                    sz: 8
                                }
                        }

                    }
                    
                }

                var sheet3 = XLSX.utils.json_to_sheet(export_list.filter(l => l['Maint Status'] == null));
                //var sheet3 = XLSX.utils.json_to_sheet(export_list.filter(l => l['Liable Entity'] == 'Supplier'));
                for(let i in sheet3) {
                    if(i != '!ref') {
                        //console.log(i)
                        sheet3[i].s = {
                            font: {
                                    name: 'Arial',
                                    sz: 8
                                }
                        }

                    }
                    
                }*/
                

                var wb = XLSX.utils.book_new();


                XLSX.utils.book_append_sheet(wb, sheet1);
                /*XLSX.utils.book_append_sheet(wb, sheet2, `Active`);
                XLSX.utils.book_append_sheet(wb, sheet3, `Unassigned`);*/

                XLSX.writeFile(
                    wb,
                    `Maintenance Report ${this.filter2.from} - ${this.filter2.to}.xlsx`
                ); // name of the file is 'book.xlsx'
          }
          else {
            alert("Please tick records to be exported")
          }
          
        },


        invCr(ncr) {
            let value = ""
            if(ncr.invoice_no != null) {
                value = value+ncr.invoice_no
            }
            if(ncr.credit_no != null) {
                value = value + " " + ncr.credit_no
            }
            return value
        },

        async deleteNCR(ncr) {
            if(confirm(`Are you sure you want to delete ${ncr.ncr_no}?`)){
                console.log(ncr)
                await this.$axios.$post('/delete_ncr', {id: ncr.id, person: this.$auth.user.username})
            }
            console.log(`Deleting ${ncr.ncr_no}, ncrLog page`)
            await this.$emit('reloadNCRs')
            await this.onFilter("")
            this.value()
            this.filterNCRS2()
            this.$forceUpdate()

        },
     

        productName(row) {
             let name = ""
            if(row.product_name != null) {
                let name_arr = row.product_name.split(",")
                let qty_arr = row.p_qty.split(",")
            
                for(let i = 0; i<name_arr.length; i++) {
                    if(i == 0) {
                        name = qty_arr[i] + ' x ' + name_arr[i]
                    }
                    else {
                        name = name + ", " + qty_arr[i] + ' x ' + name_arr[i]
                    }
                    
                }
            }
            
            return name
        },

       
        value() {
            let value = 0
            for(let i = 0; i<this.filterNCRS2().length; i++) {
                value = value + this.filterNCRS2()[i].value
            }
            return Math.round(value)
        },

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },

        


        showImages(images) {
            
            
            let tot_images = images.split(',')
               
            
            if(tot_images.length>0) {
                for(let i = 0; i<tot_images.length; i++) {
                    tot_images[i] = `http://localhost:2000/uploads/`+tot_images[i] //`http://it-foundry:3001/uploads/`+tot_images[i]
                } 
                
            }
            else {
                tot_images = ['http://localhost:2000/uploads/No_Image_Available.jpg'] //['http://it-foundry:3001/uploads/No_Image_Available.jpg']
                
            }
            
            this.$viewerApi({
                images: tot_images,
            })
            
        },

        
        checkFindings(ncr_no) {
            let products = this.products.filter(p => p.ncr_no == ncr_no)
            let show = false
            for(let i = 0; i<products.length; i++) {
                if(products[i].findings != null) {
                    show = true
                }
            }
            return show
        },

        viewSummary(products, values) {

            let products_arr = products.split(',')
            let value_arr = values.split('/+/')
            let value = ''
            let new_values = []
            
                for(let i = 0; i<products_arr.length; i++) {
                    let obj = {}
                    obj.product = products_arr[i]
                    obj.value = value_arr[i]
                    new_values.push(obj)
                    
                }
            return new_values
        },

        viewFailure(products, values, category) {

            let products_arr = []
            if(products != null) {
                products_arr = products.split(',')
            }
            
            let value_arr = []
            if(values != null) {
                value_arr = values.split('/+/')
            
            }
            
            let cat_arr = []
            if(category != null) {
                cat_arr = category.split('/+/')
            }
            
           
            let value = ''
            let new_values = []
            
                for(let i = 0; i<products_arr.length; i++) {
                    let obj = {}
                    obj.product = products_arr[i]
                    if(cat_arr.length>0 && value_arr.length > 0) {
                        if(value_arr[i].length > 0) {
                        obj.value = value_arr[i] + ', ' + cat_arr[i]
                        }
                        else {
                            obj.value = cat_arr[i]
                        }
                    }
                    if(value_arr.length > 0 && cat_arr.length == 0) {
                        obj.value = value_arr[i]
                    }
                    if(cat_arr.length > 0 && value_arr.length == 0) {
                    
                        obj.value = cat_arr[i]
                    }
                    
                    new_values.push(obj)
                   
                }
            return new_values
        },


        showComps(comp, qty, supplier) {
        
            let components = []
           
           let comp_arr = comp.split(',')
           let qty_arr = qty.split(',')
           let supplier_arr = supplier.split(',')

           for(let i = 0; i<comp_arr.length; i++) {
               let obj = {}
               obj.component = comp_arr[i]
               obj.qty = qty_arr[i]
               obj.supplier = supplier_arr[i]
               components.push(obj)
           }
           return components
              
            
        },
    
        closeLog() {
            //this.ncrs = await this.$axios.$get('/ncr')
            console.log('close clicked')
            this.$emit('reloadNCRs')
            console.log('reload has been called on the index page')
            this.log = false
            this.view_ncr = false
            this.onFilter(" ")
            this.value()
            this.filterNCRS2()
            
            this.$forceUpdate()

            
        },


        clickedNCR(row) {
            this.ncrObj = row
            console.log('ncrObj = ', this.ncrObj)
        },

        filterNCRS2() {
            //this.onFilter("")
            let new_ncrs = this.filtered_data


            if(this.filter2.region == 'All' && this.filter2.type == 'All' && this.filter2.liable_entity == 'All' && this.filter2.maint_status == 'All' && this.filter2.reg_status == 'All' && this.filter2.charge == 'All') {
                new_ncrs =  this.filtered_data.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to)
                return new_ncrs
            }
            else {
              
                if(this.filter2.region != 'All') {
                    new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && ncr.region == this.filter2.region)
                }
                if(this.filter2.type != 'All') {
                    new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && ncr.type == this.filter2.type)
                }
                if(this.filter2.liable_entity != 'All') {
                    new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && ncr.liable_entity == this.filter2.liable_entity)
                }
                if(this.filter2.maint_status != 'All') {
                    new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && ncr.maint_status == this.filter2.maint_status)
                }
                if(this.filter2.reg_status != 'All') {
                    new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && ncr.status == this.filter2.reg_status)
                }
                if(this.filter2.charge != 'All') {
                    if(this.filter2.charge == 'Yes') {
                        new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && (ncr.invoice_no != null || ncr.credit_no != null))
                    }
                    if(this.filter2.charge == 'No') {
                        new_ncrs = new_ncrs.filter(ncr => ncr.log_date.split(" ")[0] >= this.filter2.from && ncr.log_date.split(" ")[0] <= this.filter2.to && ncr.invoice_no == null && ncr.credit_no == null)
                    }
                }

               
            return new_ncrs
            }
        },
 

        onFilter(event) {
            console.log('event.length = ', event.length)
            setTimeout(() => {
                    //console.log(this.$refs.ncrs.allFilteredData)
                    if(event.length>0) {
                        
                        this.filtered_data = this.$refs.ncrs.allFilteredData
                    }
                    else {
                        //console.log('event.legnth = 0 so this.joined_ncr.length = ', this.joined_ncr.length)
                        this.filtered_data = this.joined_ncr
                    }
                    if(this.filtered_data.length == 0) {
                        this.filtered_data = this.joined_ncr
                    }
                    //console.log('this.$refs.ncrs.allFilteredData.length = ', this.$refs.ncrs.allFilteredData.length)
                    //console.log('this.filtered_data.length = ', this.filtered_data.length)
                    
                },250)
            this.filterNCRS2()
            
        },
    },

   
    
    mounted() {
        //this.to = this.today()
        this.filtered_data = this.joined_ncr
        if(this.joined_ncr.length == 0) {
            console.log('forcing update in child')
            this.$forceUpdate()
        }
        console.log('child mounted this.joined_ncr.length = ', this.joined_ncr.length)
        
        this.filterNCRS2()
       
        /*this.onFilter("")
        this.value()*/
        
        window.sessionStorage.filtered_data = JSON.stringify(this.filterNCRS2())
        
    },

   
    
}
</script>

<style scoped>


.VueTables__table th, .VueTables__table td {
    padding: 0rem
}

.table th, .table td {
    padding: 0.0rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}

.bis, .oos {
    padding: 0.25rem
}

label, select, input {
    font-size:14px
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

.close2 {
  color: rgb(255, 255, 255);
  float: right;
  font-size: 45px;
  font-weight: bold;
  margin-left: 95%;
}


.close2:hover,
.close2:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

</style>