<template>
<div>
    <div v-if="!wait">
    <span class="close" @click="$emit('closeLog')">&times;</span>
    <form-wizard title="" subtitle=""  ref="wizard" @on-complete="onComplete">
        
        <tab-content title="NCR Info" :beforeChange="validateInfo"> <!--@nextStep="validateStep" or :before-change="validateInfo"-->
            <div  class="row">
            <div class="col-lg-5 float-left">
                <div class="form-group">
                    <label class="col-md-4">Type</label>
                    <select style="width: 250px; height:30px" v-model="ncr.type">
                        <option value="">Please Select</option>
                        <option value="Site">Maintenance</option>
                        <option value="Internal">Internal</option>
                        <option value="Aluminium">Aluminium</option>
                    </select>
                    <span v-if="required.includes('type')" style="color: red">Required</span>
                </div>

                <div v-if="ncr.type == 'Site'">
                    <div class="form-group">
                        <label class="col-md-4">Project/Site Name</label>
                        <input type="text" v-model="ncr.project" :disabled="ncr.type != 'Site'" @change="validateInfo" @keyup="validateInfo">
                        <span v-if="required.includes('site')" style="color: red">Required</span>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4">Client</label>
                        <input type="text" v-model="ncr.client">
                    </div>
                    <div class="form-group">
                        <label class="col-md-4">Mounting Height</label>
                        <input type="text" v-model="ncr.access">
                    </div>
                    <div class="form-group" >
                        
                        <label class="col-md-4">Sales Rep</label>
                        <select style="width: 250px; height:30px" v-model="ncr.sales_rep" @change="validateInfo">
                            <option v-for="rep in sales_reps" :key="rep.id" :value="rep.name.trim() + ' ' + rep.surname.trim()">{{rep.name.trim() + ' ' + rep.surname.trim()}}</option>
                            
                        </select>
                    <span v-if="required.includes('sales_rep')" style="color: red">Required</span>
                    
                    </div>
                    <div class="form-group">
                        <label class="col-md-4">Original SO/Inv No</label>
                        <input type="text" v-model="ncr.orig_so" @change="validateInfo" @keyup="validateInfo">
                        <span v-if="required.includes('orig_so')" style="color: red">Required</span>
                    </div>

                    <div class="form-group">
                        <label class="col-md-4">Maintenance SO</label>
                        <input type="text" v-model="ncr.so">
                    </div> 

                    <div class="form-group">
                        <label class="col-md-4">Date Manufactured</label>
                        <input type="month" style="width: 250px;" v-model="ncr.manufactured">
                    </div>
                </div>
                <div class="form-group" v-if="ncr.type == 'Internal'">
                    <label class="col-md-4">Department</label>
                    <select style="width: 250px; height:30px" v-model="ncr.department" @change="validateInfo">
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
                    <span v-if="required.includes('department')" style="color: red">Required</span>
                </div>
                <div v-if="ncr.type == 'Site'">
                <div class="form-group">
                    <label class="col-md-4">Region</label>
                    <select style="width: 250px; height:30px" v-model="ncr.region" :disabled="ncr.type != 'Site'" @change="validateInfo">
                        <option value="JHB">JHB</option>
                        <option value="CPT">CPT</option>
                        <option value="DBN">DBN</option>
                    </select>
                    <span v-if="required.includes('region')" style="color: red">Required</span>
                </div>
               
                </div>

                <div v-if="ncr.type == 'Aluminium'">
                    <div class="form-group">
                        <label class="col-md-4">Project/Site Name</label>
                        <input type="text" v-model="ncr.project" @change="validateInfo" @keyup="validateInfo">
                        <span v-if="required.includes('site')" style="color: red">Required</span>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4">Client</label>
                        <input type="text" v-model="ncr.client">
                    </div>
                  
                    <div class="form-group">
                        <label class="col-md-4">Original SO/Inv No</label>
                        <input type="text" v-model="ncr.orig_so" @change="validateInfo" @keyup="validateInfo">
                        <span v-if="required.includes('orig_so')" style="color: red">Required</span>
                    </div>

                    <div class="form-group">
                        <label class="col-md-4">Date Manufactured</label>
                        <input type="month" style="width: 250px;" v-model="ncr.manufactured">
                    </div>
                    <div v-if="ncr.responsible" style="margin-top:-10px; margin-left:3%; font-size: 12px; font-weight: bold; margin-bottom:1%">
                        {{previewRes()}}
                    </div>
                     <div class="form-group">
                        <label class="col-md-4">Responsible</label>
                        <div class="dropdown" style="margin-left: 34%; margin-top:-30px"> <!--class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"-->
                        <select style="width: 250px; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                            {{ncr.responsible}}
                        </select>
                        <div :class="{'dropdown-menu' : true, 'show': show}" @blur="show = false">
                            <a class="dropdown-item" v-for="user in users" :key="user.id" @blur="show = false"><input type="checkbox" :value="user" v-model="ncr.responsible"> {{user.name}}</a>
                        
                        </div>
                        </div> 
                        <span v-if="required.includes('responsible')" style="color: red">Required</span>                      
                    </div>
                </div>
            </div>

            <div class="col-lg-7 float-right" v-if="ncr.type == 'Site'">

             <div class="form-group" >   
                 <label class="col-md-2">Product</label>
                <table style="width:80%; margin-left: 15%; margin-top:-3.5%" class="table-bordered">
                    <tr>
                        <td colspan="3">
                            <model-list-select 
                                v-if="fittings.length>0"
                                :list="fittings"
                                v-model="product.name"
                                option-value="FittingName"
                                option-text="FittingName"
                                placeholder="Search Products"
                                style="width:100%;"
                                > 
                            </model-list-select>
                            <div v-else class="spinner-border" role="status">
                                <span class="sr-only">Loading Fittings..</span>
                            </div>
                            
                            <span v-if="prod_req.includes('name')" style="color: red">Required</span>
                        </td>
                        
                         <td style="width:120px"><input type="text" placeholder="Wattage"  style="width:80px" v-model="product.wattage"> W
                            <span v-if="prod_req.includes('wattage')" style="color: red">Required</span>
                            <span v-if="prod_req.includes('watt_num')" style="color: red">Enter Number</span>
                        </td>

                        <td style="width:10%">
                            <input type="text" placeholder="Qty" style="width:100%;"  v-model="product.qty">
                            <span v-if="prod_req.includes('qty')" style="color: red">Required</span>
                        </td>
                        
                    </tr>
                    <tr>
                       
                        <td style="width:25%"><input type="text" placeholder="Length" style="width:65%" v-model="product.length"> mm</td>

                        <td>
                            <select v-model="product.mounting" style="width:85%">
                                <option value="" selected disabled>Mounting</option>
                                <option value="P">Pendant</option>
                                <option value="R">Recessed</option>
                                <option value="SP">Suspended</option>
                                <option value="SF">Surface</option>
                                <option value="TR">Track</option>
                                <option value="W">Wall</option>
                            </select>
                        </td>

                        <td><select style="width:100%; height:30px" v-model="product.dimming">
                                <option value="" selected>Non-DIM</option>
                                <option value="DALI">DALI</option>
                                <option value="Push-DIM">Push-DIM</option>
                                <option value="0-10V">0-10V</option>
                                <option value="DMX">DMX</option>
                            </select>
                        </td>
                        <td>
                            <div style="vertical-align:middle; text-align: center">
                                <strong style="vertical-align:middle; padding-bottom: 0%; margin-bottom:0%">BB</strong>
                                <input type="checkbox" style="vertical-align:middle;" v-model="product.bb">
                            </div>
                            
                        </td>
                        <td style="width:120px"> <b-button @click="validateProd('site')">Add</b-button></td>
                    </tr>
                </table>
             </div>



                <div class="form-group">
        
                    <table class="table table-bordered" style="width:80%; margin-left:15%">
                        <thead>
                            <th>Product</th>
                            <th style="width:80px">Qty</th>
                            <th style="width:50px">DEL</th>
                        </thead>
                        <tbody>
                            <tr v-for="(product,index) in products" :key="product" style="padding: 0px">
                                <td>{{product.name}} <span v-if="product.mounting.length>0">{{product.mounting}}</span> {{product.wattage}}W <span v-if="product.length>0">{{product.length}}mm</span> {{product.dimming}} <span v-if="product.bb">BB</span></td>
                                <td><input type="text" v-model="product.qty" style="width:100%"></td>
                                <td style="text-align: center;"><span class="del" @click="products.splice(index,1)">X</span></td> <!--style="font-size: 20px; font-weight: bold;"-->
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="form-group" v-if="products_prop">
        
                    <table class="table table-bordered" style="width:80%; margin-left:15%; margin-top:4%; font-color:grey; font-size:12px">
                        <thead>
                            <th>Product Guide</th>
                            <th>Failure/Line Note</th>
                            <th style="width:80px">Qty</th>
                        </thead>
                        <tbody>
                            <tr v-for="(product,index) in products_prop" :key="product" style="padding: 0px">
                                <td>{{product.name}}</td>
                                <td>{{product.failure}}</td>
                                <td>{{product.qty}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <div class="col-lg-7 float-right" v-if="ncr.type == 'Aluminium'">

             <div class="form-group" >   
                 
                <table style="width:80%; margin-left: 15%;" class="table">
                    <tr>
                        <td style="width:31%"><label>Product Name</label></td>
                        <td style="width:59%">
                           <input type="text" style="width:98%" v-model="product.name">                            
                            <span v-if="prod_req.includes('name')" style="color: red">Required</span>
                        </td>
                        
                        <td style="width:10%">
                            <input type="text" placeholder="Qty" style="width:100%;"  v-model="product.qty">
                            <span v-if="prod_req.includes('qty')" style="color: red">Required</span>
                        </td>
                        
                    </tr>
                    <tr>
                       
                        <td style="width:31%"><label>Failure Description</label></td>

                        <td style="width:59%; height:77.93px">  
                            <textarea style="width:98%; height:98%" v-model="product.failure"></textarea>
                        </td>

                        
                        <td style="width:10%; text-align: center"> <b-button @click="validateProd('Aluminium')">Add</b-button></td>
                    </tr>
                </table>
             </div>



                <div class="form-group">
        
                    <table class="table table-bordered" style="width:80%; margin-left:15%">
                        <thead>
                            <th>Product</th>
                            <th>Failure</th>
                            <th style="width:80px">Qty</th>
                            <th style="width:50px">DEL</th>
                        </thead>
                        <tbody>
                            <tr v-for="(product,index) in products" :key="product" style="padding: 0px">
                                <td>{{product.name}}</td>
                                <td>{{product.failure}}</td>
                                <td><input type="text" v-model="product.qty" style="width:100%"></td>
                                <td style="text-align: center;"><span class="del" @click="products.splice(index,1)">X</span></td> <!--style="font-size: 20px; font-weight: bold;"-->
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>


            </div>
          
        </tab-content>
        
             
        <tab-content title="Failed Products" :beforeChange="beforeTabChange" v-if="ncr.type == 'Internal'">
            <div  class="row">
            <div class="col-lg-6 float-left">
               <!--validation-observer v-slot="{handleSubmit}"--> 
                <form > <!--@submit.prevent="addProd"-->
                    <div class="form-group">
                        <!--validation-provider  rules="required" v-slot="{ errors }"-->
                        <label class="col-md-4">Product</label>
                        <!--input style="width:250px" type="text" v-model="product.name"-->
                       <table style="width:70%; margin-left: 25%; margin-top:-5.5%; margin-bottom:5%" class="table-bordered">
                            <tr>
                                <td colspan="2">
                                    <model-list-select 
                                        :list="fittings"
                                        v-model="product.name"
                                        option-value="FittingName"
                                        option-text="FittingName"
                                        placeholder="Search Products"
                                        style="width:100%;"
                                        > 
                                    </model-list-select>
                                    
                                    <span v-if="prod_req.includes('name')" style="color: red">Required</span>
                                </td>

                                <td style="width:25%"><input type="text" placeholder="Wattage"  style="width:70%" v-model="product.wattage"> W
                                    <span v-if="prod_req.includes('wattage')" style="color: red">Required</span>
                                    <span v-if="prod_req.includes('watt_num')" style="color: red">Enter Number</span>
                                </td>
                                
                                <td style="width:15%">
                                    <input type="text" placeholder="Qty" style="width:80%;"  v-model="product.qty">
                                    <span v-if="prod_req.includes('qty')" style="color: red">Required</span>
                                </td>
                                
                            </tr>
                            <tr>
                                
                                <td style="width:30%"><input type="text" placeholder="Length" style="width:65%" v-model="product.length"> mm</td>
                                <td>
                                    <select v-model="product.mounting" style="width:85%">
                                        <option value="" selected disabled>Mounting</option>
                                        <option value="P">Pendant</option>
                                        <option value="R">Recessed</option>
                                        <option value="SP">Suspended</option>
                                        <option value="SF">Surface</option>
                                        <option value="TR">Track</option>
                                        <option value="W">Wall</option>
                                    </select>
                                </td>
                                <td  style="width:25%">
                                    <select style="width:100%; height:30px" v-model="product.dimming">
                                        <option value="" selected>Non-DIM</option>
                                        <option value="DALI">DALI</option>
                                        <option value="Push-DIM">Push-DIM</option>
                                        <option value="0-10V">0-10V</option>
                                        <option value="DMX">DMX</option>
                                    </select>
                                </td>
                                <td >
                                    <div style="vertical-align:middle; text-align: center">
                                        <strong style="vertical-align:middle; padding-bottom: 0%; margin-bottom:0%">BB</strong>
                                        <input type="checkbox" style="vertical-align:middle;" v-model="product.bb">
                                    </div>
                                </td>
                                <!--td style="width:120px"> <b-button >Add</b-button></td-->
                            </tr>
                        </table>
                        <!--input style="width:50px" type="text" placeholder="Qty" v-model="product.qty"-->
                        <!--span class="required">{{ errors[0] }}</span>
                        </validation-provider-->
                       
                    </div>

                     <div class="form-group">
                        <!--validation-provider  rules="required" v-slot="{ errors }"-->
                        <label class="col-md-3">Issue Category</label>
                        <!--multiselect style="width:70%; margin-left:25%; " :multiple="true" :close-on-select="false" :clear-on-select="false" v-model="product.category" :options="options">
                            <template slot="selection" slot-scope="{ values, search, isOpen }"><span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} options selected</span></template>
                        </multiselect-->
                        <multiselect 
                            v-model="value" 
                            tag-placeholder="Add this as new tag" 
                            placeholder="Search or add a tag" 
                            label="name" 
                            track-by="name" 
                            :hide-selected="true" 
                            :options="options" 
                            :multiple="true" 
                            :taggable="true" 
                            @input="addTag()"
                            style="width:70%; margin-left:25%">

                        </multiselect>
                         <span v-if="prod_req.includes('category')" style="color: red; margin-left:25%">Required</span>
                        <!--span class="required">{{ errors[0] }}</span>
                        </validation-provider-->
                    </div>

                    <div class="form-group" style="width:70%">
                         <!--validation-provider  :rules="`${ isRequired ? 'required' : '' }`" v-slot="{ errors }"-->
                        <label class="col-md-3">Failure Description</label>
                        <textarea name="" id="" style="width:100%; margin-left:35%; margin-top: -12%" rows="3" v-model="product.failure"></textarea>
                        <span v-if="prod_req.includes('failure')" style="color: red; margin-left:35%">Required</span>
                        <!--span class="required">{{ errors[0] }}</span>
                        </validation-provider-->
                    </div>
                    <hr style="height:2px;border-width:0;color:gray;background-color:gray;">
                    <div v-if="components" style="margin-top:-10px; font-size: 12px; font-weight: bold; margin-bottom:1%">
                        {{previewComps()}}
                    </div>
                    
                    <div class="form-group">
                        <label class="col-md-3">Components</label>
                        <input style="width:38%" type="text" v-model="component.name">
                        <span v-if="comp_req.includes('name')" style="color: red; ">Required</span>
                        <input style="width:50px" type="text" placeholder="Qty" v-model="component.qty">
                        <span v-if="comp_req.includes('qty')" style="color: red; ">Required</span>
                        
                        <!--textarea name="" id="" cols="32" rows="3" v-model="product.components"></textarea-->
                    </div>

                    <div class="form-group">
                        <label class="col-md-3">Supplier</label>
                        <!--input style="width:250px" type="text" v-model="component.supplier"-->
                        <model-list-select 
                            :list="suppliers"
                            v-model="component.supplier"
                            option-value="supplier"
                            option-text="supplier"
                            placeholder="Search suppliers"
                            style="width:38%; margin-left:25.5%; margin-top:-5%"
                            > 
                        </model-list-select>
                        <b-button @click="addComp()" style="margin-left:65%; margin-top:-10%">Add</b-button>
                    </div>
                    <hr style="height:2px;border-width:0;color:gray;background-color:gray">

                    <div class="form-group">
                        <label class="col-md-3">Upload Pictures</label>
                        <input type="file" ref="pic" accept="image/*" @change="handleImageUpload()" multiple> <!--@change="handleImageUpload()"  multiple-->
                    </div>
                    
                    
                    <b-button style="margin-left:26%" @click="validateProd('Internal')">Add Product</b-button> <!-- type="submit"-->
                 </form>
               <!--/validation-observer-->
                 
            </div>
             <div class="col-lg-6 float-right">
                 <table class="table table-bordered"> <!--table-striped-->
                     <thead class=" thead-light">
                        <col>
                        <col>
                        <colgroup span="4"></colgroup>
                         <tr>
                            <th  style="width:25%; vertical-align : middle;text-align:center;">Product</th> <!--rowspan="2"-->
                            <th  style="width:10%; vertical-align : middle;text-align:center;">Qty</th> <!--rowspan="2"-->
                            <th colspan="3" scope="rowgroup" style="width:65%;text-align:center">Components</th>
                         </tr>
                         <!--tr style="width:100%">
                             <th style="text-align:center; width:50%">Component</th>
                             <th style="text-align:center; width:10%">Qty</th>
                             <th style="text-align:center; width:40%">Supplier</th>
                         </tr-->
                      
                         
                         
                     </thead>
                     <tbody>
                         <tr v-for="(product1,index) in products" :key="index">
                             <td v-if="edit != `prod_name${index}`" @dblclick="edit = `prod_name${index}`"  style="width:30%;">
                                 {{product1.name}} {{product1.wattage}}W <span v-if="product1.length>0">{{product1.length}}mm</span> {{product1.dimming}} <span v-if="product1.bb">BB</span>
                            </td>
                            <td v-else  style="width:30%;">
                                 <input type="text" v-model="product1.name"  style="width:100%;">
                            </td>
                            <td  v-if="edit != `prod_qty${index}`" @dblclick="edit = `prod_qty${index}`" style="width:5%">
                                 {{product1.qty}}
                            </td> 
                            <td v-else style="width:10%">
                                 <input type="text" v-model="product1.qty" style="width:100%">
                            </td>
                            <td colspan="3" style="padding:0px">
                                <table style="width:100%"> <!--v-if="product1.components"-->
                                    <tr v-for="(comp,index2) in product1.components" :key="index2" >
                                        <td v-if="edit != `comp_name${index-index2}`" @dblclick="edit = `comp_name${index-index2}`" style="width:50%">{{comp.name}}</td>
                                        <td v-else style="width:50%; padding: 12px 0px"><input type="text" v-model="comp.name" style="width:100%"></td>
                                        <td v-if="edit != `comp_qty${index-index2}`" @dblclick="edit = `comp_qty${index-index2}`" style="width:10%">{{comp.qty}}</td>
                                        <td v-else style="width:10%; padding: 12px 0px"><input type="text" v-model="comp.qty" style="width:100%"></td>
                                        <td v-if="edit != `comp_supplier${index-index2}`" @dblclick="edit = `comp_supplier${index-index2}`" style="width:40%">{{comp.supplier}}</td>
                                        <td v-else style="width:40%; padding: 12px 0px"><input type="text" v-model="comp.supplier" style="width:100%"></td>
                                    </tr>
                                </table>
                             </td>
                            <!--div v-if="product1.components">
                             <div v-for="(comp,index2) in product1.components" :key="index2">
                                 <td colspan="1" v-if="edit != `comp_name${index-index2}`" @dblclick="edit = `comp_name${index-index2}`" style="width:350px">{{comp.name}}</td> 
                                 <td v-else style="width:350px"><input type="text" v-model="comp.name" style="width:100%"></td>
                                 <td colspan="1" v-if="edit != `comp_qty${index-index2}`" @dblclick="edit = `comp_qty${index-index2}`" style="width:50px">{{comp.qty}}</td> 
                                 <td v-else style="width:50px"><input type="text" v-model="comp.qty" style="width:100%"></td>
                                 <td colspan="1" v-if="edit != `comp_supplier${index-index2}`" @dblclick="edit = `comp_supplier${index-index2}`" style="width:150px">{{comp.supplier}}</td> 
                                 <td v-else style="width:150px"><input type="text" v-model="comp.supplier" style="width:100%"></td>
                             </div>
                            </div>
                            <div v-else>
                                 <td colspan="3"></td>
                             </div-->
                            
                         </tr>
                     </tbody>
                 </table>
                 
                
             </div>
            
            </div>
        </tab-content>

        <tab-content title="Review" v-if="ncr.type == 'Internal'">
            <table class="table table-bordered"> <!--table-striped-->
                     <thead class=" thead-light">
                         <tr>
                            <th style="width:20%">Product</th>
                            <th style="width:5%">Qty</th>
                            <th style="width:20%">Failure</th>
                            <th style="width:45% ; text-align:center" colspan="3">Components</th>
                            <th style="width:5%">Pics</th>
                            <th style="width:5%">Delete</th>
                         </tr>
                         
                     </thead>
                     <tbody>
                         <tr v-for="(product1,index) in products" :key="index">
                             <td v-if="edit != `prod_name${index}`" @dblclick="edit = `prod_name${index}`">{{product1.name}}</td>
                             <td v-else><input type="text" v-model="product1.name"></td>
                             <td v-if="edit != `prod_qty${index}`" @dblclick="edit = `prod_qty${index}`">{{product1.qty}}</td>
                             <td v-else><input style="width:50px" type="text" v-model="product1.qty"></td>
                             <td v-if="edit != `failure${index}`" @dblclick="edit = `failure${index}`">{{product1.failure}}</td>
                             <td v-else><input type="text" v-model="product1.failure" style="width:100%"></td>
                             <td colspan="3" style="padding:0px">
                                <table style="width:100%"> <!--v-if="product1.components"-->
                                    <tr v-for="(comp,index2) in product1.components" :key="index2" >
                                        <td v-if="edit != `comp_name${index-index2}`" @dblclick="edit = `comp_name${index-index2}`" style="width:50%">{{comp.name}}</td>
                                        <td v-else style="width:50%; padding: 12px 0px"><input type="text" v-model="comp.name" style="width:100%"></td>
                                        <td v-if="edit != `comp_qty${index-index2}`" @dblclick="edit = `comp_qty${index-index2}`" style="width:10%">{{comp.qty}}</td>
                                        <td v-else style="width:10%; padding: 12px 0px"><input type="text" v-model="comp.qty" style="width:100%"></td>
                                        <td v-if="edit != `comp_supplier${index-index2}`" @dblclick="edit = `comp_supplier${index-index2}`" style="width:40%">{{comp.supplier}}</td>
                                        <td v-else style="width:40%; padding: 12px 0px"><input type="text" v-model="comp.supplier" style="width:100%"></td>
                                    </tr>
                                </table>
                             </td>
                             <!--div v-if="product1.components">
                             <div v-for="(comp,index2) in product1.components" :key="index2" colspan="3">
                                 <td style="width:350px" v-if="edit != `comp_name${index-index2}`" @dblclick="edit = `comp_name${index-index2}`">{{comp.name}}</td>
                                 <td v-else style="width:350px"><input type="text" v-model="comp.name" style="width:100%"></td>
                                 <td style="width:50px" v-if="edit != `comp_qty${index-index2}`" @dblclick="edit = `comp_qty${index-index2}`">{{comp.qty}}</td>
                                 <td v-else style="width:50px"><input type="text" v-model="comp.qty" style="width:100%"></td>
                                 <td style="width:150px"  v-if="edit != `comp_supplier${index-index2}`" @dblclick="edit = `comp_supplier${index-index2}`">{{comp.supplier}}</td>
                                 <td v-else style="width:150px"><input type="text" v-model="comp.supplier" style="width:100%"></td>
                             </div>
                             </div>
                             <div v-else>
                                 <td colspan="3"></td>
                             </div-->
                             <td v-if="add_pics != `${product1.name}`" @dblclick="add_pics = `${product1.name}`">{{product1.pics.length}}</td> <!-- v-if="product1.pics"-->
                             <td v-else>
                                 <span>
                                    <input type="file" ref="pic" accept="image/*"  @change="handleImage2(product1)" multiple>
                                    <div @click="add_pics = ''" class="delete">X</div>
                                 </span>
                             </td>
                             <td class="delete" @click="products.splice(index,1)">X</td>
                         </tr>
                     </tbody>
                 </table>
                 <form>
                    <div class="row">
                    <div class="col-lg-5 float-left">
                    <div class="form-group">
                        <label class="col-md-4">Comp. Value</label>
                        R <input type="text" v-model="ncr.comp_value" v-validate="'decimal:3'">
                        <!--span>{{ errors.first('decimal') }}</span-->
                    </div>
                    <div class="form-group">
                        <label class="col-md-4">Due Date</label>
                        <input type="date" :min="today()" v-model="ncr.due_date">
                    </div>
                    <div v-if="ncr.responsible" style="margin-top:-10px; margin-left:3%; font-size: 12px; font-weight: bold; margin-bottom:1%">
                        {{previewRes()}}
                    </div>
                    <div class="form-group">
                        <label class="col-md-3">Responsible</label>
                        <div class="dropdown" style="margin-left: 34%; margin-top:-30px"> <!--class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"-->
                        <select style="width: 250px; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                            {{ncr.responsible}}
                        </select>
                        <div :class="{'dropdown-menu' : true, 'show': show}" @blur="show = false">
                            <a class="dropdown-item" v-for="user in users" :key="user.id" @blur="show = false"><input type="checkbox" :value="user" v-model="ncr.responsible"> {{user.name}}</a>
                        
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                </form>

        </tab-content>

       
    </form-wizard>
    </div>
    <div v-else class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
        </div>
    </div>
    
