<template>
<div>
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>

    <div v-if="!wait">
    <!--h5>Welcome to testing</h5-->
    <b-button @click="log_modal = true; testObj=undefined;  action = 'add'">Request Test</b-button>
    
    <span style="margin-left: 30%; margin-top: -30px">
        <span style="border: 2px solid grey; border-radius: 10px;">
        <span style="margin: 10px 10px 10px 10px" @click="show = 1">
        <input type="radio"  value="1" @click="show = 1" v-model="show"> <!----v-model="show"----v-on:change="showItems"-->
        <label  for="">Show All</label>
        </span>
        </span>
      <!--div style="margin-left:-100px"-->
      <span style="border: 2px solid grey; border-radius: 10px;">
        <span style="margin: 10px 10px 10px 10px" @click="show = 2">
        <input type="radio" value="2"   @click="show = 2" v-model="show"> <!--v-on:change="showItems"-->
        <label   for="">Show Schedule</label>
        </span>
      </span>
      <!--/div-->
      <!--div style="margin-left:-100px"-->
      <span style="border: 2px solid grey; border-radius: 10px;">
        <span style="margin: 10px 10px 10px 10px" @click="show = 3">
        <input type="radio" value="3"  @click="show = 3" v-model="show"> <!--v-on:change="showItems"-->
        <label  for="">Show Test Log</label>
        </span>
      </span>
      <!--/div-->
    </span>

    <div v-if="log_modal" id="myModal" class="modal">
     
    <!-- Modal content -->
    <div class="modal-content">
        <add-test :action="action" :testObj="testObj" @closeModal="closeModal"></add-test>
    </div>
    </div>

     <div v-if="modify" id="myModal" class="modal">
     
    <!-- Modal content -->
    <div class="modal-content">
        <modify-test @closeModal="closeModal" :test="testObj"></modify-test>
    </div>
    </div>

    <div v-if="log_det" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <log-detail @closeModal="closeModal" :log="logObj"></log-detail>
    </div>
    </div>

    <div v-if="view_comment" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        <div>
        <span class="close" @click="view_comment = false">&times;</span>
          <center>
          <h5 style="align-center">Comment</h5>
          </center>
         {{comment}}
         </div>
    </div>
    </div>

    <div v-if="view_reason" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        <div>
        <span class="close" @click="view_reason = false">&times;</span>
          <center>
          <h5 style="align-center">Reason for Test</h5>
          </center>
         {{reason}}
         </div>
    </div>
    </div>

    <div v-if="show_approval" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        <div>
        <span class="close" @click="show_approval = false">&times;</span>
          <center>
            Approved by: {{approved_by}}
            <div v-if="rejection_reason != null">
            Rejection Reason: {{rejection_reason}}
            </div>
          </center>
       
         </div>
    </div>
    </div>
