<template>
<div>
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>

    <div class="row">
        <div class="col-md-4">
            <strong>Search: </strong>
            <input type="text" v-model="search" placeholder="Search Records" style="width:50%">
        </div>
        <div class="col-md-4">
        <center>
            <strong style="font-size:13px; margin-top:0.3%">Region :</strong>
            <b-form-select style="width:20%; margin-left:0.5%" v-model="region" @change="filterCalls()"> 
                <b-form-select-option value="" selected>All</b-form-select-option>
                <b-form-select-option value="1020">JHB</b-form-select-option>
                <b-form-select-option value="1785">CPT</b-form-select-option>
                <b-form-select-option value="2005">DBN</b-form-select-option>
            </b-form-select>
    
            <!--b-button v-if="!edit" style="margin-left: 1%" @click="edit = true">Edit</b-button>
            <b-button v-else style="margin-left: 5%" @click="edit = false">Cancel</b-button-->
            <b-button style="margin-left: 1%" @click="saveMaint()">Save</b-button>  
        </center>
        </div>
         <div class="col-md-4">
         </div>
    </div>

    <table class="table table-bordered table-striped" style="font-size:12px; margin-top:1%; width:100%;">
        <thead>
            <th>#</th>
            <th>SO</th>
            <th>NCR</th>
            <th>Cmnt</th>
            <th>Orig Inv.</th>
            <th>Supplied</th>
            <th>Project</th>
            <th>Rep</th>
            <th>Fitting</th>
            <th>Line Note</th>
            <th>By</th>
            <th>Logged</th>
            <th>Due</th>
            <th>Planned Visit</th>
            <th>Team</th>
        </thead>
        <tbody>
            <tr v-for="(r,index) in filterCalls()" :key="index">
                <td>{{index+1}}</td>
                <td><a id="link"><span  @click="sendMaint(r.OrderNum)">{{r.OrderNum}}</span></a></td> <!--/maint/${r.OrderNum}`--ncr/maint-->
                <td v-if="findNCR(r.OrderNum).bol"><nuxt-link :to="`/ncr/${findNCR(r.OrderNum).ncr_no}`" target="_blank">{{findNCR(r.OrderNum).ncr_no}}</nuxt-link></td>
                <td v-else style="text-align:center"><i class="fa fa-plus" @click="addNCR(r)"></i></td>
                <!--td v-else><b-button @click="addNCR(r)" style="font-size:10px">Add</b-button></td-->
                <!--td><b-button @click="view = true" style="font-size:10px">View</b-button></td-->
                <td v-if="findRec(r.AutoIndex)" style="text-align:center">
                    <i v-if="findRec(r.AutoIndex).comment != null" class="fa fa-eye" @click="addComment(r.AutoIndex)"></i>
                    <i v-else class="fa fa-plus" @click="addComment(r.AutoIndex)"></i>
                </td>
                
                <td style="width:5%; word-break:break-all">{{r.ExtOrderNum}}</td>
                <td v-if="r.InvDate">{{r.InvDate.split("T")[0]}}</td>
                <td v-else></td>
                <td>{{r.ProjectName}}</td>
                <td>{{r.Code}}</td>
                <td style="white-space:pre-wrap; word-wrap:break-word" v-html="productName(r)"></td>
                <td style="width:18%; word-wrap:break-word">{{r.LineNote}}</td>
                <td>{{r.cAgentName}}</td>
                <td>{{r.OrderDate.split("T")[0]}}</td>
                <td>{{r.DueDate.split("T")[0]}}</td>
                <td v-if="findRec(r.AutoIndex)"><input type="date" :class="{date: findRec(r.AutoIndex).planned_date != null}" v-model="findRec(r.AutoIndex).planned_date"></td>
                <td v-if="findRec(r.AutoIndex)" style="width:13%">
                    <!--multiselect style="width:100%"  
                        v-model="findRec(r.AutoIndex).team" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" 
                        label="name" track-by="name" :hide-selected="true" :options="team" :multiple="true" :taggable="true" >
                    </multiselect-->
                    <div class="dropdown" > 
                    <input type="text" style="width:85%; font-weight:bold"  v-model="findRec(r.AutoIndex).team"><select style="wdith:10%; margin-left:1%" @click="Show(r.AutoIndex)" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false"></select> 
                    <div :class="{'dropdown-menu' : true, 'show': r.AutoIndex == show}" style="width:150px">
                        <a class="dropdown-item" v-for="t in team" :key="t"><input type="checkbox" @click="Select(findRec(r.AutoIndex), t, $event)" :checked="Checked(t,findRec(r.AutoIndex))"> {{t}}</a>       
                    </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    

    <div v-if="log" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content" style="width:95%">
            <log-issue @closeLog="closeLog" :fittings="fittings" :ncr_prop="ncr_prop" :products_prop="products_prop"></log-issue>
        </div>
    </div>

    <div v-if="view" id="myModal" class="modal">
        <!-- Modal content -->
        
        <div class="modal-content" style="width:50%">
            <table style="width:100%">
                <tr>
                    <td style="width:33.3%"></td>
                    <td style="width:33.3%; text-align: center; font-weight:bold"><span>Comment</span></td>
                    <td style="width:33.3%"><span @click="view = false" class="close">&times;</span></td>
                </tr>
                <tr><td style="height:10px"></td></tr>
                <tr >
                    <td colspan="3"><textarea name="" id="" style="width:100%" rows="10" v-model="record.comment"></textarea></td>
                </tr>
                <tr>
                    <td colspan="3"><center><b-button style="margin-top:1%;" @click="saveMaint()">SAVE</b-button></center>
                        </td>
                </tr>
            </table>
           
        </div>
    </div>
    

</div>
</template>

<script>
import { ServerTable, ClientTable } from 'vue-tables-2';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import logIssue from '../../components/ncr/logIssue2'
export default {
    components: { ClientTable, Multiselect, logIssue },
    props: ['fittings', 'joined_ncr', 'rec', 'new_rec', 'my_rec', 'my_orig_rec'],

    data() {
        return {
            //rec: [],
            //team: [{id: 0, name:'Phakamani'},{id: 0, name:'Senzo'},{id: 0, name:'Andrew'},{id: 0, name:'Zaine'},{id: 0, name:'Julian'}],
            team: ['Andrew','Judia','Lightson','Matsome','Mlamuleli','Phakamani','Senzo','Sifiso','Sizwe','Zain'],
            /*my_rec: [],
            new_rec: [],*/
            changes: [],
            region: '',
            edit: false,
            //my_orig_rec: [],
            show: '',
            ncr_prop: {},
            products_prop: [],
            record: {},
            view: false,
            //joined_ncr: [],
            log: false, 
            search: '',
            columns: ['#','OrderNum', 'NCR', 'ExtOrderNum', 'ProjectName', 'Code', 'Fitting', 'LineNote', 'cAgentName', 'OrderDate', 'DueDate', 'Planned Visit', 'Team'],
            options: {
                headings: { ExtOrderNum: 'Orig. Inv', Code: 'Rep', ProjectName: 'Project', cAgentName: 'Looged By' },
                columnsDropdown: true,
                saveState: true,
                storage: 'session',
                dateFormat: 'DD/MM/YYYY',
                perPageValues: [4,10,50,100],
                filterable: true,
                texts: {
                  filterPlaceholder: 'Search Calls'
                },

            }, //END OF OPTIONS
            stock_items: []

        }
    },

    methods: {

        addComment(AutoIndex) {
            this.view = true
            this.record = this.my_rec.find(r => r.AutoIndex == AutoIndex)
        },

        Select(rec, t, event) {
            if(event.target.checked) {
                rec.team.push(t)
            }
            else {
                rec.team.splice(rec.team.indexOf(t), 1)
            }
        },

        Checked(t, rec) {
            if(rec.team != undefined) {
                let guy = rec.team.find(r => r == t)
                if(guy != undefined) {
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

        sendMaint(OrderNum) {
            //console.log('sendMaint running')
            let maint = this.rec.find(r => r.OrderNum == OrderNum)
            let my_maint = this.my_rec.find(r => r.OrderNum == OrderNum)
            window.sessionStorage.maint = JSON.stringify(maint)
            window.sessionStorage.my_maint = JSON.stringify(my_maint)
            this.$router.push('/ncr/maint')
            
            //console.log(window.sessionStorage.maint)
        },

        async addNCR(rec) {
            let id = this.findRec(rec.AutoIndex).id
            let prods = await this.$axios.$post('/get_feedback', {id: id})
            this.products_prop = []
            this.ncr_prop.type = 'Site'
            this.ncr_prop.sales_rep = rec.Name
            let region = ''
            if(rec.AccountID == '1020') {
                region = 'JHB'
            }
            if(rec.AccountID == '1785') {
                region = 'CPT'
            }
            if(rec.AccountID == '2005') {
                region = 'DBN'
            }
            this.ncr_prop.region = region
            this.ncr_prop.so = rec.OrderNum
            this.ncr_prop.orig_so = rec.ExtOrderNum
            this.ncr_prop.project = rec.ProjectName
            this.ncr_prop.status = 'open'
            this.ncr_prop.department = ''
            
            let name = rec.Fitting.split(",")
            let qty = rec.Qty.split(",")
            let failures = rec.LineNote.split(",")
            for(let i = 0; i<name.length; i++) {
                this.products_prop[i] = {}
                let find = prods.find(p => p.fitting == name[i])
                let failure = ''
                if(find) {
                    failure = find.feedback
                }
                else {
                    failure = failures[i]
                }
                this.products_prop[i].name = name[i]
                this.products_prop[i].qty = qty[i]
                this.products_prop[i].failure = failure
                this.products_prop[i].wattage = ''
                this.products_prop[i].length = ''
                this.products_prop[i].mounting = ''
                this.products_prop[i].dimming = ''
                this.products_prop[i].bb = false
            }
            this.log = true
        },

        async closeLog() {
            console.log('Close log from called from Pastel page, this emits reloadNCRs to NCR index')
            await this.$emit('reloadNCRs')
            //this.findNCR(this.ncr_prop.so)
            this.log = false
            console.log('About to force update back on pastel page, check joined_ncr')
            this.$forceUpdate()
        },


        findNCR(OrderNum) {
            if(this.joined_ncr) {
                    let ncr = this.joined_ncr.find(n => n.so == OrderNum)
                if(ncr != undefined) {
                    return {bol: true, ncr_no: ncr.ncr_no}
                }
                else {
                    return {bol: false}
                }
            }
            else {
                return {bol: false}
            }
           
        },


        Show(index) {
            if(this.show == index) {
                this.show = ''
            }
            else [
                this.show = index
            ]         
            
        },

       

        async saveMaint() {
            console.log('Save running')
            this.changes = []
            for(let i = 0; i<this.my_rec.length; i++) {
                let orig_rec = this.my_orig_rec.find(r => r.AutoIndex == this.my_rec[i].AutoIndex)
                let obj = {}
                let push = false
                for(var key in this.my_rec[i]) {
                    if(key != 'team') {
                        if(this.my_rec[i][key] != orig_rec[key]) {
                            push = true
                            console.log(`${key} has changed from  ${orig_rec[key]} to ${this.my_rec[i][key]}`)
                            obj[key] = this.my_rec[i][key]
                        }
                    }
                    else {
                        let length = this.my_rec[i].team.length
                        if(this.my_rec[i].team.length < orig_rec.team.length) {
                            length = orig_rec.team.length
                        }
                        for(let j = 0; j<length; j++) {
                            if(this.my_rec[i].team[j] != orig_rec.team[j]) {
                                //console.log(`responsibilty changed`)
                                //this.changes['responsibility'] = 
                                //this.changes.push(`${key} = ${this.ncr[key]}`)
                                obj['team'] = JSON.stringify(this.my_rec[i].team).replace(/[\[\]]+/g, "").replace(/"/g, "")
                                console.log('updated changes with responsible = ', this.changes)
                                push = true
                            }  
                        }
                        
                    } 
                    
                }
                if(push) {
                    obj.id = this.my_rec[i].id
                    this.changes.push(obj)
                }
            }

           if(this.changes.length > 0) {
                await this.$axios.$post('/save_maint', {changes: JSON.stringify(this.changes)})
        
                this.$emit('loadPastelNCR')
            }
            this.view = false
        },

        productName(r) {
             let name = ""
            if(r.Fitting != null) {
                let name_arr = r.Fitting.split(",")
                let qty_arr = r.Qty.split(",")
            
                for(let i = 0; i<name_arr.length; i++) {
                    if(i == 0) {
                        name = `<strong>${qty_arr[i]}</strong>` + ' x ' + name_arr[i] + '\n'
                    }
                    else {
                        name = name + `<strong>${qty_arr[i]}</strong>` + ' x ' + name_arr[i] + '\n'
                    }
                    
                }
            }
            
            return name
        },

        filterCalls() {
            let new_rec = this.rec
            if(this.region.length == 0) {
                 new_rec = new_rec
            }
            if(this.region.length > 0) {
                new_rec = new_rec.filter(r => r.AccountID == this.region)
            }
            if(this.search.length>0) {
                return new_rec.filter(r => 
                
                    {
                    let project = ""
                    if(r.ProjectName != null) {
                        project = r.ProjectName.toString().toLowerCase()
                    }
                    
                    let fitting = r.Fitting.toString().toLowerCase()
                    let so = r.OrderNum.toString().toLowerCase()
                   
                    
                    const searchTerm = this.search.toLowerCase();

                    return project.includes(searchTerm) || fitting.includes(searchTerm) || so.includes(searchTerm) })
            }

            return new_rec
           
        },

        findRec(AutoIndex) {
            let rec = this.my_rec.find(r => r.AutoIndex == AutoIndex)
            return rec
        },

        findTeam(AutoIndex) {
            let rec = this.my_rec.find(r => r.AutoIndex == AutoIndex)
            if(rec != undefined) {
                return JSON.parse(rec.team)
            }
            else {
                return ''
            }
            
        }
    },

    created: async function() {
       
    }, 

  
}
</script>

<style scoped>

#link {
    color: #007bff;
    
}

#link:hover {
    color: darkblue;
    text-decoration: underline;
    cursor: pointer;
}

.fa-plus:hover {
    color: red
}

.fa-eye:hover {
    color: blue
}

thead {
    position: sticky;
    top: 5px;
    background-color:rgb(13, 14, 14); 
    color:white;
}


.date {
    font-weight:bold;
}

.table th, .table td {
    padding: 0.5rem;
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
    width: 100%;
    /*z-index: inherit*/
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
  color: red;
  text-decoration: none;
  cursor: pointer;
}



</style>