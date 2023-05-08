<template>
<div>
    
    <b-button @click="log = true" style="margin-bottom:1%">Log Issue</b-button>

    <div v-if="log" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content" style="width:95%">
            <log-issue @closeLog="closeLog"></log-issue>
        </div>
    </div>

    <div v-if="view_ncr" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <viewNCR @closeLog="closeLog" :oldNCR="ncrObj"></viewNCR>
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


    <no-ssr placeholder="Loading...">
    <v-client-table :data="ncrs" :columns="columns" :options="options" name="ncrs" style="width:95%; font-size:14px">
        <span slot="#" slot-scope="props">
             {{props.index}}
        </span>


        <span slot="ncr_no" slot-scope="{row}">
            <!--a href="#" @click="view_ncr = true; ncrObj = row">{{row.ncr_no}}</a-->
            <nuxt-link  @click.native="ncrObj = row" :to="`/ncr/${row.ncr_no}`">{{row.ncr_no}}</nuxt-link>
        </span>

        <span slot="products" slot-scope="{row}">
            {{showProducts(row.ncr_no)}}
        </span>

        <span slot="log_date" slot-scope="{row}">
            {{row.log_date.split(" ")[0]}}
        </span>

        <span slot="Site/Dep" slot-scope="{row}">
            <span v-if="row.type == 'Internal'">{{row.department}}</span>
            <span v-if="row.type == 'Site'">{{row.project}}</span>
        </span>

        <span slot="images" slot-scope="{row}" style="text-align: center">
            <div v-if="checkImages(row.ncr_no)"> <!--v-if="row.images != null"-->
            <i class="fa fa-eye"  @click="showImages(row.ncr_no)"></i> <!--loadImages(row.images)-->
            </div>
            <!--div v-else></div-->
        </span>

        <span slot="failure" slot-scope="{row}" style="text-align: center">
            <div>
            <i class="fa fa-eye" @click="view = true; heading = 'Failure'; body = viewSummary(row.ncr_no, 'failure')"></i>
            </div>
        </span>

        <span slot="components" slot-scope="{row}" style="text-align: center">
            <div v-if="showComps(row.ncr_no).length>0">
            <i class="fa fa-eye"  @click="view_comps = true; heading = 'Components'; body = showComps(row.ncr_no)"></i> <!--body = row.components showComps(ncr)-->
            </div>
        </span>

        <span slot="findings" slot-scope="{row}" style="text-align: center">
            <div v-if=" checkFindings(row.ncr_no)">
            <i class="fa fa-eye" @click="view = true; heading = 'Findings'; body = viewSummary(row.ncr_no, 'findings')"></i>
            </div>
        </span>

    </v-client-table>
    </no-ssr>

    <viewer :images="images">
      <img v-for="src in images" :key="src" :src="src">
    </viewer>

    <nuxt-child :ncrObj="ncrObj" :test="test"/>

</div>
</template>

<script>
import logIssue from '../../components/ncr/logIssue2'
import viewNCR from '../../components/ncr/viewNCR.vue'
import { ServerTable, ClientTable } from 'vue-tables-2';
import { component as Viewer } from 'v-viewer';
import 'viewerjs/dist/viewer.css'
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
    props: ['ncrs', 'products', 'components', 'joined_ncr'],
    components: { logIssue, viewNCR, ClientTable, Viewer },

    data() {
        return {
            log: false,
            //ncrs: [],
            view_ncr: false,
            ncrObj: {},
            test: 'Kenneth',
            columns: ['#','ncr_no', 'status', 'Site/Dep', 'products', 'type', 'region','images','failure','components','findings','logged_by','log_date', 'due_date','responsible'], //'findings','corrective_action', 'preventative_action'
            options: {
                headings: {ies: 'IES', components: 'Comps', images: 'Pics', region: 'Reg', logged_by: 'By', status: 'Stat' },
                columnsDropdown: true,
                saveState: true,
                dateFormat: 'DD/MM/YYYY',
                perPageValues: [4,10,50,100],
                texts: {
                  filterPlaceholder: 'Search NCRs'
                },

            }, //END OF OPTIONS
            view: false,
            view_comps: false,
            heading: '',
            body: '',
            images: [],
            view_images: false,
            slide: 0,
            sliding: null
           
        }
    },

    methods: {

        checkImages(ncr_no) {
            let products = this.products.filter(p => p.ncr_no == ncr_no)
            let tot_images = []
            for(let i = 0; i<products.length; i++) {
                let prod_images = []
                if(products[i].images != null) {
                    prod_images = products[i].images.split(',')
                }
                tot_images = tot_images.concat(prod_images)
            }
            if(tot_images.length>0) {
                return true
            }
            else {
                return false
            }
        },

        showImages(ncr_no) {
            let products = this.products.filter(p => p.ncr_no == ncr_no)
            let tot_images = []
            for(let i = 0; i<products.length; i++) {
                let prod_images = []
                if(products[i].images != null) {
                    prod_images = products[i].images.split(',')
                }
                tot_images = tot_images.concat(prod_images)
            }
            console.log(`images for ${ncr_no} = ${tot_images}`)
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

        viewSummary(ncr_no, column) {
            let products = this.products.filter(p => p.ncr_no == ncr_no)
            let value = ''
            let new_values = []
            
                for(let i = 0; i<products.length; i++) {
                    let obj = {}
                    obj.product = products[i].product_name
                    obj.value = products[i][column]
                    new_values.push(obj)
                    if(i == 0) {
                        value = `${products[i].product_name}:  ${products[i][column]}` 
                    }
                    else {
                        value = value + ', ' + `${products[i].product_name}:  ${products[i][column]}`
                    }
                }
            return new_values
        },

        showProducts(ncr) {
         
                let products = this.products.filter(p => p.ncr_no == ncr)
                if(products.length>0 ) {
                    let prod_names = products[0].product_name
                    for(let i = 1; i<products.length; i++) {
                        prod_names = prod_names + ', ' + products[i].product_name
                    }
                    return prod_names
                }
                else {
                    return ''
                }
            
        },

        showComps(ncr) {
           
                let components = this.components.filter(c => c.ncr_no == ncr)
                if(components.length>0 ) {
                    return components
                }
                else {
                    return []
                }
            
        },
    
        async closeLog() {
            //this.ncrs = await this.$axios.$get('/ncr')
            console.log('close clicked')
            this.$emit('reloadNCRs')
            this.log = false
            this.view_ncr = false
            
        },

        clickedNCR(row) {
            this.ncrObj = row
            console.log('ncrObj = ', this.ncrObj)
        }
    },

    
    created: async function() {
        //this.ncrs = await this.$axios.$get('/ncr')
    }
    
}
</script>

<style scoped>


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
  background-color: #fefefe;
  margin: 5% auto; /* 15% from the top and centered */
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