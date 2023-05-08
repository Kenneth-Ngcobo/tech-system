<template>
<div>
    <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    
    </head>
    <div>
        <h5 style="margin-left:40%">{{ncr.ncr_no}}</h5>
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

    <div>
    <b-card no-body>
        <b-tabs card>
        <b-tab v-for="(product,index) in products" :key="product.id" :title="product.product_name">
            <b-card-text>
                <form>
                <center v-if="product.images != null">
                    <b-button @click="showImages(product)" style="margin-bottom: 1%">View Images</b-button>
                </center>
                
                <div class="row">
                <div class="col-lg-6 float-left"> <!-- style="background-color: grey"-->
                    <div class="form-group">
                        <label class="col-lg-4">Qty</label>
                        <input type="text" v-model="product.qty">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Issue Category</label>
                        <input type="text" v-model="product.category" disabled>
                    </div>
                    <div class="form-group" style="display: inline-block; width: 63%"> 
                        <label class="col-lg-4">Failure Description</label>
                        
                        <textarea name="" id="" style="width: 100%; margin: -4% 0 0 53.5%" rows="5" v-model="product.failure"></textarea>
                        
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
                                <tr v-for="comp in getComps(product.product_name)" :key="comp.id">
                                    <td style="width:55%"><input type="text" style="width:100%" v-model="comp.component"></td>
                                    <td style="width:10%"><input type="text" style="width:100%" v-model="comp.qty"></td>
                                    <td style="width:35%"><input type="text" style="width:100%" v-model="comp.supplier"></td>
                                    <td class="delete"><span @click="removeComp(product.product_name, comp.component)">&times;</span></td>
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
                     <div class="form-group">
                        <label class="col-lg-4">Liable</label>
                        <input type="text" v-model="product.liable">
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
                            <div v-for="i in product.report.split(',')" :key="i" style="margin-left: 34%;">
                                <!--span v-if="i != 'change'"-->
                                <a style="font-size: 13px ; " href="#" @click="openReport(i)">{{i.substring(19)}}</a>
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
                    

                </div>
                </div>
                </form>
            </b-card-text>
        </b-tab>
        </b-tabs>
    </b-card>
    </div>

    
   

    <div style="margin-top:1%;">
        <b-card no-body>
            <b-tabs card>
                <b-tab title="NCR Details">
             <form>
                <div class="row">
                <div class="col-lg-6 float-left">
                     <div class="form-group">
                         <label class="col-lg-4">Value</label>
                         <input type="text" v-model="ncr.value">
                     </div>
                    <div class="form-group">
                        <label class="col-lg-4">Status</label>
                        <select style="height:30px" v-model="ncr.status">
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Type</label>
                        <select style="height:30px" v-model="ncr.type">
                            <option value="Site">Site</option>
                            <option value="Internal">Internal</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Region</label>
                        <select style="height:30px" v-model="ncr.region"> <!--:disabled="ncr.type != 'Site'"-->
                            <option value="JHB">JHB</option>
                            <option value="CPT">CPT</option>
                            <option value="DBN">DBN</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Original SO/INV</label>
                        <input type="text" v-model="ncr.orig_so">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Maintenance SO</label>
                        <input type="text" v-model="ncr.so">
                    </div>
                     <div class="form-group">
                        <label class="col-lg-4">Manufacture Date</label>
                        <input type="text" v-model="ncr.manufactured">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Reported By</label>
                        <input type="text" v-model="ncr.reported_by">
                    </div>
                    
                
                </div>

                <div class="col-lg-6 float-right">
                    
                    
                    <div class="form-group">
                        <label class="col-lg-4">Sales Rep</label>
                        <input type="text" v-model="ncr.sales_rep"> <!--:disabled="ncr.type != 'Site'"-->
                    </div>
                    
                    <div class="form-group">
                        <label class="col-lg-4">Project/Site Name</label>
                        <input type="text" v-model="ncr.project">
                    </div>
                    
                    <div class="form-group">
                        <label class="col-lg-4">Client</label>
                        <input type="text" v-model="ncr.client">
                    </div>
                    
                    <div class="form-group">
                        <label class="col-lg-4">Value</label>
                        <input type="text" v-model="ncr.value">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Due Date</label>
                        <input type="date" v-model="ncr.due_date" style="width: 63%;">
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Responsible</label>
                        <input type="text" v-model="ncr.responsible" disabled>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Re-assign</label>
                        <div class="dropdown" style="margin-left: 34%; margin-top:-30px"> <!--class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"-->
                        <select style="width: 63%; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                
                        </select>
                        <div :class="{'dropdown-menu' : true, 'show': show}" >
                            <a class="dropdown-item" v-for="user in users" :key="user.id"><input type="checkbox" :value="user.name" v-model="ncr.responsible"> {{user.name}}</a>
                            
                        </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-lg-4">Logged By</label>
                        <input type="text" v-model="ncr.logged_by">
                    </div>
                </div>
                </div>
            </form>
        </b-tab>
            </b-tabs>
        </b-card>
    </div>

    <center>
        <b-button  style="margin-top: 1%; margin-bottom: 1%"  @click="saveNCR()">Save</b-button>
    </center>
        
  