</div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import { ext, required } from 'vee-validate/dist/rules';
extend('required', {
  ...required,
  message: 'Required'
});

/*extend('decimal', {
  validate: (value, { decimals = '*', separator = '.' } = {}) => {
    if (value === null || value === undefined || value === '') {
      return {
        valid: false
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(`^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`);

    return {
      valid: regex.test(value),
    };
  },
  message: 'The {_field_} field must contain only decimal values'
})*/



export default {
     components: {
        FormWizard,
        TabContent,
        ValidationProvider,
        ValidationObserver,
        Multiselect,
        ModelListSelect
       
     },

     props: ['fittings', 'ncr_prop', 'products_prop'],

    data() {
        return {
            add_pics: '',
            show: false,
            wait: false,
            ncr: {
                type: '',
                department: '',
                product: '',
                reported_by: '',
                sales_rep: '',
                region: '',
                so: '',
                orig_so: '',
                project: '',
                client: '',
                supplier: '',
                responsible: [],
                email: '',
                status: 'open',
                comp_value: '',
                value: '',
                due_date: '',
                manufactured: null
            },

            product: {
                name: '',
                wattage: '',
                length: '',
                mounting: '',
                dimming: '',
                bb: false,
                qty: '',
                category: null,
                failure: '',
                components: [],
                pics: []
            },

            component: {
                name: '',
                qty: '',
                supplier: ''
            },

            //options: ['Faulty PSU','Faulty PCB','Water/Moister Ingress','Incorrect Wiring','Overheating','Dimming issue','Incorrect Spec','Poor Quality','Loose Connection', 'Other'],
            options: [{name:'Faulty Driver'},{name:'Faulty PCB'},{name:'Water/Moister Ingress'},{name:'Incorrect Wiring'},{name:'Overheating'},{name:'Dimming issue'},{name:'Incorrect Spec'},{name:'Poor Quality'},{name:'Loose Connection'},{name:'Other'}], 

            components: [],

            responsible: [],

            products: [],

            edit: '',

            images: [],

            //users: [],

            users: [{id: 1, name: 'Alan', email: 'alan@wahl.co.za'},
                    {id: 2, name: 'Chetan', email: 'chetan@regentlight.co.za'},
                    {id: 3, name: 'Design', email: 'design@regentlight.co.za'},
                    {id: 4, name: 'Grant', email: 'grant@regentlight.co.za'},
                    {id: 5, name: 'Hoxani', email: 'maintenance@regentlight.co.za'},
                    {id: 6, name: 'Kenneth', email: 'kenneth@regentlight.co.za'},
                    {id: 7, name: 'Leeanne', email: 'Leeanne@regentlight.co.za'},
                    {id: 8, name: 'Laurens', email: ''},
                    {id: 9, name: 'Petrese', email: 'petrese@wahl.co.za'},
                    {id: 10, name: 'Roland', email: ''},
                    {id: 11, name: 'TestLab', email: 'testlab@wahl.co.za'},
                    {id: 12, name: 'Themba', email: 'themba@regentlight.co.za'},
                    {id: 13, name: 'Theo', email: 'theo@regentlight.co.za'},
                    {id: 14, name: 'Thomas', email: 'Thomas@wahl.co.za'},
                    {id: 15, name: 'Wayne', email: 'wayne.j@regentlight.co.za'},
                    {id: 16, name: 'Welcome', email: 'welcome.m@regentlight.co.za'},
                    {id: 17, name: 'kentest', email: 'nk.fuze@gmail.com'}],

            required: [],
            sales_reps: [],
            //fittings: [],
            prod_req: [],
            suppliers: [],
            value: [],
            comp_req: [],
           
        }
      
    },

    computed: {
        isRequired() {
            
            if(this.product.category.includes("Other")) {
                return true
            }
            else {
                return false
            }
        }
    },

    methods: {

        addTag() {
            //console.log('index = ', index)
            let cat = null
            if(this.value.length>0) {
                cat = this.value[0].name
                for(let i = 1; i<this.value.length; i++) {
                    cat = cat + ', ' + this.value[i].name
            }
        }
        this.product.category = cat
        //this.product_obj.category = cat
        
    },

        validateProd(type) {
            this.prod_req = []

            if(this.product.name.length == 0) {
                this.prod_req.push('name')
            }
            if(this.product.qty.length == 0) {
                this.prod_req.push('qty')
            }
            if(this.product.wattage.length == 0 && type != 'Aluminium') {
                this.prod_req.push('wattage')
            }

            if(type == 'Internal') {
                if(this.product.category != null) {
                    if(this.product.category.length == 0) {
                        this.prod_req.push('category')
                    }
                    else if(this.product.category.includes('Other')) {
                        if(this.product.failure.length == 0) {
                            this.prod_req.push('failure')
                        }
                    }
                }
                else {
                    this.prod_req.push('category')
                }
               
            }

            if(this.prod_req.length == 0) {
                this.product.wattage = parseFloat(this.product.wattage)
                if(this.product.length.length>0) {
                    this.product.length = parseFloat(this.product.length)
                }
                this.addProd()
            }
          
        },

        validateInfo() {

            this.required = []
            console.log('Validate Info ncr.type = ', this.ncr.type)
            if(this.ncr.type.length == 0) {
    
                this.required.push('type')
            }
           
            else {
                if(this.ncr.type == 'Internal') {
                    if(this.ncr.department.length == 0) {
                         this.required.push('department') 
                    }
                }
                if(this.ncr.type == 'Site') { //tpe = site
                    //console.log('ncr = ', this.ncr)
                    if(this.ncr.orig_so.length == 0) {

                        this.required.push('orig_so')
                    }
                    if(this.ncr.sales_rep == undefined) {
                       this.ncr.sales_rep = ''
                    }
                    if(this.ncr.sales_rep.length == 0) {

                        this.required.push('sales_rep')
                    }
                    
                    if(this.ncr.region.length == 0) {
                       
                        this.required.push('region')
                    }
                   
                   if(this.ncr.project != null) {
                        if(this.ncr.project.length == 0) {
                         
                            this.required.push('site')
                        }
                   }
                   else {
                        this.required.push('site')
                   }
                   
                  
                }
                if(this.ncr.type == 'Aluminium') {
                    if(this.ncr.project.length == 0) {
                         
                        this.required.push('site')
                    }
                    if(this.ncr.orig_so.length == 0) {

                        this.required.push('orig_so')
                    }
                    if(this.ncr.responsible.length == 0) {

                        this.required.push('responsible')
                    }
                }
            }
            if(this.required.length>0) {
                return false
            }
            else {
                return true
            }

        },

       

        handleImageUpload() {
            //this.product.pics = this.$refs.pic.files
            //console.log('this.$refs.pic.files = ', this.$refs.pic.files)
            for( var i = 0; i < this.$refs.pic.files.length; i++ ){
                //console.log('this.$refs.pic.files[i] = ', this.$refs.pic.files[i])
                this.product.pics[i] = this.$refs.pic.files[i]
                //console.log('this.product.pics[i] = ', this.product.pics[i])
            }

            console.log('this.product.pics = ', this.product.pics)
        },

        handleImage2(product) {
            console.log('this.$refs = ', this.$refs)
            console.log('this.$refs.pic = ', this.$refs.pic)
            console.log('this.$refs.pic[0] = ', this.$refs.pic[0])
            console.log('this.$refs.pic[0].files = ', this.$refs.pic[0].files)
            for( var i = 0; i < this.$refs.pic[0].files.length; i++ ){
               
                product.pics[i] = this.$refs.pic[0].files[i]
               
            }

            //console.log('this.product.pics = ', this.product.pics)
        },


        async onComplete() {
            this.wait = true
            //console.log('ncr.type = ', this)
            //if(this.ncr.type == 'Internal') {
                console.log(this.ncr.type)
                if(this.products.length>0) {
                if(this.ncr.type == 'Site' && this.ncr.region == 'JHB') {
                    let email = ''
                    if(this.$auth.user.username != 'Hoxani') {
                        console.log(this.$auth.user)
                        email = 'maintenance@regentlight.co.za1'
                    }
                    this.ncr.responsible = [{id: 4, name: 'Hoxani', email: email}]
                }
                if(this.ncr.type == 'Site' && this.ncr.region == 'DBN') {
                    this.ncr.responsible = [{id: 14, name: 'Laurens', email: ''}]
                }
                if(this.ncr.type == 'Site' && this.ncr.region == 'CPT') {
                    this.ncr.responsible = [{id: 15, name: 'Roland', email: ''}]
                }
                if(this.ncr.responsible.length > 0) {
                    let formData = new FormData();
                    
                    for(let i = 0; i<this.products.length; i++) {
                        
                        if(i == 0) {
                            this.ncr.product = this.products[i].name
                        }
                        else {
                            this.ncr.product = this.ncr.product + ', ' + this.products[i].name
                        }
                        console.log('this.products[i].pics.length = ', this.products[i].pics.length)
                        console.log('this.products[i].pics = ', this.products[i].pics)
                        for( var j = 0; j < this.products[i].pics.length; j++ ){
                            let image = this.products[i].pics[j]
                            image.pic_name = image.name
                            console.log('image = ', image)
                            //console.log('image.name = ', image.name)
                            formData.append('image', image);
                        }

                        /*let category = this.products[i].category[0]

                        for(let j = 1; j<this.products[i].category.length; j++) {
                            category = category + ', ' + this.products[i].category[j]
                        }

                        this.products[i].category = category*/
                        
                    }
                

                    let responsible = this.ncr.responsible[0].name
                    this.ncr.email = this.ncr.responsible[0].email
                    for(let i = 1; i<this.ncr.responsible.length; i++) {
                        responsible = responsible + ', ' + this.ncr.responsible[i].name
                        this.ncr.email = this.ncr.email + ', ' + this.ncr.responsible[i].email
                    }
                    this.ncr.responsible2 = responsible
                    this.ncr.logged_by = this.$auth.user.username

                    if(this.ncr.type == 'Site') {
                        this.ncr.maint_status = 'active'
                    }
                    else {
                        this.ncr.maint_status = null
                    }


                    formData.append('ncr', JSON.stringify(this.ncr))
                    formData.append('products', JSON.stringify(this.products))
                    //console.log('formData = ', formData)

                    let res = await this.$axios.$post('/ncr2', formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                                })

                    if(res.hasOwnProperty('type')) {
                        console.log('res = ', res)
                        if(res.type == 'ERROR') {
                            alert(`${res.message}`)
                        }
                        else {
                            this.wait = false
                            //alert(`${res.message}`)
                            console.log('Calling close log from Logissue2')
                            this.$emit('closeLog')
                        }
                    }
                    
                    
                }
                else {
                    alert('Please select at least one person as responsible')
                }
                }
                else {
                    alert('Please add at least one product to the NCR')
                    this.wait = false
                    return false
                }
            //}
            /*else {
                let formData = new FormData();
                formData.append('ncr', JSON.stringify(this.ncr))
                let res = await this.$axios.$post('/ncr2', formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                                })

                    if(res.hasOwnProperty('type')) {
                        console.log('res = ', res)
                        if(res.type == 'ERROR') {
                            alert(`${res.message}`)
                        }
                        else {
                            this.wait = false
                            //alert(`${res.message}`)
                            this.$emit('closeLog')
                        }
                    }
            }*/
           
        },

        addComp() {
            this.comp_req = []
            if(this.component.name.length == 0) {
                this.comp_req.push('name')
            }
            if(this.component.qty.length == 0) {
                this.comp_req.push('qty')
            }

            if(this.comp_req.length == 0) {
                this.components.push(this.component); 
                this.component = {
                    name: '',
                    qty: '',
                    supplier: ''
                }
            }
        },

        addProd() {
            if(this.component.name.length>0) {
                this.components.push(this.component)
                this.component = {  name: '',
                                    qty: '',
                                    supplier: ''
                                }
            }
            this.product.components = this.components; 
            this.products.push(this.product); 
            this.product = {
                            name: '',
                            wattage: '',
                            length: '',
                            mounting: '',
                            dimming: '',
                            bb: false,
                            qty: '',
                            category: null,
                            failure: '',
                            components: [],
                            pics: []
                            }
            this.value = []
            this.components = []; 
            if(this.ncr.type == 'Internal') {
                this.$refs.pic.value = null
            }
            

        },

        

        displayComps() {
            for(let i = 0; i<this.components.length; i++) {
                return this.components[i]
            }
        },

        previewComps() {
            let comps = ''
            if(this.components.length>0) {
                comps = this.components[0].name
            }
            for(let i = 1; i<this.components.length; i++) {
                comps = comps + ', ' + this.components[i].name
            }

            return comps
        },

        previewRes() {
            let res = ''
            if(this.ncr.responsible.length>0) {
                res = this.ncr.responsible[0].name
            }
            for(let i = 1; i<this.ncr.responsible.length; i++) {
                res = res + ', ' + this.ncr.responsible[i].name
            }

            return res
        },


         today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },

        validateProducts() {
           //return new Promise((resolve, reject) => {
             
                if(this.products.length > 0) {
                    console.log('this.products.length = ', this.products.length)
                    //console.log('Printed before alert')
                    alert('Please add at least one product')
                    //this.add_product = "Please add at least one product"
                    //reject()
                    return true
                    return Promise.resolve(false)
                    //console.log()
                }
                else {
                    console.log('this.products.length = ', this.products.length)
                    return false
                    return Promise.resolve(true)
                    //return true
                }
           //})
            

        },
        

        beforeTabChange() {
            if(this.component.name.length>0) {
                this.components.push(this.component)
                this.component = {  name: '',
                                    qty: '',
                                    supplier: ''
                                }                
            }
            if(this.product.name.length>0) {
                this.product.components = this.components
                this.components = []
                this.products.push(this.product)
                this.product = {
                            name: '',
                            wattage: '',
                            length: '',
                            mounting: '',
                            dimming: '',
                            bb: false,
                            qty: '',
                            category: null,
                            failure: '',
                            components: [],
                            pics: []
                            }
            }
            
            if(this.products.length == 0) {
              
                alert('Please add at least one product')
                return false
            }
            else {
       
                return true         
            }

        },

        

        async logNCR() {
            if(this.ncr.responsible.length > 0) {
                let responsible = this.ncr.responsible[0].name
                this.ncr.email = this.ncr.responsible[0].email

                for(let i = 1; i<this.ncr.responsible.length; i++) {
        
                    responsible = responsible + ', ' + this.ncr.responsible[i].name
                    this.ncr.email = this.ncr.email + ', ' + this.ncr.responsible[i].email
                }

                this.ncr.responsible = responsible
                this.ncr.logged_by = this.$auth.user.username


                //let formData = new FormData();
                for( var i = 0; i < this.$refs.pic.files.length; i++ ){
                    let image = this.$refs.pic.files[i];
                    formData.append('image', image);
                }
                //formData.append("images", this.$refs.pic.files[0])
               
                formData.append("ncr", JSON.stringify(this.ncr))
                //await this.$axios.$post('/ncr', this.ncr)
                await this.$axios.$post('/ncr', formData, {
                  headers: {
                  "Content-Type": "multipart/form-data"
                  }
                })
                this.$emit('closeLog')
            }
            else {
                alert('Please select at least one person as responsible')
            }
            
        },

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },
    },

    created: async function() {
    
        this.sales_reps = await this.$axios.$get('/sales_reps')
        //console.log('fittings = ', this.fittings.length)
        this.suppliers = await this.$axios.$get('/suppliers')

        if(this.ncr_prop) {
            this.ncr = this.ncr_prop
        }
        

        //this.users = await this.$axios.$get('/responsible_users')
        
       

    }
    
}
</script>

<style scoped>

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

.multiselect {
    width: 59%;
    margin: -7% 0 0 34%;
    border: 1px solid #0a0a0a;
}

.multiselect__tags {
    width: 50%;
   
}

input[type="text"],[type="date"] {
    width: 250px
}

.delete {
    font-size: 20px; 
    font-weight: bold; 
    width: 40px; 
    text-align: center; 
}

.delete:hover {
    color: red
}


.close {
  color: rgb(66, 63, 63);
  float: right;
  font-size: 45px;
  font-weight: bold;
  /*margin-top: -1%;*/
}
.close:hover,
.close:focus {
  color: red;
  text-decoration: none;
  cursor: pointer;
}

/*.show {
  display: block;
}*/

.dropdown-item {
  margin-left: 0%;
  padding: 0% 2% 1% 3%;
  font-size: 14px;
}

.dropdown-item :hover {
  background-color: grey;
}

.dropdown-menu {
    width: 250px
}

.required {
    color: red;
    margin-left: 2.5%;
}

</style>

<style>

.vue-form-wizard .wizard-card-footer {
    padding: 0 20px;
    /*margin-top: 10%;*/
    float:none
}

</style>