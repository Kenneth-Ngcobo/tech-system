<template>
<div>
    <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    
    </head>
    <div>
        <!--h5 style="margin-left:40%">{{ncr.ncr_no}}</h5-->
         <!--view_images = true-->
    </div>
    
    <center>
         <b-alert variant="success"
         :show="dismissCountDown"
        dismissible
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
        class="alert-fixed"
         >
         Changes Saved!</b-alert>
    </center>

    <div style="margin-top:1%;">
        <b-card no-body >
            <b-tabs card >
                <b-tab > <!--:title="`${ncr.ncr_no} Details`"-->
                    <template #title>
                        <i v-if="filtered_data.findIndex(x => x.ncr_no == ncr.ncr_no) > 0" class="fa fa-arrow-left" @click="nextNCR2('back', ncr.ncr_no)" @keyup.left="alert('Left')"></i>
                        <strong>{{ncr.ncr_no}}</strong>
                        <i style="margin-left: 5px" v-if="filtered_data.findIndex(x => x.ncr_no == ncr.ncr_no) < filtered_data.length-1" class="fa fa-arrow-right" @click="nextNCR2('next', ncr.ncr_no)" @keyup.right="alert('Right')"></i>
                        <span>({{filtered_data.findIndex(x => x.ncr_no == ncr.ncr_no)+1}}/{{filtered_data.length}})</span>
                        <b-button v-if="ncr.type == 'Site'" style="font-size:12px" @click="comments = true">Notes</b-button>
                    </template>
                    <!--center>
                            <b-button v-if="ncr.type == 'Site'" style="font-size:12px" @click="comments = true">Notes</b-button>
                        </center-->
                    <div class="row">
                        
                        <div class="col-lg-5 float-left">
                        <table >
                            <tr> 
                                
                                <td style="width:25%"><label>Project/Site Name</label> </td>
                                <td colspan="3"><input type="text" v-model="ncr.project" style="width:100%; font-weight:bold"></td>
                            </tr>
                            <tr>
                                <td><label>Mounting Height</label></td>
                                <td><input type="text" v-model="ncr.access" style="width:100%"></td>
                                <td><label>Rep</label></td>
                                <td><input type="text" style="width:100%" v-model="ncr.sales_rep"></td>
                            </tr>
                            <tr>
                                <td><label>Type</label></td>
                                <td>
                                    <select style="height:30px; width:100%" v-model="ncr.type">
                                        <option value="Site">Site</option>
                                        <option value="Internal">Internal</option>
                                        <option value="Aluminium">Aluminium</option>
                                    </select>
                                </td>
                                
                                <td><label>Region/Dep</label></td>
                                <td>
                                     <select v-if="ncr.type == 'Site'" style="height:30px; width:100%" v-model="ncr.region"> <!--:disabled="ncr.type != 'Site'"-->
                                        <option value="JHB">JHB</option>
                                        <option value="CPT">CPT</option>
                                        <option value="DBN">DBN</option>
                                    </select>
                                    <select v-else style="height:30px; width: 100%" v-model="ncr.department"> <!--:disabled="ncr.type != 'Site'"-->
                                        <option value="Design">Design</option>
                                        <option value="Controls">Controls</option>
                                        <option value="Production">Production</option>
                                        <option value="Design">Purchasing</option>
                                        <option value="Foundry">Foundry</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Stores">Stores</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Recieving">Recieving</option>
                                    </select>
                                </td>
                                
                            </tr>
                             <tr>
                                <td><label>Original SO/INV</label></td>
                                <td><input type="text" style="width:100%" v-model="ncr.orig_so"></td>
                                <td style="width:22%"><label>Maintenance SO</label></td>
                                <td><input type="text" style="width:100%" v-model="ncr.so"></td>
                                <td><b-button @click="loadJobCard()">Load</b-button></td>
                            </tr>
                            <!--tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b-button @click="loadJobCard()">Load</b-button></td>
                            </tr-->
                            <tr>
                                <td><label>Maintenance Value</label> <strong style="float:right">R</strong></td>
                                <td><input type="text" style="width:100%" v-model="ncr.value"></td>
                                <td><label>Component Value</label> <strong style="float:right; ">R</strong></td>
                                <td><input type="text" style="width:100%" v-model="ncr.comp_value"></td>
                            </tr>
                            <tr>
                                <td><label>Costed Items</label></td>
                                <td colspan="3"><input type="text" style="width:100%" v-model="ncr.cost_elements"></td>
                            </tr>
                            
                        </table>
                        </div>

                        <div class="col-lg-7 float-right">
                            <table class="table-bordered">
                                <tr>
                                    <td style="width:22%"><label>Client</label></td>
                                    <td style="width:40%"><input type="text" style="width:100%" v-model="ncr.client"></td>
                                    <td style="width:20%"><label>Manufactured</label></td>
                                    <td><input type="text" style="width:100%" v-model="ncr.manufactured"></td>
                                </tr>
                                 <tr>
                                    <td><label>Logged</label></td>
                                    <td>{{ncr.log_date}}
                                        <span style="float:right">
                                            <label>By: </label>
                                            {{ncr.logged_by}}
                                        </span>
                                    </td>
                                    <td><label>Due</label></td>
                                    <td><input type="date" style="width:100%" v-model="ncr.due_date"></td>
                                </tr>
                                <tr>
                                    <td><label>Responsible</label></td>
                                    <td><input type="text" style="width:100%" v-model="ncr.responsible"></td>
                                    <td><label>Re-assign</label></td>
                                    <td> 
                                        <div class="dropdown" > 
                                        <select style="width: 100%; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                
                                        </select>
                                        <div :class="{'dropdown-menu' : true, 'show': show}" >
                                            <a class="dropdown-item" v-for="user in users" :key="user.id"><input type="checkbox" :value="user.name" v-model="ncr.responsible"> {{user.name}}</a>    
                                        </div>
                                        </div>
                                    </td>
                                    
                                </tr>
                               
                                <tr>
                                    <td><label>Maintenance Captured</label></td>
                                    <td><input type="checkbox" v-model="ncr.maint_captured">
                                        <span id="date" v-if="ncr.maint_captured && ncr.maint_date != null">{{ncr.maint_date.split(' ')[0]}}</span>
                                    </td>
                                    <td><label>Invoiced</label>
                                        <input type="checkbox" style="margin-left:5%" v-model="ncr.invoiced">
                                    </td>
                                    <td><input type="text" placeholder="INV No." style="width:100%" v-model="ncr.invoice_no"></td>
                                </tr>
                                <tr>
                                    <td><label>Assessed</label></td>
                                    <td><input type="checkbox" @change="checkAssessed"  @click="checkAssessed" :checked="ncr.tech_closed"> <!---->
                                    <span id="date" v-if="ncr.tech_closed && ncr.tech_date != null">{{ncr.tech_date.split(' ')[0]}}</span>
                                    <span v-if="ncr.assessed_by != null">By: {{ncr.assessed_by}}</span>
                                    <span style="float: right" v-if="$auth.user.name == 'Dirk' || $auth.user.name == 'Kenneth'">
                                        <label>Closed</label>
                                        <input type="checkbox" @change="checkClosed"  @click="checkClosed" :checked="ncr.status == 'closed'" > {{/*true-value="closed" false-value="open" v-model="ncr.status"*/}}
                                        
                                    </span>
                                    
                                    </td>
                                    <td><label>Credited</label>
                                        <input type="checkbox" style="margin-left:5%" v-model="ncr.credited">
                                    </td>
                                    <td><input type="text" placeholder="CR No." style="width:100%" v-model="ncr.credit_no"></td>
                                </tr>

                                <tr>
                                    <td><label>Regent Status</label></td>
                                    <td><strong>{{ncr.status}}</strong>
                                        <span v-if="(ncr.status == 'closed' || ncr.status == 'closed+inv') && ncr.close_date != null">
                                            <span id="date">{{ncr.close_date.split(' ')[0]}}</span>
                                            <span>By: {{ncr.closed_by}}</span>
                                        </span>
                                    </td>
                                    <td v-if="ncr.type == 'Site'"><label>Maintenance Status</label></td>
                                    <td v-if="ncr.type == 'Site'">
                                        <select style="width:100%" v-model="ncr.maint_status">
                                            <option value="active">Active</option>
                                            <option value="complete">Complete</option>
                                        </select>
                                    </td>

                                </tr>



                                <!--tr>
                                    
                                    <!-c-td><input type="checkbox"></td-c->
                                    <td><label>Invoiced</label></td>
                                    <td><input type="checkbox" v-model="ncr.invoiced">
                                    <span id="date" v-if="ncr.invoiced && ncr.inv_date != null">{{ncr.inv_date.split(' ')[0]}}</span>
                                    <span style="float:right" v-if="ncr.invoiced">
                                        <label >INV No</label>
                                        <input type="text" v-model="ncr.invoice_no" style="width:60%">
                                    </span>
                                    </td>
                                    <td v-if="ncr.type == 'Site'"><label>Maintenance Status</label></td>
                                        <td v-if="ncr.type == 'Site'">
                                            <select style="width:100%" v-model="ncr.maint_status">
                                                <option value="active">Active</option>
                                                <option value="complete">Complete</option>
                                            </select>
                                        </td>
                                </tr>
                                <tr>
                                    <td><label>Credited</label></td>
                                    <td><input type="checkbox">
                                    <span style="float:right">
                                        <label>CR Note</label>
                                        <input type="text" style="width:60%">
                                    </span>
                                    </td>
                                </tr-->

                            </table>
                        </div>
                    </div>
            
        </b-tab>
            </b-tabs>
        </b-card>
    </div>


    <div>
    <b-card no-body >
        <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase text-primary"> <!--v-model="tabIndex"-->
        
        <b-tab v-for="(product,index) in products" :key="product.id"  @click="changeTab(product, index)"> <!--:title="product.product_name"-->
        
            <template #title >
                <strong @dblclick="edit = true"
                @contextmenu.prevent="$refs.menu.open($event, product)"> <!-- @contextmenu.prevent="$refs.menu.open($event, product)"-->
                    {{product.product_name}} <span v-if="product.wattage != null">{{product.wattage}}W</span> <span v-if="product.length>0">{{product.length}}mm</span> {{product.dimming}} <span v-if="product.bb">BB</span>
                </strong>
                <b-button v-if="product.images != null" @click="showImages(product)" style="margin-bottom: 1%; font-size:12px">Images ({{product.images.split(',').length}})</b-button>
                
            </template>
            <b-card-text v-if="product.product_name != '+'" >
                <form>
                   
        
                
                <div class="row">
                <div class="col-lg-6 float-left"> <!-- style="background-color: grey"-->


                    <div class="form-group">
                        <label class="col-lg-4">Qty</label>
                        <input type="text" v-model="product.qty" style="margin-bottom: 2.5%">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Issue Category</label>
                        <!--multiselect :multiple="true" :close-on-select="false" :clear-on-select="false" v-model="product.category" :options="options"-->
                            <multiselect v-model="value" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="name" track-by="name" :hide-selected="true" :options="options" :multiple="true" :taggable="true" @input="addTag(index)"></multiselect> <!--@remove="removeTag(value)"-->
                            <!--pre class="language-json"><code>{{ value  }}</code></pre-->
                            <!--template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }}</span></template>
                        </multiselect-->
                        <!--input type="text" v-model="product.category" disabled-->
                    </div>
                    <div class="form-group" style="display: inline-block; width: 63%"> 
                        <label class="col-lg-4">Failure Description</label>
                        
                        <textarea name="" id="" style="width: 100%; margin: -4% 0 0 53.5%" rows="5" v-model="product.failure"></textarea>
                        
                    </div>

                    <div class="form-group">
                        <label class="col-lg-4">Upload Pics</label>
                        <input type="file" :ref="`pic${index}`" :id="`upload${index}`"  multiple accept="image/*"  @change="handleImageUpload(product.id, index, product.images)"/>
                    </div>
                    
                    <div class="form-group">
                        <label class="col-lg-4">Affected Components</label>
                        <table style="margin:-4% 0 0 34%; width:63%; font-size:13px" class="table-bordered">
                            <thead>
                                <th>Comp</th>
                                <th>Qty</th>
                                <th>Supplier</th>
                                <th>DEL</th>
                            </thead>
                            <tbody>
                                <tr v-for="comp in getComps(product.product_name)" :key="comp.id"> <!-- v-for="comp in getComps(product.product_name)" :key="comp.id"-->
                                    <td style="width:55%"><input type="text" style="width:100%" v-model="comp.component"></td> <!--v-model="comp.component"-->
                                    <td style="width:10%"><input type="text" style="width:100%" v-model="comp.qty"></td> <!--v-model="comp.qty"-->
                                    <td style="width:35%">
                                        <!--select type="text" style="width:100%" v-model="comp.supplier">
                                            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.supplier">{{supplier.supplier}}</option>
                                        </select-->
                                        <model-list-select 
                                            :list="suppliers"
                                            v-model="comp.supplier"
                                            option-value="supplier"
                                            option-text="supplier"
                                            placeholder="Search suppliers"
                                            style="width:100%;"
                                            > <!--@input="validateProd('check')"-->
                                        </model-list-select>
                                    </td>
                                    <td class="delete"><span @click="removeComp(comp.id)">&times;</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <b-button style="font-size:10px; margin-left:34%" @click="addProduct(product)">Add</b-button>
                        <!--textarea name="" id="" cols="40" rows="3" v-model="ncr.components"></textarea--> <!--v-model="ncr.components"-->
                    </div>
                    <!--div class="form-group">
                        <label class="col-md-4">Supplier</label>
                        <input type="text" v-model="ncr.supplier" :disabled="ncr.type != 'Stores/Recieving'">
                    </div-->
                     <div class="form-group" style="display: inline-block; width: 63%">
                        <label class="col-lg-4">Findings</label>
                        <textarea style="width: 100%; margin: -4% 0 0 53.5%" rows="5" v-model="product.findings"></textarea>
                    </div>
                     
                </div>
                <div class="col-lg-6 float-right">
                    <div class="form-group" style="display: inline-block; width: 63%">
                        <label class="col-md-4">Corrective Action</label>
                        <textarea style="width: 100%; margin: -6% 0 0 53.5%" rows="5" v-model="product.corrective_action"></textarea>
                    </div>
                    <div class="form-group" style="display: inline-block; width: 63%">
                        <label class="col-md-4">Preventative Action</label>
                        <textarea style="width: 100%; margin: -6% 0 0 53.5%" rows="5" v-model="product.preventative_action"></textarea>
                    </div>

                   
                    <div class="form-group">
                        <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                        <label class="col-md-4">Report</label>
                        <div v-if="product.report != null" style="margin-top: -4%; margin-bottom: 2%">
                            <!--i class="fa fa-file-pdf-o" style="font-size:35px;color:red" @click="openReport(product.report)"></i-->
                            <div v-for="(i,index) in product.report.split(',')" :key="i" style="margin-left: 34%;">
                                <!--span v-if="i != 'change'"-->
                                <a style="font-size: 13px ; " href="#" @click="openReport(i)">{{i.substring(19)}}</a> 
                                <b-button style="font-size:9px" @click="deleteDoc(index)">DELETE</b-button>
                            </div>
                        </div>
                        <div style="margin-left: 34%; margin-top: -4%">
                            <input v-if="product.report == null" type="file" multiple :ref="`report${index}`" accept=".pdf" @change="handleFileUpload(`report${index}`, product.id)">
                            <div>
                                <input type="checkbox" style="width:50px; margin-top: 4%; margin-left: -4%" @change="toggleFile(product, 'report')" v-model="product.toggle_report"><span style="font-size: 13px" >Change</span>
                                
                            </div>
                        </div>
                        <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                    </div>
                    

                    <div class="form-group">
                        <label class="col-md-4">Other Docs</label>
                        <input type="checkbox" :value="`train_reg${index}`" v-model="documents"> <!--value="train_reg"--v-model="documents"-->
                        <label class="col-md-2" style="font-weight: normal">Training Docs</label>
                        <input type="checkbox" :value="`train_doc${index}`" v-model="documents"> <!--value="train_doc"-->
                        <label class="col-md-2" style="font-weight: normal">Manuals</label>
                        <input type="checkbox" :value="`other${index}`" v-model="documents"> <!--value="other"-->
                        <label class="col-md-2" style="font-weight: normal">Other (Drawings etc)</label>
                    </div>

                   
                    <div class="form-group" v-if="documentsCheck(`train_reg${index}`)">
                         <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                        <label class="col-md-4">Training Docs</label>
                         <div v-if="product.training_reg != null" style="margin-top: -4%; margin-bottom: 2%">
                            <!--i class="fa fa-file-pdf-o" style="font-size:35px;color:red" @click="openReport(product.training_reg)"></i-->
                            <div v-for="i in product.training_reg.split(',')" :key="i" style="margin-left: 34%;">
                                <a style="font-size: 13px" href="#" @click="openReport(i)">{{i.substring(19)}}</a>
                            </div>
                          
                         </div>
                        <!--b-button style="margin-left:2%">Change Report</b-button-->
                        <div style="margin-left: 34%; margin-top: -4%">
                            <input  v-if="product.training_reg == null" type="file" multiple :ref="`training_reg${index}`" accept=".pdf" @change="handleFileUpload(`training_reg${index}`, product.id)"> <!-- @change="handleFileUpload()"-->
                            <div>
                                <input type="checkbox" style="width:50px; margin-top: 4%; margin-left: -4%" @change="toggleFile(product, 'training_reg')" v-model="product.toggle_training_reg"> <span style="font-size: 13px" >Change</span>
                            </div>
                        </div>
                    </div>
                    

                    <div class="form-group" v-if="documentsCheck(`train_doc${index}`)">
                        <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                        <label class="col-md-4">Manuals</label>
                           <div v-if="product.training_doc != null" style="margin-top: -4%; margin-bottom: 2%">
                               <div v-for="i in product.training_doc.split(',')" :key="i" style="margin-left: 34%;">
                                    <a style="font-size: 13px" href="#" @click="openReport(i)">{{i.substring(19)}}</a>
                               </div>
                           </div>
                          
                        
                        <div style="margin-left: 34%; margin-top: -4%">
                            <input  v-if="product.training_doc == null" type="file" multiple :ref="`training_doc${index}`" accept=".pdf" @change="handleFileUpload(`training_doc${index}`, product.id)"> <!-- @change="handleFileUpload()"-->
                            <div>
                                <input type="checkbox" style="width:50px; margin-top: 4%; margin-left: -4%" @change="toggleFile(product, 'training_doc')" v-model="product.toggle_training_doc"> <span style="font-size: 13px" >Change</span>
                            </div>
                            
                        </div>
                    </div>
                   


                    <div class="form-group" v-if="documentsCheck(`other${index}`)">
                         <hr style="height:1px;border-width:0;color:gray;background-color:gray">
                        <label class="col-md-4">Other</label>
                            <div v-if="product.other != null" style="margin-top: -4%; margin-bottom: 2%">
                               <div v-for="i in product.other.split(',')" :key="i" style="margin-left: 34%;">
                                    <a style="font-size: 13px" href="#" @click="openReport(i)">{{i.substring(19)}}</a>
                               </div>
                            </div>
                        
                        <div style="margin-left: 34%; margin-top: -4%">
                            <input  v-if="product.other == null" type="file" multiple :ref="`other${index}`" accept=".pdf" @change="handleFileUpload(`other${index}`, product.id)"> <!-- @change="handleFileUpload()"-->
                            <div>
                                <input type="checkbox" style="width:50px; margin-top: 4%; margin-left: -4%" @change="toggleFile(product, 'other')" v-model="product.toggle_other"> <span style="font-size: 13px" >Change</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-4">Liable Entity</label>
                        <input type="radio" value="Supplier" name="entity" v-model="product.liable_entity" @change="product.liable = ''; liableChange(product.liable_entity)"> <!--value="train_reg"--v-model="documents"-->
                        <label class="col-md-2" style="font-weight: normal">Supplier</label>
                        <input type="radio" value="Site" name="entity" v-model="product.liable_entity" @change="product.liable = ''; liableChange(product.liable_entity)"> <!--value="train_doc"-->
                        <label class="col-md-2" style="font-weight: normal">Site</label>
                        <input type="radio" value="Regent" name="entity" v-model="product.liable_entity" @change="product.liable = ''; liableChange(product.liable_entity)"> <!--value="other"-->
                        <label class="col-md-2" style="font-weight: normal">Regent</label>
                    </div>

                    <div class="form-group" v-if="product.liable_entity =='Supplier'">
                        <label class="col-lg-4">Supplier</label>
                        <!--select type="text" v-model="product.liable">
                            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.supplier">{{supplier.supplier}}</option>
                        </select-->
                        <model-list-select 
                            :list="suppliers"
                            v-model="product.liable"
                            option-value="supplier"
                            option-text="supplier"
                            placeholder="Search suppliers"
                            style="width: 62%; margin-left:34%; margin-top:-5%; height:25.5"
                            > <!--@input="validateProd('check')"-->
                        </model-list-select>
                    </div>
                    <div class="form-group" v-if="product.liable_entity =='Site'">
                        <label class="col-lg-4">Contractor/Client</label>
                        <input type="text" v-model="product.liable">
                    </div>
                    <div class="form-group" v-if="product.liable_entity =='Regent'">
                        <label class="col-lg-4">Department</label>
                        <select style="height:25.5px" v-model="product.liable">
                            <option value="" selected disabled>Please select</option>
                            <option value="Design">Design</option>
                            <option value="Controls">Controls</option>
                            <option value="Production">Production</option>
                            <option value="Design">Purchasing</option>
                            <option value="Foundry">Foundry</option>
                            <option value="Sales">Sales</option>
                            <option value="Stores">Stores</option>
                            <option value="Technical">Technical</option>
                            <option value="Recieving">Recieving</option>
                    </select>
                    </div>

                </div>
                </div>
                </form>
                <center>
                    <b-button  style="margin-top: 1%; margin-bottom: 1%"  @click="saveNCR()">Save</b-button>
                </center>
            </b-card-text>
            <b-card-text v-else>
                <b-button style="margin-left:15%; margin-top:1%" @click="editProd(product)">Add Product</b-button>
            </b-card-text>
        </b-tab>
        </b-tabs>
    </b-card>
    </div>

    
    

   

    <div v-if="comments" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:50%">
        <div >
        <span class="close" @click="comments = false">&times;</span>
          
         
            <div class="form-group" style="width: 67%">
                <label class="col-lg-3" style="margin-top:5%">Notes</label>
                
                <textarea v-model="ncr.maint_note" style="width: 100%; max-width: 100%; margin-left: 38%; margin-top:-5%" rows="10"></textarea>
         
               
            </div>
           <div>
               <label class="col-lg-3">Mounting Height</label>
                <input type="text" v-model="ncr.access" style="width:67%">

           </div>
         
            <center>
                <b-button style="margin:1% 0 1.5% 0" @click="saveNCR()">SAVE</b-button>
            </center>
           
         </div>
    </div>
    </div>

     <div v-if="edit" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:60%;"> <!--style="width:50%; height:40%"-->
        <div class="close" @click="closeEdit()">&times;</div>
        <table class="table-bordered" style="margin-left:1%">
           <tbody>
               <tr>
                   <td><label>Name</label></td>
                    <td colspan="3">
                        <model-list-select 
                            :list="fittings"
                            v-model="edit_prod.product_name"
                            option-value="FittingName"
                            option-text="FittingName"
                            placeholder="Search Products"
                            style="width:100%;"
                            > 
                        </model-list-select>
                    </td>
                    <td><input type="text" placeholder="Wattage"  style="width:80px" v-model="edit_prod.wattage"> W
                    <input type="text" placeholder="Qty" style="width:50px; margin-left: 10%"  v-model="edit_prod.qty"></td>
                    
               </tr>
               <tr>
                   <td>Length</td>
                   <td><input type="text" placeholder="Length"  style="width:80px" v-model="edit_prod.length"> mm</td>
                   <td></td>
                   <td>Mounting</td>
                   <td><select v-model="edit_prod.mounting" style="width:60%; height:30px">
                                <option value="" selected disabled>Mounting</option>
                                <option value="P">Pendant</option>
                                <option value="R">Recessed</option>
                                <option value="SP">Suspended</option>
                                <option value="SF">Surface</option>
                                <option value="TR">Track</option>
                                <option value="W">Wall</option>
                        </select>
                    </td>
               </tr>
               <tr>
                   <td>Dimming</td>
                   <td><select style="width:60%; height:30px" v-model="edit_prod.dimming">
                                <option value="" selected>Non-DIM</option>
                                <option value="DALI">DALI</option>
                                <option value="Push-DIM">Push-DIM</option>
                                <option value="0-10V">0-10V</option>
                                <option value="DMX">DMX</option>
                        </select>
                    </td>
                    <td></td>
                    <td>BB</td>
                    <td><input type="checkbox" style="vertical-align:middle;" v-model="edit_prod.bb"></td>
               </tr>
               <tr v-for="(img,index) in editImages()" :key="img">
                   
                    <td>Image {{index+1}}: </td>
                    <td colspan="3">{{img}}</td>
                    <td><b-button @click="deleteImage(index)">DEL</b-button></td>
                     
               </tr>

           </tbody>
        </table>
       
        <!--div>
            <span class="close" @click="edit = false">&times;</span>
            <div class="form-group">
                <label class="col-lg-3">Name</label>
                <model-list-select 
                    :list="fittings"
                    v-model="edit_prod.product_name"
                    option-value="FittingName"
                    option-text="FittingName"
                    placeholder="Search Products"
                    style="width:60%;"
                    > 
                </model-list-select>
            </div>
            <div class="form-group">
                <label class="col-lg-3">Wattage</label>
                <input type="text" placeholder="Wattage"  style="width:80px" v-model="edit_prod.wattage">
            </div>
            
        </div-->
    
        <center>
            <b-button style="margin:1% 0 1.5% 0" @click="saveNCR()">SAVE</b-button>
        </center>
           
        
    </div>
    </div>

    <vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <ul>
        <li v-on:click.prevent="editProd(data)"><a>Edit</a></li>
        <li v-on:click.prevent="deleteProd(data)"><a>Delete</a></li>
      </ul>
        
   </vue-context>
        
  
