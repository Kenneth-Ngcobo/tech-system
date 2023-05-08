<template>
<div>
    <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>
    <center>
        <b-button v-if="!edit" @click="edit = true">Edit</b-button>
        <b-button v-else @click="edit = false">Cancel</b-button>
        <b-button @click="saveChanges()">Save</b-button>
    </center>
    <table class="table table-bordered table-hover table-striped" style="width:95%; margin-top:1%; font-size:13px">
        <thead>
            <tr>
                <th rowspan="2">#</th>
                <th rowspan="2">Code</th>
                <th>Description  </th>
                <template v-if="!schedule">
                    <th>Type</th>
                    <th rowspan="2">Forward Voltage</th>
                    <th rowspan="2">RLS Stock</th>
                    <th rowspan="2">Qty on PO</th>
                    <th rowspan="2">Latest Cost</th>
                    <th>Supplier</th>
                    <th rowspan="2">
                        <template>{{findMonth(month-1)}}</template>
                    </th>
                    <th rowspan="2">
                        <template>{{findMonth(month)}}</template>
                    </th>
                    <th rowspan="2">
                        <template>{{findMonth(month+1)}}</template>
                    </th>
                    <th rowspan="2" @click="schedule = true">
                        <template>{{findMonth(month+2)}} <i v-if="!schedule" class="fas fa-arrow-left" ></i>
                       
                        </template>
                    </th>
                </template>
                <template v-else v-for="m in 12" >
                    <th rowspan="2" :key="m" >
                        <template>{{findMonth(month+(m-1))}} <i @click="schedule = false" v-if="schedule && m == 1" class="fas fa-arrow-right" ></i>
                        <span v-if="month+(m-1)>12">{{year+1}}</span>
                        <span v-else>{{year}}</span>
                        </template>
                    </th>
                </template>
                
            </tr>
            <tr>
                <th><input type="text" placeholder="Seach" style="width:95%" v-model="filter.search"></th>
                <template v-if="!schedule">
                    <th>
                        <select v-model="filter.type" @change="filterDrivers()">
                            <option value="All" selected>All</option>
                            <option v-for="t in type" :key="t">{{t}}</option>
                        </select>
                    </th>
                    <th>
                        <select v-model="filter.supplier" @change="filterDrivers()">
                            <option value="All" selected>All</option>
                            <option v-for="s in suppliers" :key="s">{{s}}</option>
                        </select>
                    </th>
                </template>

            </tr>
           
        </thead>
        <draggable v-model="filterDrivers" tag="tbody" >
            <tr v-for="(driver,index) in filterDrivers()" :key="driver.id"
             @contextmenu.prevent="$refs.menu.open($event, driver)">
                <td style="width:3%">{{index+1}}</td>
                <td style="width:6%"  v-if="!edit">{{driver.code}}</td>
                <td style="width:6%;" id="mod" v-else><input type="text" style="width:100%;" v-model="driver.code"></td>
                <td style="width:23%" v-if="!edit">{{driver.description}}</td>
                <td style="width:23%" id="mod" v-else><input type="text"  style="width:100%" v-model="driver.description"></td>
                <template v-if="!schedule">
                    <td style="width:7%" v-if="!edit">{{driver.type}}</td>
                    <td style="width:7%" id="mod" v-else>
                        <input type="text" style="width:100%" v-model="driver.type">
                        <!--select v-model="driver.type">
                            <option v-for="t in type" :key="t" :value="t">{{t}}</option>
                        </select-->
                    </td>
                    <td style="width:20%" v-if="!edit">{{driver.vf}}</td>
                    <td style="width:20%" id="mod" v-else><input type="text" style="width:100%" v-model="driver.vf"></td>
                    <td style="width:6%">{{findStock(driver.code).Qty_On_Hand}}</td>
                    <td style="width:6%">{{findStock(driver.code).QtyOnPO}}</td>
                    <td style="width:7%">R {{Math.round(findStock(driver.code).LatUCst)}}</td>
                    <td style="width:7%" v-if="!edit">{{driver.supplier}}</td>
                    <td style="width:7%" id="mod" v-else><input type="text" style="width:100%" v-model="driver.supplier"></td>
               
                    <td v-if="!edit" style="background-color:#F8F8FF; width:4%">{{driver[findMonth(month-1)]}}</td>
                    <td v-else id="mod" style="background-color:#F8F8FF; width:4%"><input type="text" style="width:100%" v-model="driver[findMonth(month-1)]"></td>
                    <td v-if="!edit" style="background-color:#00FF7F;width:4%">{{driver[findMonth(month)]}}</td>
                    <td v-else id="mod" style="background-color:#00FF7F;width:4%"><input type="text" style="width:100%" v-model="driver[findMonth(month)]"></td>
                    <td v-if="!edit" style="background-color:#FFFFE0;width:4%">{{driver[findMonth(month+1)]}}</td>
                    <td v-else id="mod" style="background-color:#FFFFE0;width:4%"><input type="text" style="width:100%" v-model="driver[findMonth(month+1)]"></td>
                    <td v-if="!edit" style="background-color:#FFFFE0;width:4%">{{driver[findMonth(month+2)]}}</td>
                    <td v-else id="mod" style="background-color:#FFFFE0;width:4%"><input type="text" style="width:100%" v-model="driver[findMonth(month+2)]"></td>
                </template>
                <template v-else v-for="m in 12">
                    <td :key="m" v-if="!edit" 
                        style="width:4%; text-align: center"
                        :class="{ green: m-1==0, yellow: m-1>0 && month+(m-1) <=12, grey: month+m+1>12 }">
                        {{driver[findMonth(month+(m-1))]}}</td>
                    <td :key="m" v-else id="mod" style="width:4%"
                    :class="{ green: m-1==0, yellow: m-1>0 && month+(m-1) <=12, grey: month+m+1>12 }">
                    <input type="text" style="width:100%" v-model="driver[findMonth(month+(m-1))]"></td>
                </template>
            </tr>
        </draggable>
    </table>

    <vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <!--ul-->
        <template v-if="data">
        <li><a @click="Copy(data)">Copy</a></li>
        <li v-if="!edit" @click="edit = true"><a>Edit</a></li>
        <li v-else @click="edit = false"><a>Cancel</a></li>
        <li v-on:click.prevent="addNew()"><a>Add New</a></li>
        <li v-on:click.prevent="deleteDriver(data)"><a>Delete</a></li>
        <li @click="saveChanges()"><a>Save</a></li>
        </template>
      <!--/ul-->   
   </vue-context>

