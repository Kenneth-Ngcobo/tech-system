<template>
<div>
<center>
    <table>
        <tbody>
            <tr>
                <td><strong>Project</strong></td>
                <td style="width:2%"></td>
                <td>
                    <model-list-select 
                        :list="projects"
                        v-model="project"
                        option-value="ProjectID"
                        option-text="ProjectName"
                        placeholder="Search projects"
                        style="width:250px"
                        > 
                    </model-list-select>
                </td>
                <td style="width:2%"></td>
                <td><strong>/</strong></td>
                <td style="width:2%"></td>
                <td><strong>Quote Number</strong></td>
                <td style="width:2%"></td>
                <td><input type="text" placeholder="Enter Quote No" v-model="quote_no"></td>
                <td style="width:5%"></td>
                <td><b-button v-if="!wait" @click="loadQuotes">Load</b-button></td>
                
            </tr>
        </tbody>
    </table>

</center>


<div class="row" style="margin-top: 1%;"  v-if="quotes.length>0">
    <div class="col-sm-3" style="position: relative;">
         <center>
            <strong style="font-size:12px;">SFA (QUOTE) INFO</strong>
            <hr style="height:1px;border-width:0;color:gray;background-color:gray; margin-top: 0.1rem; margin-bottom: 0.5rem;">
        </center>
         <table style="width:100%; font-size:12px;">
           
            <tr >
                <td ><strong>Client</strong></td>
                <td style="width:5%"></td>
                <td><strong>{{quotes[0].ClientName}}</strong></td>
                
            </tr>
            <tr>
                <template v-if="loaded == 'project'">
                    <td><strong>Project Status</strong></td>
                    <td style="width:5%"></td>
                    <td><select v-model="quotes[0].ProjectStatus">
                        <option v-for="pstatus in project_status" :key="pstatus.ProjectStatusID">{{pstatus.Description}}</option>
                    </select></td>
                </template>
                <template v-if="loaded == 'quote'">
                    <td><strong>Quote Status</strong></td>
                    <td style="width:5%"></td>
                    <td><select v-model="quotes[0].QuoteStatus">
                        <option v-for="qstatus in quote_status" :key="qstatus.QuotationStatusID">{{qstatus.Description}}</option>
                    </select></td>
                </template>  
            </tr> 
            <tr >
                <td><strong>Quote Disc</strong></td>
                <td style="width:5%"></td>
                <td><input type="text" style="width:100px" v-model="quotes[0].Discount"></td>
            </tr>
            <tr >
                <!--td><strong>Warehouse</strong></td>
                <td style="width:5%"></td>
                <td> 
                    <select v-model="sel_wh" @change="Warehouse()">
                        <option value="">Select</option>
                        <option v-for="wh in warehouse" :key="wh.Code" :value="wh.Code">{{wh.Code}} - {{wh.Name}}</option>
                    </select>
                </td-->
            </tr>
            
        </table>

        <table style="position: absolute; bottom: 0; font-size:12px; width:100%;">
            <tr>
                <td><strong>Order Discount</strong></td>
                <td style="width:3%"></td>
                <td><input type="text"></td>
            </tr>
        </table>

    </div>
    <div class="col-sm-1">
    </div>
    <div class="col-sm-8">
        <center>
            <strong style="font-size:12px;">SAGE (SO) INFO</strong>
            <hr style="height:1px;border-width:0;color:gray;background-color:gray; margin-top: 0.1rem; margin-bottom: 0.5rem;">
        </center>
         <table style="width:100%; font-size:12px;" >
             
        <tr>
            <td><strong>Ext OrderNum</strong></td>
            <td style="width:40%"> <input type="text" style="width:100%; border-color:#F8F8FF; paddng: 0.67857143em 2.1em 0.67857143em 1em" v-model="so.ext_ordernum"><span v-if="findReq('ext_ordernum')" style="color:red">Required</span></td>
            <td><strong>Rep</strong></td>
            <td style="width:40%"> <model-list-select 
                    :list="sage_reps"
                    v-model="so.rep"
                    option-value="Code"
                    option-text="Name"
                    placeholder="Select"
                    style="width:100%"
                    > 
            </model-list-select>
            <span v-if="findReq('rep')" style="color:red">Required</span>
            </td>
        </tr>
        <tr>
            <td><strong>Project</strong></td>
            <td style="width:30%"> <model-list-select 
                    :list="sage_projects"
                    v-model="so.project_code"
                    option-value="ProjectCode"
                    option-text="DisplayName"
                    placeholder="Select"
                    style="width:100%"
                    > 
            </model-list-select>
            <!--span v-if="findReq('project_code')" style="color:red">Required</span-->
            </td>
        
            <td><strong>Client</strong></td>
            <td style="width:30%"> <model-list-select 
                    :list="sage_clients"
                    v-model="so.client"
                    option-value="Account"
                    option-text="Name"
                    placeholder="Select"
                    style="width:100%"
                    
                    @input="findReq('client')"
                    > 
            </model-list-select>
            <span v-if="findReq('client')" style="color:red">Required</span>
            <span v-if="findClient()" style="color:red">Account On Hold</span>
            </td>
            
        </tr>
        <tr>
            <td><strong>Priority</strong></td>
            <td style="width:30%"> <model-list-select 
                    :list="priority"
                    v-model="so.priority"
                    option-value="idIncidentPriority"
                    option-text="cDescription"
                    placeholder="Select"
                    style="width:100%"
                    > 
            </model-list-select>
            <!--span v-if="findReq('priority')" style="color:red">Required</span-->
            </td>
            <td><strong>DOC Type</strong></td>
            <td style="width:30%"> <model-list-select 
                    :list="doc_types"
                    v-model="so.doc_type"
                    option-value="DocID"
                    option-text="DocType"
                    placeholder="Select"
                    style="width:100%"
                    > 
            </model-list-select>
            <span v-if="findReq('doc_type')" style="color:red">Required</span>
            </td>
        </tr>
    </table>
       
    </div>
    
   
    