</div>
</template>

<script>

//import x from '../../../../tech-system-backend/uploads'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { component as Viewer } from 'v-viewer';
import 'viewerjs/dist/viewer.css'
import { confirmed, image } from 'vee-validate/dist/rules';
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import VueContext from 'vue-context';
import {mapGetters} from 'vuex'


export default {
   middleware: ['auth'], //auth //auth-guard
   props: ['ncrObj', 'fittings', 'tabIndex'],
   components: { Viewer, Multiselect, ModelListSelect, VueContext },
   data() {
       return {
           comments: false,
           show_images: false,
           ncr: {},
           show: false,
           oldNCR: {},
           changes: {},
           product_obj: {},
           documents: [],
           users: [{id: 1, name: 'Alan', email: 'alan@wahl.co.za'},
                    {id: 2, name: 'Chetan', email: 'chetan@regentlight.co.za'},
                    {id: 3, name: 'Design', email: 'design@regentlight.co.za'},
                    {id: 4, name: 'Grant', email: 'grant@regentlight.co.za'},
                    {id: 5, name: 'Hoxani', email: 'maintenance@regentlight.co.za'},
                    {id: 6, name: 'Kenneth', email: 'kenneth@regentlight.co.za'},
                    {id: 7, name: 'Leeanne', email: 'Leeanne@regentlight.co.za'},
                    {id: 8, name: 'Laurens', email: ''},
                    {id: 9, name: 'Roland', email: ''},
                    {id: 10, name: 'TestLab', email: 'testlab@wahl.co.za'},
                    {id: 11, name: 'Themba', email: 'themba@regentlight.co.za'},
                    {id: 12, name: 'Theo', email: 'theo@regentlight.co.za'},
                    {id: 13, name: 'Thomas', email: 'Thomas@wahl.co.za'},
                    {id: 14, name: 'Wayne', email: 'wayne.j@regentlight.co.za'},
                    {id: 15, name: 'Welcome', email: 'welcome.m@regentlight.co.za'},
                    {id: 16, name: 'kentest', email: 'nk.fuze@gmail.com'}],
          images: [],
          path: '',
          view_images: false,
          slide: 0,
          sliding: null,
          products: [],
          oldProducts: [],
          components: [],
          components2: [], //JOB card components
          component: {
              component: '',
              qty: '',
              supplier: ''
          },
          oldComponents: [],
          prod_changes: [],
          comp_changes: [],
          add_product: false,
          del_comps: [],
          new_comps: [],
          files: [],
          change_files: [],
          saved: false,
          dismissSecs: 2,
          dismissCountDown: 0,
          options: [{name:'Faulty Driver'},{name:'Faulty PCB'},{name:'Water/Moister Ingress'},{name:'Incorrect Wiring'},{name:'Overheating'},{name:'Dimming issue'},{name:'Incorrect Spec'},{name:'Poor Quality'},{name:'Loose Connection'},{name:'Other'}], 
          value: [],
          pics: [],
          suppliers: [],
          sales_reps: [],
          edit: false,
          edit_prod: {},
          new_product: {},
          prod_names: '',
          filtered_data: []
          
       }
   },

   computed: {
       ...mapGetters({
           isLoggedIn: 'user/isLoggedIn',
           isAdmin: 'user/isAdmin'
       })
    },

   beforeRouteLeave (to, from, next) {
        
        if(this.checkChanges()) {
            if(confirm("Exit without saving?")) {
                console.log("Do nothing")
                next()
            }
            else {
                next(false)
                console.log("Keep alive")
            }
        }
        else {
            window.sessionStorage.filtered_data = []
            next()
        }
   },

   methods: {

    closeEdit() {
        if(this.checkChanges()) {
            if(confirm("Close without saving?")) {
                this.edit = false
            }
        }
        else {
            this.edit = false
        }
        
    },
    
    checkAssessed() {
        let errors = 0
        let products = [...this.products]
        products.pop()
        //console.log('products = ', products)
        if(this.ncr.tech_closed) {
            products.forEach((p) => {
                if(p.findings == null) {
                    errors += 1
                    this.ncr.tech_closed = this.oldNCR.tech_closed//0
                    alert(`Please fill in FINDINGS for ${p.product_name}`)
                    return
                }
                if(p.corrective_action == null) {
                    errors += 1
                    this.ncr.tech_closed = this.oldNCR.tech_closed//0
                    alert(`Please fill in CORRECTIVE ACTION for ${p.product_name}`)
                    return
                }
                if(p.preventative_action == null) {
                    this.ncr.tech_closed = this.oldNCR.tech_closed//0
                    errors += 1
                    alert(`Please fill in PREVENTATIVE ACTION for ${p.product_name} \nIf not applicable write N/A`)
                    return
                }
            })
        }
       //console.log('errors = ', errors)
       if(errors==0) {
           this.ncr.tech_closed = true
           
           //alert("Please fill all fields before ticking assess")
       }
       else {
           this.ncr.tech_closed = this.oldNCR.tech_closed//0
       }
    },

     checkClosed() {
        let errors = 0
        let products = [...this.products]
        products.pop()
        //console.log('products = ', products)
        if(this.ncr.status) {
            products.forEach((p) => {
                if(p.findings == null) {
                    errors += 1
                    this.ncr.status = this.oldNCR.status//0
                    alert(`Please fill in FINDINGS for ${p.product_name}`)
                    return
                }
                if(p.corrective_action == null) {
                    errors += 1
                    this.ncr.status = this.oldNCR.status//0
                    alert(`Please fill in CORRECTIVE ACTION for ${p.product_name}`)
                    return
                }
                if(p.preventative_action == null) {
                    this.ncr.status = this.oldNCR.status//0
                    errors += 1
                    alert(`Please fill in PREVENTATIVE ACTION for ${p.product_name} \nIf not applicable write N/A`)
                    return
                }
            })
        }
       //console.log('errors = ', errors)
       if(errors==0) {
           this.ncr.status = 'closed'
           
           //alert("Please fill all fields before ticking assess")
       }
       else {
           this.ncr.status = this.oldNCR.status//0
       }
    },

    deleteDoc(index) {
        product.report.split(',')
    },

    deleteImage(index) {
        if(confirm(`Are you sure you want to delete image ${index+1}?`)) {
            let new_images = this.edit_prod.images.split(",")
            console.log('new_images = ', new_images)
            new_images.splice(index, 1)
            console.log('new_images = ', new_images)
            let image_string = ''
            for(let i = 0; i<new_images.length; i++) {
                if(i == 0) [
                    image_string = new_images[0]
                ]
                else {
                    image_string = image_string + ',' + new_images[i]
                }
            
            }
            console.log('new_images = ', image_string)
            if(image_string.length == 0) {
                image_string = null
            }
            this.edit_prod.images = image_string
        }
        
    },

    editImages() {
        if(this.edit_prod.images != null) {  
            return this.edit_prod.images.split(",")
        }
        else {
             return []
        }
        
    },

    async loadJobCard() {
        if(this.ncr.so.trim().length > 0) {
            let job_card = await this.$axios.$post('/job_card', {so: this.ncr.so.trim().toUpperCase()})
            let components = job_card.filter(c => c.component != 'COS - Maintenance Projects - Regent' && c.component != 'Labour - Regent')
            let maintenance = job_card.filter(c => c.component == 'COS - Maintenance Projects - Regent' || c.component == 'Labour - Regent')
            //console.log(maintenance)
            let comp_cost = 0
            let m_cost = 0
            components.forEach((c) => {
                comp_cost += c.total_cost
                c.ncr_no = this.ncr.ncr_no
                c.product = this.prod_names//this.product_obj.product_name //Gives component a product name
            })
            this.components = this.oldComponents.concat(components)
            maintenance.forEach((m) => {
                m_cost += m.total_cost
            })
            console.log(comp_cost)
            this.ncr.value = m_cost
            this.ncr.comp_value = comp_cost
            //return { m_cost: m_cost, comp_cost: comp_cost }
        }
    },

    async deleteProd(product) {
        if(confirm(`Are you sure you want to delete ${product.product_name}?`)) {
            await this.$axios.$post('/delete_product', product)
            await this.loadNCR()
        }
    },

    editProd(product) {
        
        this.edit_prod = product
        console.log(product)
        this.edit = true
    },

    liableChange(entity) {
        console.log('entity = ', entity)
    },

    

    picCount(id) {
        let pics = this.pics.filter(p => p.id == id)
        if(pics.length == 1) {
            return pics[0].name
        }
        if(pics.length>1) {
            return pics.length
        }
    },
    
    chooseFile(index) {
        document.getElementById(`upload${index}`).click()
    },

    changeTab(product, index) {
        this.value = []
        this.product_obj = product
        if(this.product_obj.category != null) {
            let cat_arr = this.product_obj.category.split(',')
            for(let i = 0; i<cat_arr.length; i++) {

                this.value.push({name: cat_arr[i]})
            }
        }
        //this.tabIndex = index
        this.$emit('changeTabIndex', index)
        
    },

    addTag(index) {
        console.log('index = ', index)
        let cat = null
        if(this.value.length>0) {
            cat = this.value[0].name
            for(let i = 1; i<this.value.length; i++) {
                cat = cat + ', ' + this.value[i].name
            }
        }
        this.products[index].category = cat
        //this.product_obj.category = cat
        
    },

   
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      },

       toggleFile2(product, key, index) {
           console.log('toggle_key = ', `toggle_${key}`)
           if(product[`toggle_${key}`][index]) {
               let arr = product[key].split(',')
               arr[index] = 'change'
               //arr.splice(index, 1)
               let file = ''
               for(let i = 0; i<arr.length; i++) {
                   if(i == 0) {
                       file = arr[0]
                   }
                   else {
                       file = file + ',' + arr[i]
                   }
               }
               product[key] = file
           }
           else {
                //console.log()
                product[key] = this.oldProducts.find(p => p.product_name == product.product_name)[key]
           }
           this.$forceUpdate()
       },

       toggleFile(product, key) {
           console.log('toggle_key = ', `toggle_${key}`)
           if(product[`toggle_${key}`]) {
               product[key] = null
           }
           else {
                product[key] = this.oldProducts.find(p => p.product_name == product.product_name)[key]
           }
           this.$forceUpdate()
       },

       openReport(path) {
            //uploads/file-1618943984147-AQUA%20FITTING%20THERMAL%20REPORT.docx
            window.open('http://localhost:2000/uploads/'+path);  //http://it-foundry:3001/uploads/
        },

       printRefs() {
           //console.log(this.$refs)
           //console.log('this.files = ', this.files)
           for(let i = 0; i<this.files.length; i++) {
               console.log(this.files[i].name)
           }
       },

       handleFileUpload(ref, id) {
           console.log('this.$refs', this.$refs)
           console.log('ref = ', ref)
           console.log('this.$refs[ref][0].files.length = ', this.$refs[ref][0].files.length)
           for(let i = 0; i<this.$refs[ref][0].files.length; i++) {
                this.$refs[ref][0].files[i].ref = ref+`${i}`
                console.log('ref+i = ', ref+`${i}`)
                this.$refs[ref][0].files[i].id = id
                let exist = this.files.find(f => f.ref == this.$refs[ref][0].files[i].ref) //
                if(exist == undefined) {
                    this.files.push(this.$refs[ref][0].files[i]); //Add new file to array
                }
                else {
                    let index = this.files.findIndex(file => file.ref === ref+`${i}`)
                    this.files[index] = this.$refs[ref][0].files[i] //Replace existing with new upload
                }
           }
           console.log('this.files = ', this.files)
           /*this.$refs[ref][0].files[0].ref = ref
           this.$refs[ref][0].files[0].id = id
           let exist = this.files.find(f => f.ref == this.$refs[ref][0].files[0].ref)
           if(exist == undefined) {
            this.files.push(this.$refs[ref][0].files[0]);
           }
           else {
               let index = this.files.findIndex(i => i.ref === ref)
               this.files[index] = this.$refs[ref][0].files[0]
           }*/
           
        },

       removeComp(id) {
          
           let index = this.components.findIndex(c => c.id == id)
           let comp = this.oldComponents.find(c => c.id == id)
           console.log('comp = ', comp)
           //console.log('index = ', index)
           if(comp == undefined) {
               this.components.splice(index,1)
           }
           else {
               if(confirm(`Are you sure you want to delete ${comp.component}?`)) {
                   this.del_comps.push(comp)
                   this.components.splice(index,1)
               }
           }

       },

       addProduct(product) {
           
           this.component.ncr_no = this.ncr.ncr_no
           this.component.product = product.product_name
           if('components' in product) {    
               this.components.push(this.component)
           }
           else {
               this.components.push(this.component)
           }
           //this.$forceUpdate()
           this.component = {}
       },

       getComps(product) {
          let comps = this.components.filter(c => c.product.includes(product))
          return comps
       },

       showImages(product) {
           this.show_images = true
           let images = []
           if(product.images != null) {
                images = product.images.split(',')
            }
            else {
                images = ['No_Image_Available.jpg']
            }
            for(let i = 0; i<images.length; i++) {
                images[i] = `http://localhost:2000/uploads/`+images[i]
            }
            
            this.$viewerApi({
            images: images,
            })
        },

        onSlideStart(slide) {
            this.sliding = true
        },
        onSlideEnd(slide) {
            this.sliding = false
        },

       documentsCheck(doc) {
         let found = this.documents.find(element => element == doc)
         //console.log('found = ', found)
         return found
       },
       
      checkChanges() {
        this.changes = {}
        let changed = false

        this.prod_changes = []
        for(let i = 0; i<this.oldProducts.length; i++) {
            //delete this.products[i]['email']
            let obj = {}
            let push = false
            this.product
            for(var key in this.products[i]) {
               if(key != 'report' && key != 'toggle_report' && key != 'training_reg' && key != 'toggle_training_reg' && key != 'training_doc' && key != 'toggle_training_doc' && key != 'other' && key != 'toggle_other') {
                    if(this.products[i][key] != this.oldProducts[i][key]) {
                        //console.log('key = ', key)
                        changed = true
                        push = true
                        obj[key] = this.products[i][key]
                        if(key == 'category' || key == 'failure') {
                            if(this.ncr.maint_captured == null) {
                                this.changes['maint_captured'] = true
                                this.changes['maint_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')
                            }
                        }
                        //console.log(`${key} has changed from ${this.oldProducts[i][key]} to ${this.products[i][key]}`)
                        //this.prod_changes.push(obj)
                    }
               }
            }
            if(push) {
                obj.id = this.products[i].id
                this.prod_changes.push(obj)
            }
        }

           
        for(let i = this.oldProducts.length; i<this.products.length; i++) {
            this.new_product = this.products[i]
            console.log('new_product = ', this.new_product)
        }
        if(this.new_product.product_name != '+') {
                changed = true
        }
        




        for(var key in this.ncr) { 
                
                if(this.ncr[key] != this.oldNCR[key]) {
                
                    if(key != 'responsible') {
                        //console.log(`${key} changed from ${this.oldNCR[key]} to ${this.ncr[key]}`)
                        this.changes[key] = this.ncr[key]

                        if(key == 'maint_captured' && this.ncr.maint_captured) {

                            this.changes['maint_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')
                        }

                        if(key == 'tech_closed' && this.ncr.tech_closed) {
                            if(this.ncr.invoice_no != null) {
                                if(this.ncr.invoice_no.length>0) {
                                    this.changes['status'] = 'assessed+inv'
                                }
                                else {
                                     this.changes['status'] = 'assessed'
                                }
                            }
                            else {
                                 this.changes['status'] = 'assessed'
                            }
                        
                            this.changes['tech_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')
                            this.changes['assessed_by'] = this.$auth.user.name
                            this.changes['ncr_no'] = this.ncr.ncr_no
                        }
                        if(key == 'status' && this.ncr.status == 'closed') {
                            if(this.ncr.invoice_no != null) {
                                if(this.ncr.invoice_no.length>0) {
                                    this.changes['status'] = 'closed+inv'   
                                }
                                else {
                                    this.changes['status'] = 'closed'   
                                }
                            }
                            else {
                                 this.changes['status'] = 'closed'
                            }
                            this.changes['close_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')
                            this.changes['closed_by'] = this.$auth.user.name
                        }

                        if(key == 'tech_closed' && !this.ncr.tech_closed) {
                            this.changes['status'] = 'open'
                        }
                       
                        
                        if(key == 'invoiced' && this.ncr.invoiced) {
                            if(this.ncr.invoice_no == null) {
                                alert('Please enter invoice number')
                                return
                            }
                            else if(this.ncr.invoice_no.length == 0) {
                                alert('Please enter invoice number')
                                return
                            }
                        }
                        if(key == 'invoice_no' && this.ncr.invoice_no) {
                            this.changes['status'] = `${this.ncr.status}+inv`
                            this.changes['inv_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')
                        }
                        if(key == 'credited' && this.ncr.credited) {
                            if(this.ncr.credit_no == null) {
                                alert('Please enter credit number')
                                return
                            }
                            else if(this.ncr.credit_no.length == 0) {
                                alert('Please enter credit number')
                                return
                            }
                        }
                        changed = true
                    }
                    else {
                        if(this.ncr.responsible != null) {
                            let length = this.ncr.responsible.length
                            if(this.ncr.responsible.length < this.oldNCR.responsible.length) {
                                length = this.oldNCR.responsible.length
                            }
                            for(let i = 0; i<length; i++) {
                                if(this.ncr.responsible[i] != this.oldNCR.responsible[i]) {
                                    //console.log(`responsibilty changed`)
                                    //this.changes['responsibility'] = 
                                    //this.changes.push(`${key} = ${this.ncr[key]}`)
                                    this.changes['responsible'] = this.ncr.responsible
                                    console.log('updated changes with responsible = ', this.changes)
                                    changed = true
                                }  
                            }
                        }
                        else {

                        }
                        
                    } 
                    
                } 
                      
        }
        
        this.comp_changes = []
        this.new_comps = this.components.filter(o1 => !this.oldComponents.some(o2 => o1.id === o2.id))
        //let del_comps = this.components.filter(o1 => this.oldComponents.some(o2 => o1.id === o2.id))
        console.log('new_comps = ', this.new_comps)
        console.log('del_comps = ', this.del_comps)
        let obj = {}
        let push = false
        for(let i = 0; i<this.components.length; i++) {
            let old_comp = this.oldComponents.find(c => c.id == this.components[i].id)
            if(old_comp) {
                for(var key in this.components[i]) {
        
                    if(this.components[i][key] != old_comp[key]) {
                        changed = true
                        push = true
                        obj[key] = this.components[i][key]
                        console.log('obj = ', obj)
                    }

                }
                if(push) {
                    obj.id = this.components[i].id
                    this.comp_changes.push(obj)
                }
            }
            else {
                changed = true
                console.log('New component = ', this.components[i])  
            }
          
        }

            if(this.del_comps.length>0) {
            changed = true
        }

        if(this.files.length>0) {
            changed = true
        }
        if(this.pics.length>0) {
            changed = true
        }
            console.log('this.changes = ', this.changes)
            console.log('this.comp_changes = ', this.comp_changes)
            console.log('this.prod_changes = ', this.prod_changes)
            return changed
       },

       handleImageUpload(id, index, existing_images) {
        console.log(this.$refs)
        console.log(this.$refs[`pic${index}`])
        console.log(this.$refs[`pic${index}`][0])
        console.log(this.$refs[`pic${index}`][0].files)
        //product.pics = []
        for( var i = 0; i < this.$refs[`pic${index}`][0].files.length; i++ ){
            this.$refs[`pic${index}`][0].files[i].id = id
            this.$refs[`pic${index}`][0].files[i].existing_images = existing_images
            this.pics.push(this.$refs[`pic${index}`][0].files[i])
            //product.pics[i] = this.$refs[`pic${index}`][0].files[i]
            //console.log('loop = ', this.$refs[`pic${index}`][0].files[i])
               
        }
        console.log('pics = ', this.pics)
        this.picCount(id)
        },

       async saveNCR() {
           if(this.checkChanges()) {
               let length = Object.keys(this.changes).length
               if(length>0) {
                    this.changes.id = this.ncr.id 
               }
               if('responsible' in this.changes) {
                    let new_res = this.changes.responsible.filter(val => !this.oldNCR.responsible.includes(val))
                    console.log('new_res = ', new_res)
                    if(new_res.length > 0) {
                        let email = this.users.find(u => u.name == new_res[0]).email
                        for(let i = 1; i<new_res.length; i++) {
                            email = email + ', ' + this.users.find(u => u.name == new_res[i]).email
                        }
                        console.log('email = ', email)
                        this.changes['email'] = email
                        this.changes['person'] = this.$auth.user.username
                        this.changes['ncr_no'] = this.ncr.ncr_no
                    }
                   
                    let responsible = this.changes.responsible[0]
                    for(let i = 1; i<this.changes.responsible.length; i++) {
            
                        responsible = responsible + ', ' + this.changes.responsible[i]
                    }

                    this.changes.responsible = responsible
                    console.log('this.changes = ', this.changes)
                    //console.log('responsible to be sent to database = ', this.changes.responsible)
               }
               await this.$axios.$post('/update_ncr', {ncr_changes: JSON.stringify(this.changes), prod_changes: JSON.stringify(this.prod_changes), comp_changes: JSON.stringify(this.comp_changes)})
               
               console.log('new_product = ', this.new_product)
               if(this.new_product.product_name != '+') {
                   this.new_product.ncr_no = this.ncr.ncr_no
                   console.log('adding product = ', this.new_product)
                   await this.$axios.$post('/add_ncrproduct', this.new_product)
               }

               this.new_product = {}
               
                for(let i = 0; i<this.new_comps.length; i++) {
                    console.log(`posting new component ${this.new_comps[i].component}`)
                    await this.$axios.$post('/add_component', this.new_comps[i])
                }

                for(let i = 0; i<this.del_comps.length; i++) {
                    console.log(`Deleting component ${this.del_comps[i].component}`)
                    await this.$axios.$post('/delete_component', {id: this.del_comps[i].id})
                }
                ///////////////////////////////////////////////////////////////////////////////////////////
                let formData = new FormData();
                let append = false
                for(let i = 0; i<this.files.length; i++) { //if there are files
                    append = true
                    let ref = this.files[i].ref.replace(/[0-9]/g, ''); //removing numbers on ref (report, training_doc, other)
                    formData.append("file", this.files[i])
                    formData.append('id', this.files[i].id) //product id
                    formData.append('ref', ref) //type of report
                }
                if(append) {
                    if(this.ncr.sales_rep != null) {
                        let name = this.ncr.sales_rep.split(" ")[0]
                        let surname = this.ncr.sales_rep.split(" ")[1]
                        console.log('name = ', name)
                        console.log('surname = ', surname)
                        let email = this.sales_reps.find(r => r.name.trim() == name.trim() && r.surname.trim() == surname.trim())
                        if(email != undefined) {
                            email = email.email
                            formData.append("email", email)
                            //console.log('email = ', email)
                        }
                        else {
                            console.log('Email not found')
                        }
                        //console.log('email = ', email)
                        formData.append("name", name)
                        formData.append("product", this.product_obj.product_name)
                        formData.append("site", this.ncr.project)
                    }
                    
                    await this.$axios.$post('/ncr_upload', formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                                })
                }

               this.files = []
               /////////////////////////////////////////////////////////////////////////////////////////
               let picData = new FormData()
               let upload = false
               for(let j = 0; j<this.pics.length; j++) {
                   upload = true
                   picData.append('image', this.pics[j])
                   picData.append('id', this.pics[j].id)
                   picData.append('existing_images', this.product_obj.images)
               }
               if(upload) {
                   await this.$axios.$post('/pics_upload', picData, {
                       headers: {
                           "Content-Type": "multipart/form-data"
                       }
                   })
               }
               this.pics = []
        
               await this.loadNCR()

               this.$emit('reloadNCRs')
               this.comments = false
               this.edit = false

               this.showAlert()
           }  
       },

        async loadNCR() {
            this.products = []
            this.components = []
            this.prod_names = ''
            let oldNCR = await this.$axios.$get(`/ncr/${this.$route.params.index}`)
            this.oldNCR = oldNCR[0]
            this.oldProducts = await this.$axios.$get(`/ncr_products/${this.$route.params.index}`)
            this.oldComponents = await this.$axios.$get(`/ncr_components/${this.$route.params.index}`)

            for(let i = 0; i<this.oldProducts.length; i++) {
                this.products[i] = Object.assign({}, this.oldProducts[i])
                if(i == 0) {
                    this.prod_names = this.products[i].product_name
                }
                else /*(i < this.oldProducts.length-2)*/ {
                    this.prod_names = this.prod_names+','+this.products[i].product_name
                }
            
            }
            this.products.push({product_name: "+", mounting: "", dimming: "", bb: false,  toggle_report: false, toggle_training_reg: false, toggle_training_doc: false, toggle_training_reg: false, toggle_other: false})
            this.components = JSON.parse(JSON.stringify(this.oldComponents))
            /*for(let i = 0; i<this.oldComponents.length; i++) {
                this.components[i] = Object.assign({}, this.oldComponents[i])
            }*/

            for(let i = 0; i<this.oldProducts.length; i++) {
                this.products[i].toggle_report = false
                this.oldProducts[i].toggle_report = false
                this.products[i].toggle_training_reg = false
                this.oldProducts[i].toggle_training_reg = false
                this.products[i].toggle_training_doc = false
                this.oldProducts[i].toggle_training_doc = false
                this.products[i].toggle_other = false
                this.oldProducts[i].toggle_other = false
                if(this.products[i].training_reg != null) {
                    this.documents.push(`train_reg${i}`)
                }
                if(this.products[i].training_doc != null) {
                    this.documents.push(`train_doc${i}`)
                }
                if(this.products[i].other != null) {
                    this.documents.push(`other${i}`)
                }

                /*if(this.products[i].liable_entity == null) {
                    console.log('liable entity is null')
                    this.products[i].liable_entity = 'Other'
                }*/
        }


        this.ncr = Object.assign({}, this.oldNCR)
            if(this.ncr.responsible != null) {
                this.ncr.responsible = this.ncr.responsible.split(',')
                this.oldNCR.responsible = this.oldNCR.responsible.split(',')
                for(let i = 0; i<this.ncr.responsible.length; i++) {
                    this.ncr.responsible[i] = this.ncr.responsible[i].trim()
                    this.oldNCR.responsible[i] = this.oldNCR.responsible[i].trim()
                }
            }
            else {
                this.ncr.responsible = []
            }
            if(this.ncr.images != null) {
                this.images = this.ncr.images.split(',')
            }
            else {
                this.images = ['No_Image_Available.jpg']
            }
            for(let i = 0; i<this.images.length; i++) {
                this.images[i] = `http://localhost:2000/uploads/`+this.images[i]
            }
        },

        
        async nextNCR2(dir, ncr_num) {
            let index = this.filtered_data.findIndex(x => x.ncr_no == ncr_num)
            
            let ncr_no = ''
            //let no = Number(this.$route.params.index.replace( /^\D+/g, ''))
            if(dir == 'next') {
                let ncr = this.filtered_data[index+1]
                if(ncr != undefined) {
                    ncr_no = ncr.ncr_no
                }
               
            }
            if(dir == 'back') {
                let ncr = this.filtered_data[index-1]
                if(ncr != undefined) {
                    ncr_no = ncr.ncr_no
                }
              
            }
            //ncr_no = 'NCR'+no
            this.$route.params.index = ncr_no
            await this.loadNCR()
            this.value = []
            if(this.products.length>0) {
                this.product_obj = this.products[0]
            }
            if(this.product_obj.category != null) {
                let cat_arr = this.product_obj.category.split(',')
                for(let i = 0; i<cat_arr.length; i++) {

                    this.value.push({name: cat_arr[i]})
                }
            }

        },


   },



   created: async function() {
       await this.loadNCR()
       if(this.products.length>0) {
           this.product_obj = this.products[0]
       }
       if(this.product_obj.category != null) {
           let cat_arr = this.product_obj.category.split(',')
            for(let i = 0; i<cat_arr.length; i++) {

                this.value.push({name: cat_arr[i]})
            }
        }

        this.suppliers = await this.$axios.$get('/suppliers')
        this.sales_reps = await this.$axios.$get('/sales_reps')
       
   },

   mounted() {
        if(window.sessionStorage.filtered_data) {
            this.filtered_data = JSON.parse(window.sessionStorage.filtered_data)
        }
        
   }
}
</script>