'
    <div v-if="approve_bool" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:40%">
        
        <div>
        <span class="close" style="margin-left 90%" @click="approve_bool = false; approve_test = {}">&times;</span>
         <form style="margin-top:7%">
           <div class="col-lg-12">
           <div class="form-group">
                <label class="col-md-4">Approve</label>
                <select v-model="approve_test.approved" style="width:250px">
                  <option value="" disabled>Please select</option>
                  <option value="YES">Approve</option>
                  <option value="NO">Reject</option>
                </select>
            </div>
            <div class="form-group" v-if="approve_test.approved == 'NO'">
            <label class="col-md-4">Reason For Rejection</label>
            <textarea name="" id="" cols="32" rows="3" v-model="approve_test.rejection_reason"></textarea>
            </div>
            </div>
         </form>
         <center>
          <b-button @click="Approve">Submit</b-button>
         </center>
        </div>
    </div>
    </div>

    <div v-if="details" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <center> 
        <span class="close" @click="details = false">&times;</span>
        <h4 > {{testObj.product_name}} - Test No:{{testObj.id}}</h4>
        </center>
        <form>
            <div> <!--class="col-lg-6 float-left"-->
                <div class="form-group">
                <label class="col-md-3">Test Status</label>
                <select style="width:250px; height:30px" v-model="testObj.status">
                    <option value="" hidden>Please select</option>
                    <option value="Complete">Complete</option>
                    <option value="On-hold">On-hold</option>
                    <option value="In progress">In progress</option>
                </select>
                </div>
                <div class="form-group">
                <label class="col-md-3">Pass/Fail</label>
                <select style="width:250px; height:30px" v-model="testObj.pass">
                    <option value="" hidden>Please select</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                </select>
                </div>
                <div>
                <label class="col-md-3">Comments</label>
                <textarea name="" id="" cols="32" rows="3" v-model="testObj.test_comments"></textarea>
                </div>
                <div>
                <label class="col-md-3">Upload Report</label>
                <input type="file" ref="file" accept=".pdf" @change="handleFileUpload()">
                </div>
                <div v-if="testObj.test == 'Photometric'">
                <label class="col-md-3">Upload IES</label>
                <input type="file" ref="ies" accept=".ies" @change="handleIESUpload()">
                </div> 
          
            </div>
            <b-button style="margin: 2% 0 0 45%" @click="checkMod()">Submit</b-button>
        </form>
        
    </div>
    </div>
   
    <div v-if="show == 1 || show == 2">
    <h5 style="margin-top: 2%">Schedule</h5>
    <div v-if="change" style="margin: -2.5% 0 1% 45%">
    <b-button class="blink" @click="savepriorityrity">Save</b-button>
    <b-button @click="change = false">Cancel</b-button>
    </div>
    <table class="table table-bordered table-hover" style="width:95%; font-size:13px">
        <thead>
            <tr>
                <th style="text-align:center">Prio</th>
                <th style="text-align:center">No.</th>
                <th>Product</th>
                <th>CCT</th>
                <th>Wattage</th>
                <th>Current</th>
                <th>Lens/Cover</th>
                <th>Reason</th>
                <th>Test</th>
                <th>Requested By</th>
                <th>Required On</th>
                <th>Created On</th>
                <th>Modify</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(test,index) in schedule" :key="test.id"
            @dblclick="details = true; testObj = test"
            @contextmenu.prevent="$refs.menu.open($event, test)">
                <td style="text-align:center">{{test.priority}}</td>
                <td style="text-align:center">{{test.id}}</td>
                <td><a href="#" @click="details = true; testObj = test">{{test.product_name}}</a></td>
                <td>{{test.cct}}K</td>
                <td>{{test.wattage}}</td>
                <td>{{test.current}}</td>
                <td>{{test.lens_cover}}</td>
                <td><b-button  @click="view_reason = true; reason = test.reason" style="font-size:12px">View</b-button></td>
                <td>{{test.test}}</td>
                <td>{{test.person}}</td>
                <td v-if="test.date_required">{{test.date_required.split('T')[0]}}</td>
                <td v-else>{{''}}</td>
                <td v-if="test.created">{{test.created.split(' ')[0]}}</td>
                <td v-else>{{''}}</td>
                <td><b-button @click="log_modal = true; testObj = test; action = 'modify'" style="font-size:12px">Modify</b-button></td>
            </tr>
        </tbody>
    </table>
    </div>
 
    <div v-if="show == 1 || show == 3">
    <h5 style="margin-top: 2%">Test Log</h5>
    
    <center>
      <label style="font-weight: bold">Filter by Type of Test</label>
      <select v-model="type">
          <option value="All">All</option>
          <option value="Photometric">Photometric</option>
          <option value="Thermal">Thermal</option>
          <option value="IP">IP</option>
          <option value="Electrical">Electrical</option>
           <option value="Dummy">Dummy</option>
      </select>
    </center>
    
  
    <no-ssr placeholder="Loading..."> <!--no-ssr-->
    <v-client-table :data="filter()" :columns="columns" :options="options" name="testlog" style="width:95%; font-size:14px"  @row-dblclicked="doubleClick"> <!--@row-click="doubleClick($event)"-->
        <span slot="#" slot-scope="{row}">
            {{row.id}}
        </span>
        <span slot="product_name" slot-scope="{row}">
            <a href="#" @click="log_det = true; logObj = row">{{row.product_name}} [{{wattage(row.wattage)}} {{row.cct}}K]</a>
        </span>

        <span slot="test" slot-scope="{row}">
          <span v-if="row.test == 'Photometric'">P</span>
          <span v-if="row.test == 'Thermal'">T</span>
          <span v-if="row.test == 'IP'">IP</span>
          <span v-if="row.test == 'Electrical'">E</span>
        </span>

       <span slot="reason" slot-scope="{row}" style="text-align: center">
            <div>
              <i class="fa fa-eye"  @click="view_reason = true; reason = row.reason"></i>
            </div>
        </span>

        <span slot="current" slot-scope="{row}">
            {{current(row.current)}}
        </span>

        <span slot="test_date" slot-scope="{row}">
            {{row.test_date.split(" ")[0]}}
        </span>

        <span slot="test_comments" slot-scope="{row}" style="text-align: center">
          <div v-if="row.test_comments != 'null'">
            <i class="fa fa-eye" @click="view_comment = true; comment = row.test_comments"></i>
          </div>        
        </span>
        <span slot="report" slot-scope="{row}" style="text-align: center">
           <div>
            <i class="fa fa-file-pdf-o" style="font-size:25px;color:red" @click="openReport(row.report)"></i>
           </div>
        </span>

        <span slot="ies" slot-scope="{row}">
            <i v-if="row.ies != null" class="fa fa-download" aria-hidden="true"  @click="openIES(row.ies)"></i>
        </span>

        <span slot="approved" slot-scope="{row}" @dblclick="show_approval = true; approved_by = row.approved_by; rejection_reason = row.rejection_reason">
            {{row.approved}}
        </span>
        
        <span slot="approve" slot-scope="{row}" v-if="isAdmin">
          <b-button @click="approve_bool = true; approve_test = row" style="font-size:12px">Approve</b-button>
        </span>
        <span slot="approve" v-else>
          N/A
        </span>
    </v-client-table>
  </no-ssr> <!--/no-ssr-->
    </div>

    <vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <template v-if="$auth.user.role == 'tester' || $auth.user.role == 'admin'">
        <li v-on:click.prevent="moveUp(data)"><a>Move Up</a></li>
        <li v-on:click.prevent="details = true; testObj = data;"><a>Finish Test</a></li>
        <!--li v-on:click.prevent="tableResize()"><a>Put On Hold</a></li-->
        <li v-on:click.prevent="Delete(data)"><a>Delete</a></li>
      </template>
        
   </vue-context>