</div>



<hr style="height:2px;border-width:0;color:gray;background-color:gray">

<div class="row" v-if="quotes.length>0">
    <div class="col-md-3">
        <b-button v-if="!show_selected" @click="showSelected(); show_selected = true">Show Only Selected</b-button>
        <b-button v-else @click="filterQuotes2(); show_selected = false">Revert</b-button>
    </div>

    <div class="col-md-6">
        <center>
        <b-button v-if="!edit && ($auth.user.username == 'Kenneth' || $auth.user.email == 'yolanda@regentlight.co.za')" @click="edit = true">Edit Quote</b-button>
        <b-button v-if="!edit_qty && $auth.user.email != 'yolanda@regentlight.co.za'" @click="edit_qty = true">Edit Qty</b-button>
        <b-button v-if="edit || edit_qty" @click="edit = false; edit_qty = false">Cancel</b-button>
        <b-button v-if="edit || edit_qty || true" @click="saveQuote()">Save</b-button>
        <b-button v-if="!edit && !edit_qty" @click="processSO()">Process SO</b-button> <!-- Must be able to process SO even if some codes are missing just incase they are not selected-->
        </center>
    </div>

    <div class="col-md-3" >
        <span style="float:right">
            <b-button v-if="quotes.length>0 && request.length>0 && ($auth.user.username == 'Kenneth' || $auth.user.email == 'yolanda@regentlight.co.za')" @click="finishCodes()">Finish Codes</b-button>
            <b-button v-if="missing_codes && $auth.user.email != 'yolanda@regentlight.co.za'" @click="modal = true">Request Codes</b-button> <!--&& request.length == 0-->
           
        </span>
    </div>

</div>
 

<center v-if="request.length>0">
    <span v-if="request[request.length-1].date_created == null">Codes Requested: {{request[request.length-1].date_requested}}</span>
    <span v-else>Codes Created: {{request[request.length-1].date_created}}</span>
</center>
<center>
    <span v-if="so.processed">SO Processed By: {{so.person}} on {{so.date}}</span>
</center>

<div v-if="filtered_quotes.length>0" style="margin-top:1%">
    <label style="font-weight:bold">Search Quotes</label>
    <input type="text" style="width: 15%" v-model="search" @keypress="filterQuotes2()" @keyup.delete="filterQuotes2()">
</div>
<table v-if="!wait" class="table table-bordered table-hover" style="font-size:12px; width:100%; margin-top:1%;">
    <thead>
        <tr>
  
            <th style="text-align:center">Sel. <input style="margin-left:5%" type="checkbox" v-model="select" @change="selectAll()"></th>
            <!--th>ItemID</th-->
            <th>Quote  <span class="dropdown" style="float:right" > 
                <select style="width:20px;" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></select>
                <div :class="{'dropdown-menu' : true, 'show': show}" style="width:350px">
                    <!--center><input type="text" style="width:95%; margin-bottom:1%" placeholder="Search Quotes" v-model="search" @change="quoteVersions()"></center>
                    <a class="dropdown-item" style="white-space:normal" v-for="q in quoteVersions()" :key="q.QuotationID"><input type="checkbox" :value="q" v-model="selected_quotes" @change="filterQuotes2($event)"><span style="font-weight: bold"> {{q.QuotationID.toString().padStart(8, '0')}}</span> ({{q.Description}}<span v-if="q.Version"> - V{{q.Version}})</span></a-->
                    <center><input type="text" style="width:95%; margin-bottom:1%" placeholder="Search Quotes" v-model="search" @change="quoteVersions3()"></center>
                    <a class="dropdown-item" style="white-space:normal" v-for="q in quoteVersions3()" :key="q.QuotationID">
                    <input type="checkbox" :value="q" v-model="selected_quotes" @change="filterQuotes2($event)">
                    <span style="font-weight: bold"> {{q.QuotationID.toString().padStart(8, '0')}}</span> ({{q.Description}}<span v-if="q.Version"> - V{{q.Version}})</span></a>       
                </div>
                </span>
            </th> 
            <!--th>ItemID</th>
            <th>Acc?</th-->
            <th>Code</th>
            <th>Description</th>
            <th><div>WH 
                <select v-model="sel_wh" @change="Warehouse()" style="width:20px; float:right">
                    <option v-for="wh in warehouse" :key="wh.Code" :value="wh.Code">{{wh.Code}} - {{wh.Name}}</option>
                </select>
                </div>
            </th>
            <th>Qty</th>
            <th style="padding:0px; vertical-align:middle"><b-button style="font-size:12px; width:100%; height:100%" @click="sageStock()">Avail</b-button></th>
            <th>U. Cost</th>
            <th>Q.Disc</th>
            <th>T. Cost</th>
        </tr>
        
    </thead>
   
    <tbody>

        <template v-for="(q,index) in filtered_quotes" >
      
        <tr  :key="q.ItemID" :class="{ red: checkCodes(q.Code)}">
          
            <td style="width:4%; text-align:center; vertical-align:middle" v-if="!accItem(q.ItemID)">{{index+1}}{{'  '}}<input type="checkbox" v-model="q.selected" @click="Select($event, q.ItemID)">
           
            </td>
            <td v-else style="width:4%; text-align:center;vertical-align:middle">{{accIndex(q.ItemID)}}{{' '}}<input type="checkbox" v-model="q.selected" @click="Select($event, q.ItemID)"></td>
            
            <td style="width:10%" v-if="!accItem(q.ItemID)"><strong>{{q.QuotationID.toString().padStart(8, '0')}}</strong> ({{q.Quote}} - V{{q.Version}})</td>
            <td style="width:10%" v-else>*Accessory</td>
            <!--td style="width:5%">{{q.QuotationID}}</td-->
            <!--td style="width:5%">{{q.ItemID}}</td>
            <td style="width:5%">{{accItem(q.ItemID)}}</td-->
            <td style="width:12%" v-if="!edit" >{{q.Code}}</td>
            <td style="width:12%" id="mod" v-else><input style="width:100%" type="text" v-model="q.Code"></td>
            <td style="width:41%" v-if="!edit">{{q.Description}}</td>
            <td style="width:41%; height:64.94px" id="mod" v-else>
            <textarea name="" id="" style="width:100%; height:100%" v-model="q.Description"></textarea>
            </td>
            <td style="width:4%; text-align:center" v-if="!edit && !edit_qty && edit_wh != index+1" @dblclick="edit_wh = index+1">{{q.Warehouse}}</td>
            <td style="width:4%; text-align:center" v-else><select style="width:100%" v-model="q.Warehouse" @change="edit_wh = 0"> <!-- @change=" ItemWarehouse(q)"-->
                <option value="">Select</option>
                <option v-for="wh in warehouse" :key="wh.Code" :value="wh.Code">{{wh.Code}} - {{wh.Name}}</option>
            </select></td>
            <td style="width:3%; text-align:center" v-if="!edit && !edit_qty && edit_sqty != index+1" @dblclick="edit_sqty = index+1">{{q.Quantity}}</td>
            <td style="width:3%; text-align:center" id="mod" v-else><input style="width:100%; text-align:center" type="text" v-model="q.Quantity"></td>
            <td style="width:3%; text-align:center">{{findStock(q)}}</td>
            <td style="width:4%; text-align:center">R{{q.CalculatedCost}}</td>
            <td style="width:3%; text-align:center">{{q.DiscountPercentage}}</td>
            <td style="width:4%; text-align:center">R{{q.TotalCost}}</td>
            
        </tr>
      
        </template>
       
    </tbody>
   