<style scoped>

 
#card-header-color {
   
    background-color: rgb(241, 12, 12) !important;
    
  }


td {
    padding:0.5%;
}

#date {
    font-size: 14px;
}

#upload {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}

.multiselect {
    width: 62.5%;
    margin: -7% 0 0 34%;
    border: 1px solid #0a0a0a;
    /*border-radius: 10px;*/
}

.multiselect__tags {
    width: 50%;
   
}

.alert-fixed {
    position:fixed; 
    top: 50px; 
    left: 0px; 
    width: 100%;
    z-index:9999; 
    border-radius:0px
}

.dropdown-item {
  margin-left: 0%;
  padding: 0% 2% 1% 3%;
  font-size: 14px;
}

.dropdown-item :hover {
  background-color: grey;
}

.dropdown-menu {
    width: 52%
}

 .carousel-inner img {
    width: 100%;
    height: 100%;
    background-color: rgb(34 31 31); 
  }


.carousel-control-prev, .carousel-control-next {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 7%;
    color: #fff;
    text-align: center;
    opacity: 0.5;
    transition: opacity 0.15s ease;
}

.w-100 {
    width: 70% !important;
    align-content: center;
    background-color: rgb(34 31 31); 
}

.img {
    vertical-align: middle;
    margin-left: 25%;
    border-style: none;
    width: 100%; /*650px;*/
    height: 100%; /*660px;*/
    background-color: rgba(255, 255, 255, 0.466); 
}

.carousel-inner {
    background-color: rgb(171, 171, 171)
}

element.style {
    background-color: rgb(34 31 31); 
}

.centered {
    left: 50%;
    margin-left: 62%;
    margin-top: 15%;
    transform: translateX(-50%);
}

</style>

<style scoped>

input[type="text"]{
    width: 63%;
    font-size:small
}

textarea {
    font-size:small
}

select {
    width: 63%;
    font-size:small
}

label {
    font-weight: bold;
    font-size:small
}

h6 {
    margin-left:1.5%;
    text-decoration-color: rgb(179, 172, 172);
}

/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
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
  background-color: rgb(241, 241, 241);
  margin: 10% auto; /* 15% from the top and centered */
  padding: 0px;
  border: 1px solid #888;
  width: 90%; /* Could be more or less, depending on screen size */
  /*height: 50%;*/
  word-wrap: break-word;
}

.close {
  color: black;
  font-size: 45px;
  font-weight: bold;
  margin-left: auto;
  margin-right: 1%;
}


.close:hover,
.close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}

.delete {
    text-align:center;
    font-size:20px; padding: 0;
    font-weight: bold;
}

.delete:hover,
.delete:focus {
    color: red
}


</style>