</div>
</template>

<script>

//import x from '../../../../tech-system-backend/uploads'
import { component as Viewer } from 'v-viewer';
import 'viewerjs/dist/viewer.css'
import { confirmed } from 'vee-validate/dist/rules';

export default {
   middleware: ['auth-guard'],
   props: ['ncrObj'],
   components: { Viewer },
   data() {
       return {
           show_images: false,
           ncr: {},
           show: false,
           oldNCR: {},
           changes: {},
           documents: [],
           users: [{id: 1, name: 'Chetan', email: 'chetan@regentlight.co.za'},
                    {id: 2, name: 'Design', email: 'design@regentlight.co.za'},
                    {id: 3, name: 'Gary', email: 'gary@wahl.co.za'},
                    {id: 4, name: 'Hoxane', email: 'maintenance@regentlight.co.za'},
                    {id: 5, name: 'Kenneth', email: 'kenneth@regentlight.co.za'},
                    {id: 6, name: 'Fisokuhle', email: 'testlab@wahl.co.za'},
                    {id: 7, name: 'Sales', email: 'sales@regentlight.co.za'},
                    {id: 8, name: 'Themba', email: 'themba@regentlight.co.za'},
                    {id: 9, name: 'Theo', email: 'theo@regentlight.co.za'},
                    {id: 10, name: 'Thomas', email: 'Thomas@wahl.co.za'},
                    {id: 11, name: 'Wayne', email: 'wayne.j@regentlight.co.za'},
                    {id: 12, name: 'Welcome', email: 'welcome.m@regentlight.co.za'},
                    {id: 13, name: 'kentest', email: 'nk.fuze@gmail.com'}],
          images: [],
          path: '',
          view_images: false,
          slide: 0,
          sliding: null,
          products: [],
          oldProducts: [],
          components: [],
          //new_components: [],
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
          dismissCountDown: 0
       }
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
            next()
        }
   },

   methods: {

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
            window.open('http://it-foundry:3001/uploads/'+path);  //http://it-foundry:3001/uploads/
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

       removeComp(product, component) {
           console.log('product = ', product)
           console.log('component = ', component)
           let index = this.components.findIndex(c => c.product == product && c.component == component)
           let comp = this.oldComponents.find(c => c.product == product && c.component == component)
           console.log('comp = ', comp)
           //console.log('index = ', index)
           if(comp == undefined) {
               this.components.splice(index,1)
           }
           else {
               if(confirm(`Are you sure you want to delete ${component}?`)) {
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
          let comps = this.components.filter(c => c.product == product)
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
                images[i] = `http://it-foundry:3001/uploads/`+images[i]
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
        for(var key in this.ncr) { 
                
                if(this.ncr[key] != this.oldNCR[key]) {
                
                    if(key != 'responsible') {
                        console.log(`${key} changed from ${this.oldNCR[key]} to ${this.ncr[key]}`)
                        this.changes[key] = this.ncr[key]
                        //this.changes.push(obj) //`${key} = ${this.ncr[key]}`
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
        this.prod_changes = []
        for(let i = 0; i<this.products.length; i++) {
            //delete this.products[i]['email']
            let obj = {}
            let push = false
            for(var key in this.products[i]) {
               if(key != 'report' && key != 'toggle_report' && key != 'training_reg' && key != 'toggle_training_reg' && key != 'training_doc' && key != 'toggle_training_doc' && key != 'other' && key != 'toggle_other') {
                    if(this.products[i][key] != this.oldProducts[i][key]) {
                        console.log('key = ', key)
                        changed = true
                        push = true
                        obj[key] = this.products[i][key]
                        console.log(`${key} has changed from ${this.oldProducts[i][key]} to ${this.products[i][key]}`)
                        //this.prod_changes.push(obj)
                    }
               }
            }
            if(push) {
                obj.id = this.products[i].id
                this.prod_changes.push(obj)
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
        if(this.files.length>0) {
            changed = true
        }
        console.log('this.changes = ', this.changes)
        console.log('this.comp_changes = ', this.comp_changes)
        console.log('this.prod_changes = ', this.prod_changes)
        return changed
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
               
               
                for(let i = 0; i<this.new_comps.length; i++) {
                    console.log(`posting new component ${this.new_comps[i].component}`)
                    await this.$axios.$post('/add_component', this.new_comps[i])
                }

                for(let i = 0; i<this.del_comps.length; i++) {
                    console.log(`Deleting component ${this.del_comps[i].component}`)
                    await this.$axios.$post('/delete_component', this.del_comps[i])
                }
                
                let formData = new FormData();
                let append = false
                for(let i = 0; i<this.files.length; i++) { //if there are files
                    append = true
                    let ref = this.files[i].ref.replace(/[0-9]/g, '');
                    formData.append("file", this.files[i])
                    formData.append('id', this.files[i].id)
                    formData.append('ref', ref)
                }
                if(append) {
                    await this.$axios.$post('/ncr_upload', formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                                })
                }

               this.files = []

               await this.loadNCR()

               this.$emit('reloadNCRs')

               this.showAlert()
           }  
       },

        async loadNCR() {
        let oldNCR = await this.$axios.$get(`/ncr/${this.$route.params.index}`)
        this.oldNCR = oldNCR[0]
        this.oldProducts = await this.$axios.$get(`/ncr_products/${this.$route.params.index}`)
        this.oldComponents = await this.$axios.$get(`/ncr_components/${this.$route.params.index}`)

        for(let i = 0; i<this.oldProducts.length; i++) {
            this.products[i] = Object.assign({}, this.oldProducts[i])
        }
        for(let i = 0; i<this.oldComponents.length; i++) {
            this.components[i] = Object.assign({}, this.oldComponents[i])
        }

        for(let i = 0; i<this.products.length; i++) {
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
                this.images[i] = `http://it-foundry:3001/uploads/`+this.images[i]
            }
        },


   },

  

   created: async function() {
       await this.loadNCR()
   }
}
</script>

<style scoped>

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
  background-color: rgb(171, 171, 171);
  margin: 2% auto; /* 15% from the top and centered */
  padding: 0px;
  border: 1px solid #888;
  width: 90%; /* Could be more or less, depending on screen size */
  height: 95%;
  word-wrap: break-word;
}

.close {
  color: rgb(255, 255, 255);
  float: right;
  font-size: 45px;
  font-weight: bold;
  margin-left: 95%;
}


.close:hover,
.close:focus {
  color: black;
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