</table>

<div v-else class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
    </div>
</div>

<div v-if="modal" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        

            <table>
                <tr>
                    <td><label>Send Email To: </label>
                        <select v-model="email">
                            <option selected value="Yolanda@regentlight.co.za">Yolanda@regentlight.co.za</option>
                            <option value="Leeanne@regentlight.co.za">Leeanne@regentlight.co.za</option>
                            <option value="rochellevh@regentlight.co.za">rochellevh@regentlight.co.za</option>
                            <option value="kenneth@regentlight.co.za">kenneth@regentlight.co.za</option>
                        </select>
                        <b-button style="margin-left:1%" @click="requestCodes(email)">SEND</b-button>
                        <b-button style="margin-left:1%" @click="modal = false">CANCEL</b-button>
                    </td>

                </tr>
            </table>

                  
         </div>
    </div>
    </div>




</div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import XLSX from "xlsx-js-style";
export default {
    middleware: ['auth'],
    components: { ModelListSelect },
    props: ['projects', 'project_status', 'quote_status', 'accessories'],

    data() {
        return {
            //projects: [],
            search: "",
            modal: false,
            admin_emails: [{id: 1, email: 'Yolanda@regentlight.co.za'}, {id:2, email: 'Leeanne@regentlight.co.za'}, {id:3, email: 'rochellevh@regentlight.co.za'}, {id:4, email: 'kenneth@regentlight.co.za'}],
            email: "Yolanda@regentlight.co.za",
            project: '',
            quote_no: '',
            quotes: [],
            select: false,
            edit: false,
            edit_qty: false,
            edit_wh: 0,
            edit_sqty: 0,
            quote_names: [],
            loaded: '',
            edit_client: false,
            warehouse: [],
            sel_wh: '',
            missing_codes: false,
            selected_quotes: [],
            show: false,
            show2: false,
            pure_quote_names: [],
            filtered_quotes: [],
            orig_quotes: [],
            changes: [],
            codes: [],
            version: [],
            selected_version: [],
            quote_versions: [],
            sfa_codes: [],
            sage_codes: [],
            request: [],
            selected: [],
            show_selected: false, 
            wait: false,
            search: "",
            sage_projects: [],
            sage_reps: [],
            sage_clients: [],
            priority: [],
            so: {
                ext_ordernum: "",
                client: "",
                project_code: "",
                priority: "",
                rep: "",
                doc_type: "",
                discount: ""
            },
            orig_so: {},
           //required: [],
            required: ['ext_ordernum', 'client', 'rep', 'doc_type'],
            doc_types: [{DocType: 'Proforma-Invoice', DocID: 'Q'}], //{DocType: 'Sales Order', DocID: 'S'}, 
            sfa_ref: "",
            selected_array: [],
            stock: []
        
            
            //accessories: []
        }
    },

    methods: {

        findStock(q) {
            let stock = this.stock.find(i => i.Code == q.Code && i.WhseCode == q.Warehouse)
            if(stock) {
                return stock.Qty_On_Hand
            }
            else {
                return " "
            }
        },

        async sageStock() {
           this.stock = await this.$axios.$post('/sage_stock', {quotes: JSON.stringify(this.filtered_quotes)})
        },

        accIndex(ItemID) {
            let parent_id = ''
            if(ItemID) {
                parent_id = ItemID.replace(/\D/g,'')
                let pindex = this.filtered_quotes.map(f => f.ItemID).indexOf(parent_id)
                let index = ItemID.replace(/[0-9]/g, '')
                return pindex+1+index.toLowerCase()
            }
            else {
                console.log('ItemID = ', ItemID)
                return ''
            }
            
            //let parent = this.filtered_quotes.find(q => q.ItemID == parent_id)
            
        },

        accItem(ItemID) {
            var regExp = /[a-zA-Z]/g;                       
            if(regExp.test(ItemID)){
                return true
            } else {
                return false
            }
        },

        Select(e, ItemID) {
            let accs = this.filtered_quotes.filter(q => q.ItemID.includes(ItemID))
            
            if(accs) {
                accs.forEach(a => {
                    console.log('e.target.checked = ', e.target.checked)
                    if(e.target.checked) {
                        a.selected = true
                    }
                    else {
                        a.selected = false
                    }
                })
            }
            console.log(accs)
            this.$forceUpdate()

        },

        Warehouse() {
            this.filtered_quotes.forEach(q => {
                  q.Warehouse = this.sel_wh
                  /*for(let i = 0; i<q.accessories.length; i++) {
                    q.accessories[i].Warehouse = this.sel_wh
                  }*/
            })
        },

        ItemWarehouse(q) {
            q.accessories.forEach(a => {
                
                a.Warehouse = q.Warehouse
                //console.log(a)
            })
            this.edit_wh = 0
            this.$forceUpdate()
        },

        Event(action, event) {
            /*console.log('Event running')
            console.log(action)
            console.log(event)*/
        },

        findClient() {
            let client = this.sage_clients.find(c => c.Account == this.so.client)
            if(client) {
                if(client.On_Hold) {
                    return true
                }
                else {
                    return false
                }
            }
            else {
                return false
            }
        },

        findReq(key) {
           
            if(this.so[key].length == 0) {
                return true
            }
            else {
                return false
            }
            /*let err = this.required.find(r => r == key)
            //console.log('err = ', err)
           
            if(err) {
                return true
            }
            else {
                return false
            }*/
        },

        quoteVersions2() {
            if(this.search.length>0) {
                return this.selected_quotes.filter(q => 
                
                    {
                    
                    
                    let quote_no = q.QuotationID.toString().toLowerCase()
                    let description = q.Description.toString().toLowerCase()
                   
                    
                    const searchTerm = this.search.toLowerCase();

                    return quote_no.includes(searchTerm) || description.includes(searchTerm)
                    })
            }
            else {
                return this.selected_quotes
            }
        },

        quoteVersions3() {
           
            if(this.search.length>0) {
                return this.selected_array.filter(q => 
                
                    {
                    
                    
                    let quote_no = q.QuotationID.toString().toLowerCase()
                    let description = q.Description.toString().toLowerCase()
                   
                    
                    const searchTerm = this.search.toLowerCase();

                    return quote_no.includes(searchTerm) || description.includes(searchTerm)
                    })
            }
            else {
                return this.selected_array
            }
        },


        quoteVersions() {
            if(this.search.length>0) {
                return this.quote_versions.filter(q => 
                
                    {
                    
                    
                    let quote_no = q.QuotationID.toString().toLowerCase()
                    let description = q.Description.toString().toLowerCase()
                   
                    
                    const searchTerm = this.search.toLowerCase();

                    return quote_no.includes(searchTerm) || description.includes(searchTerm)
                    })
            }
            else {
                return this.quote_versions
            }
        },

        showSelected() {
            this.filtered_quotes = this.quotes.filter(q => q.selected == true)
        
        },

        async finishCodes() {
            //await this.loadQuotes()
            if(this.request[this.request.length - 1].date_created != null) {
                if(!confirm(`Codes have been already created for this quote, are you sure you want to send another email update?`)) {
                    return
                }
            }
            this.selected = this.quotes.filter(q => q.selected == true)
            if(this.selected.length == 0) {
                alert("Please select items to order")
                return
            }
            let error = false
            this.selected.forEach(s => {

                if(this.checkCodes(s.Code)) {
                    error = true
                }
            })

            if(error) {
                alert("Not all codes have been created for items to be processed")
                return
            }
            let request = this.request[this.request.length-1]

            let name = ''
            let type = ''
            let quote_no = ''
            if(this.loaded == 'project') {
               name = this.projects.find(p => p.ProjectID == this.project).ProjectName
               quote_no = this.project
               type = 'Project'
            }
            if(this.loaded == 'quote') {
                name = this.quote_no
                quote_no = this.quote_no
                type = 'Quote'
            }

            this.$axios.$post('/codes_created', {id: request.id, created_by: this.$auth.user.name, email: request.email, name: name, type: type})
            await this.loadQuotes()


        },

        checkCodes(code) {
            let sfa_code = this.sage_codes.find(c => c.Code == code) //sage_codes requests all sfa codes on the quote, including accessory codes
            if(sfa_code != undefined) { //if a code is found on sage, no action
                return false
            }
            else {
                this.missing_codes = true //if a code is not found, flag it
                return true
            }
        },

        async requestCodes(email) {
            
            if(this.request.length>0) {
                if(!confirm(`Codes have already been requested, are you sure you want to send another email request?`)) {
                    return
                }
            }
            this.selected = this.quotes.filter(q => q.selected == true)
            if(this.selected.length == 0) {
                alert("Please select all items to be ordered")
                return
            }
            
            let name = ''
            let type = ''
            let quote_no = ''
            if(this.loaded == 'project') {
               name = this.projects.find(p => p.ProjectID == this.project).ProjectName
               quote_no = this.project
               type = 'Project'
            }
            if(this.loaded == 'quote') {
                name = this.quote_no
                quote_no = this.quote_no
                type = 'Quote'
            }
            this.$axios.$post('/request_codes', {name: name, type: type, quote_no: quote_no, requested_by: this.$auth.user.name, email: this.$auth.user.email, admin_email: email})
            this.modal = false
            await this.saveQuote()
            
        },

        async saveQuote() {
            this.changes = []
            let quote = [...new Map(this.filtered_quotes.map(item =>
                            [item.ItemID, item])).values()];

            //console.log(`quote.length = ${quote.length} VS this.filtered_quotes.length = ${this.filtered_quotes.length}`)

            //////////////////  SAVE ORDERS INFO  ///////////////////////////////
            let so_changes = {}
            for(var key in this.so) {
                console.log(`${key}: old = ${this.orig_so[key]}, new = ${this.so[key]}`)
                if(this.so[key] != this.orig_so[key]) {
                    so_changes[key] = this.so[key]
                }
            }
            //console.log('so_changes = ', so_changes)
            if(Object.keys(so_changes).length>0) {
                if(Object.keys(this.orig_so) == 0) {
                    so_changes.action = 'add'
                }
                else {
                    so_changes.action = 'update'
                }
                so_changes.person = this.$auth.user.name
                so_changes.email = this.$auth.user.email
                so_changes.sfa_ref = this.sfa_ref
                await this.$axios.$post('/save_order_info', so_changes)
                //console.log('There are so changes to be made')
            }

            /******************     SAVING QUOTE LINES         **************************************** */

            for(let i = 0; i<quote.length; i++) {
                let obj = {}
                let orig_quote = this.orig_quotes.find(q => q.ItemID == quote[i].ItemID)
                let push = false
                for(var key in quote[i]) {
                    //if(key != 'accessories') {
                        if(quote[i][key] != orig_quote[key]) {
                            console.log(`${key}: ${quote[i][key]} != ${orig_quote[key]}`)
                            push = true
                            obj[key] = quote[i][key]
                        }  
                    //}  
                }
                if(push) {
                    //console.log('quote[i] = ', quote[i])
                    let tech_code = this.codes.find(c => c.item_id == quote[i].ItemID)
                    if(tech_code != undefined) {
                        obj.id = tech_code.id
                        obj.sfa_ref = this.sfa_ref
                        obj.Code = quote[i].Code
                        obj.item_id = quote[i].ItemID
                        obj.project_id = this.project
                        obj.quote_no = quote[i].QuotationID
                        obj.description = quote[i].Description
                        obj.type = null
                        obj.qty = quote[i].Quantity
                        obj.warehouse = quote[i].Warehouse
                        obj.person = this.$auth.user.username
                        obj.selected = quote[i].selected
                        obj.action = 'update'
                    }
                    else {
                        obj.sfa_ref = this.sfa_ref
                        obj.Code = quote[i].Code
                        obj.item_id = quote[i].ItemID
                        obj.project_id = this.project
                        obj.quote_no = quote[i].QuotationID
                        obj.description = quote[i].Description
                        obj.type = null
                        obj.qty = quote[i].Quantity
                        obj.warehouse = quote[i].Warehouse
                        obj.person = this.$auth.user.username
                        obj.selected = quote[i].selected
                        obj.action = 'add'
                    }
                    
                    this.changes.push(obj)
                }
            }

            console.log('changes = ', this.changes)
            //if(this.changes.length>0) {
                let id = await this.$axios.$post('/save_quote', {changes: JSON.stringify(this.changes)})  
                
            //}
            await this.loadQuotes()
            this.sel_wh = ''
            this.select = false
            this.edit = false
            this.edit_qty = false
            this.edit_wh = 0
            this.edit_sqty = 0
            return(id)
        
        },

        filterQuotes2() {
            let quotes = []
            let count = 0
            //console.log('this.selected_quotes.length = ', this.selected_quotes.length)
            for(let i = 0; i<this.selected_quotes.length; i++) {
                
                   if(count == 0) {
                    quotes = this.quotes.filter(q => q.Quote == this.selected_quotes[i].Description && q.Version == this.selected_quotes[i].Version)
                   }
                   else {
                    quotes = quotes.concat(this.quotes.filter(q => q.Quote == this.selected_quotes[i].Description && q.Version == this.selected_quotes[i].Version))
                   }
                   
                    count = count + 1
                
            }

            if(this.search.length>0) {
                  //console.log('search = ', this.search)
                    quotes  = quotes.filter(q => {
                    let search = this.search.toLowerCase()
                    let description = q.Description.toString().toLowerCase();
                    let code = q.Code.toString().toLowerCase();
                    return code.includes(search) || description.includes(search)
                })
            }

            this.filtered_quotes = quotes.sort((a, b) => a.ItemID/*.replace(/\D/g,'')*/ > b.ItemID/*.replace(/\D/g,'')*/ ? 1 : -1);

            //return(quotes)
            //this.$forceUpdate()
            //console.log('this.filtered_quotes.length = ', this.filtered_quotes.length)

        },

       
        filterQuotes(event) {
           //console.log(event)
           if(event != null) {
                if(event.target._value == 'All' && this.selected_quotes.includes('All')) { //Selecting all quotes
                    this.selected_quotes = this.pure_quote_names
                }
                if(event.target._value == 'All' && !this.selected_quotes.includes('All')) { //Unselecting all quotes
                    this.selected_quotes = []
                }
                if(event.target._value != 'All' && this.selected_quotes.includes('All')) { //
                    this.selected_quotes.shift()
                }
           }
           
           let quotes = []
           //console.log(this.selected_quotes)
           let count = 0
           for(let i = 0; i<this.selected_quotes.length; i++) {
                
                if(this.selected_quotes[i] !== 'All') {
                   //console.log(this.selected_quotes[i])
                   if(count == 0) {
                    quotes = this.quotes.filter(q => q.Quote == this.selected_quotes[i])
                   }
                   else {
                    quotes = quotes.concat(this.quotes.filter(q => q.Quote == this.selected_quotes[i]))
                   }
                   
                    count = count + 1
                }
           }
           /*let count2 = 0
           for(let i = 0; i<this.selected_version.length; i++) {
                if(count2 == 0) {
                    quotes = quotes.filter(q => q.Version == this.selected_version[i])
                }
                else {
                    quotes = quotes.concat(this.quotes.filter(q => q.Version == this.selected_version[i]))
                }
                count2 = count2 + 1 
           }*/
           
           this.filtered_quotes = quotes

        },

       Position(name) {
            let tot_len = this.quotes.length
            let sum = 0
            let index = this.quote_names.findIndex(el => el.name == name)
            let count = this.quote_names.find(n => n.name == name).count
            //console.log('index = ', index)
            for(let i = index+1; i<this.quote_names.length; i++) {
                //console.log('this.quote_names[i] = ', this.quote_names[i])
                sum = sum + this.quote_names[i].count
            }
            let position = (tot_len - sum) - count

            return { position: position, name: this.quote_names.find(n => n.name == name).name, span: count}


       },

        noQuotes(quote) {
            return this.quotes.filter(q => q.Quote == quote).length 
        },


        async processSO() {
           
            
            if(this.so.processed) {
                if(confirm("An order has already been processed from this quote, do you want to process another order?")) {

                }
                else {
                    return
                }   
            }

            /**** CHECK ORDER INFO ***** */
            for(let i = 0; i<this.required.length; i++) {
                if(this.findReq(this.required[i])) {
                    alert("Error: Please fill in all required fields")
                    return
                }
            }

            if(this.findClient() && this.so.doc_type == 'S') {
                alert("Client account on hold, can't process SO")
                return
            }
            //this.required = []
            /*let ret = false
            for(let key in this.so) {
                if(this.so[key] != null) {
                    if(this.so[key].length == 0 || this.so[key] == 0) {
                        this.required.push(key)
                        ret = true
                    }
                }
                
            }
            if(ret) {
                return
            }*/
             

            /**** CHECK IF ITEMS ARE SELECTED *** */
            
            let selected = this.quotes.filter(q => q.selected == true)
            this.selected = selected.sort((a, b) => a.ItemID > b.ItemID? 1 : -1);
            if(this.selected.length == 0) {
                alert("Please select items to order")
                return
            }
            let error = false
            let warehouse = false
            
            let list = []
            this.selected.forEach(s => {

                if(s.Warehouse == undefined) {
                    warehouse = true
                }

                if(this.checkCodes(s.Code)) {
                    error = true
                }
                //s.accessories.forEach(a => {})
                

                else {
                    s.processed = true
                    list.push(s)
                    /*s.accessories.forEach(a => {
                        if(this.checkCodes(a.Code)) {
                            console.log('Accessory code error')
                            error = true
                        }
                        else {
                            list.push(a)
                        }
                        
                    })*/
                }
    
            })


            if(error) {
                alert("SO can't be processed, one of selected items does not have a code. Request Codes")
                return
            }

            if(warehouse) {
                alert("Please specify warehouses for selected items")
                return
            }

            else {
                
                
                let dump = []
                let timestamp = Number(new Date())
                                              

                //console.log('id = ', id[0].id)
                for(let i = 0; i<list.length; i++) {
                    dump[i] = {}
                    dump[i].LineID = list[i].ItemID + new Date().getUTCSeconds()
                    dump[i].CustomerCode = this.so.client
                    dump[i].ResponsiblePerson = this.$auth.user.name
                    dump[i].ResponsibleEmail = this.$auth.user.email.replace(/,/g, " ")
                    dump[i].ExternalOrder = this.so.ext_ordernum.replace(/,/g, " ")
                    dump[i].OrderDate = this.today() 
                    dump[i].StockCode = list[i].Code
                    let description = list[i].Description.replace(/[\r\n]/gm, ' ').replace(/Code:.*/, '').replace(/,/g, " ").trim() //new lines eliminated, everything after Code ignored
                    if(description.length>255) {
                        //description = ""
                        description = description.substring(0, 255) //cut string if longer than 255
                    }
                    dump[i].Description = description //list[i].Description.replace(/[\r\n]/gm, ' ').replace(/Code:.*/, '').replace(/,/g, " ").trim() 
                    //console.log(dump[i].Description)
                    dump[i].WarehouseCode = list[i].Warehouse
                    dump[i].Quantity = list[i].Quantity.toString().replace(/,/g, ".")
                    dump[i].PriceExcl = list[i].CalculatedCost //.UnitCost*((100 - (list[i].DiscountPercentage+this.quotes[0].Discount))/100).toString().replace(/,/g, ".")
                    dump[i].PriceInc = dump[i].PriceExcl*1.15.toString().replace(/,/g, ".")
                    dump[i].QuoteNo = this.sfa_ref 
                    dump[i].QuoteLine = list[i].QuotationID
                    dump[i].ProjectCode = this.so.project_code
                    dump[i].Code = this.so.rep
                    dump[i].OrderPriorityCode = this.so.priority
                    dump[i].DocStatus = this.so.doc_type
                    //dump[i].OrderID = id[0].id
                   
                }

                this.so.processed = true
                this.so.date = new Date().toLocaleString()//toISOString().slice(0, 19).replace('T', ' ')
                let id = await this.saveQuote()
                //console.log('id = ', id)

                dump.forEach(d => d.OrderID = id[0].id)

                let response = await this.$axios.$post('/write_file', {data: dump})
          
                
                alert(`${response.type}\n${response.message}`)


            }

    

        },

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },

        

        checkAcc(quote) {
            let ac = this.accessories.find(q => q.id == quote.ItemID )
            if(ac != undefined) {
                return {bol: true,
                        code: ac.code,
                        qty: ac.qty}
            }
            else {
                return {bol: false}
            }
        },

        accDescription(code, description) {
            if(code.length>0) {
                let acc = this.accessories.find(acc => acc.AccessoryCode == code)
                if(acc) {
                    return acc.AccessoryName
                }
                else {
                    return ''
                }
            }
            else {
                return description
            }
        },

        selectAll() {
            if(this.select) {
                this.filtered_quotes.forEach(q => {
                    q.selected = true
                })
            }
            else {
                this.filtered_quotes.forEach(q => {
                    q.selected = false
                }) 
            }

        },

        async loadQuotes() {

            
            this.sel_wh = ''
            this.sfa_ref = ""
            if(this.project.toString().length > 0 && this.quote_no.length > 0) { //both project & quote have values
                if(this.loaded == 'project') { //if project was loaded before, cancel project
                    this.project = ''
                }
                else if(this.loaded == 'quote') { //if quote was loaded before, cancel quote
                    this.quote_no = ''
                }
                else {
                    alert("Please enter one value between project name or quote number")
                    return
                }
                
            }

            if(this.project.toString().length == 0 && this.quote_no.length == 0) {
                alert("Please select either project or enter quote number")
                return
            }
            this.wait = true
            this.filtered_quotes = []
            this.codes = []
            let obj = {}
            this.loaded = ''
            if(this.project.toString().length > 0) {
                obj.id = this.project
                this.quote_no = ''
                this.loaded = 'project'
                this.sfa_ref = 'P'+this.project
            }
            if(this.quote_no.length>0) {
                let quote_no = (this.quote_no).toString()
                obj.no = quote_no
                this.project = ''
                this.loaded = 'quote'
                this.sfa_ref = 'Q'+this.quote_no
            }
             this.so =  {
                        ext_ordernum: "",
                        client: "",
                        project_code: "",
                        priority: "",
                        rep: "",
                        doc_type: ""
                    }            
            this.orig_so = {}
            let orig_so = await this.$axios.$post('/order_info', {sfa_ref: this.sfa_ref})
            if(orig_so.length>0) {
                this.so = orig_so[0]
                this.orig_so = Object.assign({}, this.so)
            }
           
            

            this.codes = await this.$axios.$post('/codes', obj) //fetches tech codes (quote_codes)
            
            //this.accessories = []
        
           
            //console.log('obj = ', obj)
            this.quotes = []
            this.quote_versions = []
           
            //console.log('this.quotes.length = ', this.quotes.length)
            this.quote_versions = await this.$axios.$post('/quote_versions', obj) //selects approved and forwarded to client quotes
            if(this.quote_versions.length != 1) {
                this.selected_quotes = this.quote_versions.filter(q => q.IsLatest == true && q.UseToEstimate == true) //filter for Calculated quotes
                if(this.selected_quotes.length == 0) {
                    this.selected_quotes = this.quote_versions.filter(q => q.IsLatest == true) //if no calculated quotes, filter for latest ones
                }
                if(this.selected_quotes.length == 0) {
                    this.selected_quotes = this.quote_versions //else, select all quotes
                }
            }
            else {
                    this.selected_quotes = this.quote_versions
            }
            this.selected_array = JSON.parse(JSON.stringify(this.selected_quotes))
            let quotes = this.selected_quotes.map(s => s.QuotationID)
            let res = await this.$axios.$post('/project_quotes', {quotes: JSON.stringify(quotes)}) //get sfa quote lines corresponding to these quite IDs
            if(res.hasOwnProperty('type')) {
                alert(`${res.message}`)
                this.wait = false
                return
            }
            else {
            this.quotes = res
            }
           
         
            this.sfa_codes = []
            let count  = 0
            this.quotes.forEach(q => {
                q.accessories = []
                let des = []
                let myquote = this.codes.find(c => c.item_id == q.ItemID) //Get quotes from mysql
                let code_exists = false
                if(myquote != undefined) { //Code exists on mysql (tech)
                    code_exists = true
                    q.ItemID = myquote.item_id
                    q.Code = myquote.code //Give item the latest code
                    q.Quantity = myquote.qty
                    q.Warehouse = myquote.warehouse
                    q.selected = myquote.selected
                    q.Description = myquote.description
                    this.sfa_codes.push(q.Code)
                }
                else {
                    if(q.Description != null) {
                        des = q.Description.split("\n")
                                              
                        
                    }
                    let index = des.findIndex(el => el.includes("Code:")) //find Code from quote
                    
                    if(index != -1) { //Code is found in description

                        let code = des[index].split(":")[1]
                        if(code) {
                            q.Code = code.trim()
                            this.sfa_codes.push(q.Code)
                        }
                        //q.Code = des[index].split(":")[1]//.trim()
                        //this.sfa_codes.push(q.Code)
                    }  
                    else {
                        q.Code = ""
                        this.missing_codes = true
                    }


                    let index2 = des.findIndex(el => el.includes("Accessories"))
                    if(index2 != -1) { //Code is found in description 
                        //console.log('des[index2] = ',  des[index2])
                        //console.log('des[index2].split(" ")[1].trim() = ', des[index2].split(" ")[1].trim())
                        
                        
                    }  

                }

                let AconcatCode = []

                if(q.AconcatCode != null) {
                    if(q.AconcatCode.length > 0) {
                        AconcatCode = q.AconcatCode.split("|")
                    }
                }

                let accIndex = -1
                if(q.Description != null) {
                    accIndex = q.Description.indexOf("Accessories")
                }
                let accDes = ''
                if(accIndex != -1) {
                    accDes = q.Description.substring(accIndex)
                }

                let accArr = accDes.split("\n")
                let actualAccessories = []

                for(let i = 0; i<accArr.length; i++) {
                    if(accArr[i].length>0) {
                        if(accArr[i].includes(" x ")) {
                            actualAccessories.push(accArr[i])
                        }
                        else {
                            if(actualAccessories.length>0) {
                                
                                actualAccessories[i-2] = accArr[i-1].concat(accArr[i])
                                
                            }
                            
                        }
                    }
                    //console.log('actualAccessories.length = ', actualAccessories.length)
                }

                let acc_code = ''
                let acc_qty = 0
                let description = ''
                let code = ''
                let unfound_acc = []

                for(let i = 0; i<actualAccessories.length; i++) {
                    let complete_code = actualAccessories[i].split(" x ")[1]
                    acc_qty = actualAccessories[i].split(" x ")[0]
                    if(complete_code) {
                        complete_code = complete_code.trim()
                        let split_acc = complete_code.split(" ")
                        code = split_acc[0]
                        let lastIndexCode = code.length+1
                        let trueCode = this.accessories.find(a => a.AccessoryCode == code)
                        if(trueCode) {
                            acc_code = code
                            description = complete_code.substring(lastIndexCode)
                            
                        }
                        else {
                            acc_code = code
                            description = complete_code
                        }

                        if(count == 30) {
                            console.log('accDes = ', accDes)
                            console.log('accArr = ', accArr)
                            console.log(`${count}: complete_code = ${complete_code}, trueCode = ${trueCode}`)
                        }
                        
                    }                 
                                     
                    let a = String.fromCharCode(i+1 + 64)
                    //q.accessories.push({ItemID: q.ItemID+a, Warehouse: q.Warehouse, QuotationID: q.QuotationID, Quote: q.Quote, Version: q.Version, Code: acc_code, 
                    //Description: description, Quantity: acc_qty*q.Quantity, CalculatedCost:0})


/***************************     NEW TRY     ************************************** */
                   let acc = {ItemID: q.ItemID+a, Warehouse: q.Warehouse, QuotationID: q.QuotationID, Quote: q.Quote, Version: q.Version, Code: acc_code, 
                   Description: description, Quantity: acc_qty*q.Quantity, CalculatedCost:0, TotalCost:0}

                   let myacc = this.codes.find(a => a.item_id == acc.ItemID)
                   //console.log('myacc = ', myacc)

                    if(myacc) {
                        
                        acc.Code = myacc.code
                        acc.Description = myacc.description
                        acc.Quantity = myacc.qty
                        acc.Warehouse = myacc.warehouse
                        acc.selected = myacc.selected

                    }



                   this.quotes.push(acc)

                 
/*********************************************************************************************** */


                    this.sfa_codes.push(acc_code)
                    acc_code = ''
                    acc_qty = 0
                    description = ''
                    code = ''

                }
                
                


                count++
                
            })
            this.sage_codes = []
            this.sfa_codes = [...new Set(this.sfa_codes)]
            this.sage_codes = await this.$axios.$post('/sage_codes', {codes: JSON.stringify(this.sfa_codes)})
            //console.log('this.sage_codes = ', this.sage_codes)
           
           
            
            this.orig_quotes = JSON.parse(JSON.stringify(this.quotes))
            this.filterQuotes2() 
            this.wait = false
            this.email = "Yolanda@regentlight.co.za"
            this.request = await this.$axios.$post('/get_request', obj)
           
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

        option(quote) {
            if(quote.Option.length == 0) {
                return quote.QuotationOptionID
            }
            else {
                return quote.Option
            }
        },

        rowSpan(quote) {
            let len = this.quotes.filter(q => q.QuotationID == quote.QuotationID)
            return len.length
        }

    },

    created: async function() {
        this.warehouse = await this.$axios.$get('/warehouse')
        this.sage_projects = await this.$axios.$get('/sage_projects')
        this.sage_reps = await this.$axios.$get('/sage_reps')
        this.sage_clients = await this.$axios.$get('/sage_clients')
        this.priority = await this.$axios.$get('/order_priority')
       
    }
}
</script>

<style scoped>

model-list-select {
    padding: 0.25em 0.5em;
}


td {
    padding: 0.25em 0.5em
}

.dropdown-item {
  margin-left: 0%;
  padding: 0% 2% 1% 3%;
  font-size: 14px;
  color: white
}

.dropdown-item :hover {
  background-color: rgb(162, 225, 27);
}

a:hover {
    background-color: rgb(162, 225, 27);
}

.dropdown-menu {
    width: 100%;
    background-color: #6c757d;
}

.table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
  background-color: lightblue;
}

.red {
    background-color: rgb(201, 111, 111);
}

#mod {
    padding: 0.2rem 0.1rem 0.2rem 0.1rem;
}

#mod2 {
    padding: 0.2rem 12px 0.2rem 12px
}

h2 {
   width: 100%; 
   text-align: center; 
   border-bottom: 1px solid #000; 
   line-height: 0.1em;
   margin: 10px 0 20px; 
   font-size: 15px
} 

h2 span { 
    background:#fff; 
    padding:0 10px; 
}

.col {
    width:41%
}

.col2 {
    width:59%
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
  margin: 15% auto; /* 15% from the top and centered */
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