</div>
</template>

<script>

import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css'
export default {

    middleware: ['auth'],

    components: { VueContext },

    data() {
        return {
            drivers: [],
            orig_drivers: [],
            sage_drivers: [],
            type: [],
            suppliers: [],
            filter: {
                search: "",
                type: "All",
                supplier: "All"
            },
            month: '', //7 columns before month
            year: '',
            edit: false,
            changes: [],
            schedule: false
        }
    },

    methods: {

        addNew() {
            this.drivers.push({})
            window.scrollTo(0, document.body.scrollHeight);
            this.edit = true
        },

        async deleteDriver(driver) {
            if(confirm(`Are you sure you want to delete ${driver.description}?`)) {
                driver.active = false
                await this.saveChanges()
            }
        },

        async saveChanges() {
            this.changes = []
            for(let i = 0; i<this.orig_drivers.length; i++) {
                let obj = {}
                let push = false
                for(var key in this.drivers[i]) {
                    if(this.drivers[i][key] != this.orig_drivers[i][key]) {
                        push = true
                        obj[key] = this.drivers[i][key]
                    }
                }
                if(push) {
                    obj.id = this.drivers[i].id
                    this.changes.push(obj)
                }
            }
            console.log(this.changes)
            if(this.changes.length>0) {
                await this.$axios.$post('/driver_stock_changes', {changes: JSON.stringify(this.changes)})
            }
            for(let i = this.orig_drivers.length; i<this.drivers.length; i++) {
                console.log('New product = ', this.drivers[i])
                await this.$axios.$post('/add_driver', this.drivers[i])
            }

            this.drivers = await this.$axios.$get('/driver_stock')
            this._drivers = JSON.parse(JSON.stringify(this.drivers))
            this.sage_drivers = await this.$axios.$post('/sage_drivers', {drivers: JSON.stringify(this.drivers)})
            this.edit = false
        },

        findMonth(value) {
            if(value>12) {
                value = value-12
            }
            if(value == 1) {
                return 'Jan'
            }
            if(value == 2) {
                return 'Feb'
            }
            if(value == 3) {
                return 'Mar'
            }
            if(value == 4) {
                return 'Apr'
            }
            if(value == 5) {
                return 'May'
            }
            if(value == 6) {
                return 'Jun'
            }
            if(value == 7) {
                return 'Jul'
            }
            if(value  == 8) {
                return 'Aug'
            }
            if(value == 9) {
                return 'Sep'
            }
            if(value == 10) {
                return 'Oct'
            }
            if(value == 11) {
                return 'Nov'
            }
            if(value == 12) {
                return 'Dec'
            }
        },

        filterDrivers() {
            let new_drivers = this.drivers
            if(this.filter.search == "" && this.filter.type == "All" && this.filter.supplier == "All") {
                return new_drivers
            }
            else {
                if(this.filter.type != "All") {
                    console.log(`filtering type = ${this.filter.type}`)
                    new_drivers = new_drivers.filter(d => d.type.toLowerCase() == this.filter.type.toLowerCase())
                }
                if(this.filter.supplier != "All") {
                    new_drivers = new_drivers.filter(d => d.supplier.toLowerCase() == this.filter.supplier.toLowerCase())
                }
                if(this.filter.search != "") {
                    return new_drivers.filter(d => 
                
                    {
                    const part = d.description.toString().toLowerCase();
                    const searchTerm = this.filter.search.toLowerCase();

                    return part.includes(searchTerm) })
                }
            return new_drivers
            }
        },

        findStock(code) {
            let driver = this.sage_drivers.find(d => d.Code == code)
            if(driver != undefined) {
                return driver
            }
            else return {}
        },

        datasheet(url) {
            console.log(url)
        }

        

    },

    created: async function() {
        this.drivers = await this.$axios.$get('/driver_stock')
        this.orig_drivers = JSON.parse(JSON.stringify(this.drivers))
        this.sage_drivers = await this.$axios.$post('/sage_drivers', {drivers: JSON.stringify(this.drivers)})
        this.type = this.drivers.map(item => item.type.trim().toLowerCase()).filter((value, index, self) => self.indexOf(value) === index)
        this.suppliers = this.drivers.map(item => item.supplier.trim()).filter((value, index, self) => self.indexOf(value) === index)
        this.month = new Date().getMonth()+1
        this.year = new Date().getFullYear()

       
    }
    
}
</script>

<style scoped>

.table-hover tbody tr:hover td, .table-hover tbody tr:hover th {
  background-color: yellow;
}

th {
    text-align: center;
    vertical-align: top;
}

#mod {
    padding: 0.75rem 0 0.75rem 0;
}

.green {
    background-color:#00FF7F
}

.grey {
    background-color:#F8F8FF
}

.yellow {
    background-color:#FFFFE0
}

</style>