</div>
<div v-else class="d-flex justify-content-center">
<div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>
</div>
</div>
</template>

<script>
import addTest from '../../components/testing/addTest'
import modifyTest from '../../components/testing/modifyTest'
import logDetail from '../../components/testing/logDetail'
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css'
import { ServerTable, ClientTable } from 'vue-tables-2';
import {mapGetters} from 'vuex'
import LogDetail from '../../components/testing/logDetail.vue';
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
    middleware: ['auth'], //, 'tech'
    components: { addTest, modifyTest, logDetail, VueContext, ClientTable},
    data() {
        return {
            type: 'All',
            log_modal: false,
            action: "",
            add_test: false,
            show: '1',
            modify: false,
            wait: false,
            approve_bool: false,
            approve_test: {},
            log_det: false,

            /*approve: {
              id: '',
              approve: '',
              rejection_reason: null,
              person: '',
              email: '',
              product_name: ''
            },*/
            show_approval: false,
            approved_by: '',
            rejection_reason: null,
            testObj: {},
            logObj: {},
            tests: [],
            schedule: [],
            test_log: [],
            reports: [],
            details: false,
            testObj: {},
            testMod: {
                status: '',
                pass: '',
                comments: '',
                file: null,
                ies: null
            },
            view_comment: false,
            comment: '',
            view_reason: false,
            reason: '',
            change: false,
            columns: ['#','product_name', 'lens_cover', 'current', 'test', 'pass', 'test_date','person','reason','test_comments','report', 'ies','approved'],
            options: {
                headings: {ies: 'IES', test_comments: 'Comments', approved: 'Aprd', current: 'mA', lens_cover: 'Optics'},
                columnsDropdown: true,
                saveState: true,
                dateFormat: 'DD/MM/YYYY',
                perPageValues: [4,10,50,100],
                texts: {
                  filterPlaceholder: 'Search Products'
                },

            } //END OF OPTIONS
        }
    },
    computed: {
       ...mapGetters({
           isLoggedIn: 'user/isLoggedIn',
           isAdmin: 'user/isAdmin'
       })
   },
    methods: {

        async Delete(data) {
          if(confirm(`Are you sure you want to delete ${data.product_name}?`)) {
               await this.$axios.$post('/delete_test', {id: data.id})
               await this.loadTests()
          }
          else {

          }
        },

        filter() {
          if(this.type != 'All') {
            return this.test_log.filter(t => t.test == this.type)   
          }
          else {
            return this.test_log
          }
             
        },

        wattage(wattage) {
           if(wattage.includes('W')) {
              return wattage
           }
           else {
             return wattage+'W'
           }
        },

        current(current) {
          if(current != "") {
            if(current.includes('A') || current.includes('a')) {
              return current
            }
            else {
              return current+'mA'
            }
          }
          else {
            return ''
          }
        },

        doubleClick(event) {
          console.log('event = ', event)
          alert('Double clicked')
        },

        async Approve() {
           this.approve_test.approved_by = this.$auth.user.username
           await this.$axios.$post('/approve', this.approve_test)
           await this.loadTests()
           this.approve_test = {}
           this.approve_bool = false
        },

        async savepriorityrity() {
            for(let i = 0; i<this.schedule.length; i++) {
                await this.$axios.$post('/update_priority', this.schedule[i])
                if(i == 0) { //this.schedule.length-1
                  this.$axios.$post('/update_notifier', this.schedule[i])
                }
            }
            this.change = false

        },

        moveUp(data) {
            
            if(data.priority>1) {
                this.change = true
                this.schedule[data.priority-2].priority = Number(this.schedule[data.priority-2].priority) + 1
                data.priority = data.priority - 1
                this.schedule.sort((a,b) => a.priority - b.priority)
                //this.$forceUpdate()
            }
            
        },

        async openReport(path) {
            //uploads/file-1618943984147-AQUA%20FITTING%20THERMAL%20REPORT.docx
            /*let res = await this.$axios.$post('/sendMePDF', {path: path})
            console.log(typeof res)
            window.open("data:application/pdf," + escape(res)); */ 
            //window.open('C:\\Users\kenneth\\tech-system\\tech-system-backend\\uploads\\'+path)
            window.open('http://localhost:2000/uploads/'+path);  //http://it-foundry:3001/uploads/ //localhost:2000/uploads/
        },

        openIES(path) {
            //uploads/file-1618943984147-AQUA%20FITTING%20THERMAL%20REPORT.docx

            window.open('http://localhost:2000/uploads/'+path);  //http://it-foundry:3001/uploads/ 
        },

        handleFileUpload: function() {
            this.testObj.file = this.$refs.file.files[0];
           
        },
        handleIESUpload: function() {
            this.testObj.ies = this.$refs.ies.files[0];
          
        },
        async closeModal() {
            await this.loadTests()
            this.log_modal = false
            this.add_test = false
            this.modify = false
            this.log_det = false
            //this.tests = await this.$axios.$get('/testing')
        },

        async checkMod() {

          if(this.testObj.test == 'Photometric') {

              if(this.testObj.ies && this.testObj.file) {
                await this.modifyTest()
              }
              else {
                alert("Please upload both PDF report and IES file")
              }
          }

          else {
            if(this.testObj.file) {
              await this.modifyTest()
            }
            else {
              alert("Please upload PDF report")
            }
          }

        },

        async modifyTest() {
              //$auth.user.email
             
                this.wait = true
                this.details = false
                let formData = new FormData();
                formData.append("file", this.testObj.file);
                formData.append("ies", this.testObj.ies);
                formData.append("status", this.testObj.status)
                formData.append("pass", this.testObj.pass)
                formData.append("test_comments", this.testObj.test_comments)
                formData.append("id", this.testObj.id)
                formData.append("product_name", this.testObj.product_name)
                formData.append("test_date", this.dateNow())

                await this.$axios.$post('/modify_test', formData, {
                  headers: {
                  "Content-Type": "multipart/form-data"
                  }
                })
                for(let i = 0; i<this.schedule.length; i++) {
                  this.schedule[i].priority = this.schedule[i].priority - 1
                  await this.$axios.$post('/update_priority', this.schedule[i])
              }
              await this.loadTests()
              this.wait = false
            },
        
              
        

        dateNow(){
            /*let yr = new Date().getFullYear()
            let mth = ('0' + (new Date().getMonth()+1)).slice(-2) 
            let dt = ('0' + new Date().getDate()).slice(-2)*/
            return new Date().toISOString().slice(0, 19).replace('T', ' ');

        },

        async loadTests() {
            this.tests = await this.$axios.$get('/testing')
            this.schedule = this.tests.filter(t => t.status != 'Complete')
            for(let i = 0; i<this.schedule.length; i++) {
                if(this.schedule[i].priority == null) {
                    this.schedule[i].priority = i+1
                }
                
            }
            this.schedule.sort((a,b) => a.priority - b.priority)
            this.test_log = this.tests.filter(t => t.status == 'Complete')
        }
    },

    created: async function() {
        await this.loadTests()
        if(this.isAdmin) {
          this.columns.push('approve')
        }
        //this.reports = await this.$axios.$get('/reports')
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
  margin: 10% auto; /* 15% from the top and centered */
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

.blink {
  animation: blink 1s steps(1, end) infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}



</style>