<template>
<div>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>
    <table class="table table-bordered" style="width:50%">
        <tbody>
            <tr>
                <td style="width:15%"><strong >Search Bin :</strong></td>
                <td colspan="2" style="width:35%"> <model-list-select 
                        :list="bins"
                        v-model="selected.from_bin"
                        option-value="idBinLocation"
                        option-text="cBinLocationName"
                        placeholder="Search Bin"
                        style="width:100%; "> 
                    </model-list-select> 
                </td>
                <!--td style="width:15%"><label >To Bin:</label></td-->
                <td style="width:35%"> <!--model-list-select 
                        :list="bins"
                        v-model="selected.to_bin"
                        option-value="idBinLocation"
                        option-text="cBinLocationName"
                        placeholder="Search Bin"
                        style="width:100%; "> 
                    </model-list-select--> 
                </td>
            </tr>
            <tr>
                <td><strong>Due From</strong></td>
                <td><input type="date" style="width:80%" v-model="selected.from"></td>
                <td><strong>Due To</strong></td>
                <td><input type="date" style="width:60%" v-model="selected.to">
                    <b-button style="float:right" @click="loadSOs()" v-if="!spin">Load</b-button>
                </td>
                <!--td><b-button @click="loadPOs()">Load</b-button></td-->
            </tr>
        </tbody>
    </table>

    <!--table class="table table-bordered">
        <thead>
            <th>OrderNum</th>
            <th>OrderDate</th>
            <th>DueDate</th>
            <th>Code</th>
            <th>Description</th>
            <th>Qty</th>
        </thead>
        <tbody>
            <tr v-for="so in sos" :key="so.idInvoiceLines">
                <td>{{so.OrderNum}}</td>
                <td>{{so.OrderDate.split("T")[0]}}</td>
                <td>{{so.DueDate.split("T")[0]}}</td>
                <td>{{so.Code}}</td>
                <td>{{so.cDescription}}</td>
                <td>{{so.fQuantity}}</td>
            </tr>
        </tbody>
    </table-->

    <div v-if="spin" class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
        </div>
    </div>

    <div class="row" v-if="fittings.length>0">
        <div class="col-lg-9 float-left">
            <label>Filter Orders</label>
            <input type="text" v-model="search">
            <b-button @click="exportExcel()">Export Excel</b-button>
            <table class="table table-bordered" style="font-size:12px; width:100%; margin-top:1%">
                <thead>
                    <th>OrderNum</th>
                    <th>Status  <span class="dropdown" style="float:right" > 
                    <select style="width:20px;" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></select>
                    <div :class="{'dropdown-menu' : true, 'show': show}" style="width:350px">
                        
                        <a class="dropdown-item" style="white-space:normal" v-for="(st,index) in order_status" :key="st.id"><input type="checkbox" :value="st.id" v-model="status[index]" >{{st.status}}</a>       
                    </div>
                    </span></th>
                    <!---<select style="width:20px" @change="filteredFittings" v-model="status"><option :value="st.id" v-for="st in order_status" :key="st.id">{{st.status}}</option></select>---->
                   
                    <th>Rep</th>
                    <th>Project</th>
                    <th>Due <i class="fas fa-sort" @click="sort = !sort; sortFittings('DueDate')"></i></th>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Qty <i class="fas fa-sort" @click="sort = !sort; sortFittings('fQuantity')"></i></th>
                    <th>Length</th>
                </thead>
                <tbody>
                    <tr v-for="fitting in filteredFittings()" :key="fitting.idInvoiceLines">
                        <td>{{fitting.OrderNum}}</td>
                        <td>{{Status(fitting.DocState)}}</td>
                        <td>{{fitting.Rep}}</td>
                        <td>{{fitting.ProjectName}}</td>
                        <td>{{fitting.DueDate.split("T")[0]}}</td>
                        <td>{{fitting.Code}}</td>
                        <td>{{fitting.cDescription}}</td>
                        <td>{{fitting.fQuantity}}</td>
                        <td>{{fitting.length}}</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <div class="col-lg-3 float-right">
            <h6>Summary</h6>
            <table>
                <thead>
                    <th>Tot Length</th>
                </thead>
                <tbody>
                    <tr>
                        <td>{{calcLength()/1000}} m</td>
                    </tr>
                </tbody>

            </table>
        </div>

    </div>

    

    

    
</div>
</template>

<script>
import { ModelListSelect } from 'vue-search-select'
import 'vue-search-select/dist/VueSearchSelect.css'
import XLSX from "xlsx-js-style";

export default {
    components: { ModelListSelect },
    props: ['bins', 'order_status'],
    data() {
        return {
            //bins: [],
            selected: {
                from_bin: '',
                to_bin: '',
                from: '',
                to: ''
            },
            sos: [],
            fittings: [],
            tot_len: 0,
            sort: false,
            search: '',
            //order_status: [],
            status: [],
            spin: false,
            show: false
        }
    },

    methods: {

        Status(DocState) {
            return this.order_status.find(st => st.id == DocState).status
        },

        exportExcel() {
            let export_list = []
            for(let i = 0; i<this.filteredFittings().length; i++) {
                export_list[i] = {}
                export_list[i].OrderNum = this.filteredFittings()[i].OrderNum
                export_list[i].Status = this.Status(this.filteredFittings()[i].DocState)
                export_list[i].Rep = this.filteredFittings()[i].Rep
                export_list[i].Project = this.filteredFittings()[i].ProjectName
                export_list[i].Due = this.filteredFittings()[i].DueDate.split("T")[0]
                export_list[i].Code = this.filteredFittings()[i].Code
                export_list[i].Description = this.filteredFittings()[i].cDescription
                export_list[i].Qty = this.filteredFittings()[i].fQuantity
                export_list[i].Length = this.filteredFittings()[i].length
                export_list[i].Tot_Length =  Number(this.filteredFittings()[i].length)*Number(this.filteredFittings()[i].fQuantity) 
            }
            var sheet = XLSX.utils.json_to_sheet(export_list);
            for(let i in sheet) {
                if(i != '!ref') {
                    //console.log(i)
                    sheet[i].s = {
                        font: {
                            name: 'Arial',
                            sz: 8
                        }
                    }
                }
            }
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, sheet, `${this.search}`);
            XLSX.writeFile(
                wb,
                `${this.bins.find(b => b.idBinLocation == this.selected.from_bin).cBinLocationName} ${this.selected.from} - ${this.selected.to}.xlsx`
            ); // name of the file is 'book.xlsx'
        },

        filteredFittings() {

            let fittings = this.fittings

            if(this.search.length == 0 && this.status.length == 0) {
                return fittings
            }
            else {
                if(this.search.length>0) {
                    fittings = fittings.filter(f => {
                        let description = ""
                        if(f.cDescription != null) {
                            description = f.cDescription.toString().toLowerCase()
                        }
                        let project = ""
                        if(f.ProjectName != null) {
                            project = f.ProjectName.toString().toLowerCase()
                        }
                        let so = ""
                        if(f.OrderNum != null) {
                            so = f.OrderNum.toString().toLowerCase()
                        }
                        let rep = ""
                        if(f.Rep != null) {
                            rep = f.Rep.toString().toLowerCase()
                        }
                        const searchTerm = this.search.toLowerCase()
                        return description.includes(searchTerm) || project.includes(searchTerm) || so.includes(searchTerm) || rep.includes(searchTerm)
                    })
                }
                /*if(this.status>0) {

                    let count = 0
                    for(let i = 0; i<this.status.length; i++) {
                        
                        if(count == 0) {
                            fittings = fittings.filter(f => f.DocState == this.status[i])
                        }
                        else {
                            fittings = fittings.concat(f => f.DocState == this.status[i])
                        }
                        
                            count = count + 1
                    }

                }*/
                return fittings
            }

            /*if(this.search.length>0) {
                return this.fittings.filter(f => 
                {
                    const part = f.cDescription.toString().toLowerCase();
                    const searchTerm = this.search.toLowerCase();
                
                    return part.includes(searchTerm) && f.DocState ==  this.status}
                
                );
            }
            else {
                if(this.status > 0) {
                    return this.fittings.filter(f => f.DocState == this.status)
                }
                else {
                    return this.fittings
                }
                
            }*/

            //else if ()

           
        
        },

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },

        sortFittings(key) {
            console.log(key)
            if(key != 'DueDate') {
                if(this.sort) {
                    this.fittings = this.fittings.sort((a,b) => b[key] - a[key])
                }
                else {
                    this.fittings = this.fittings.sort((a,b) => a[key] - b[key]) 
                }
            }
            else {
                if(this.sort) {
                    this.fittings = this.fittings.sort((a,b) => new Date(b[key]) - new Date(a[key]))
                }
                else {
                    this.fittings = this.fittings.sort((a,b) => new Date(a[key]) - new Date(b[key])) 
                }   
            }
           
            
        },

        calcLength() {
            let tot_len = 0
            this.filteredFittings().forEach(f => {
                let des = f.cDescription.split(" ")
                let index = des.findIndex(el => el.includes("mm"))
                let rect = des.findIndex(el => el.includes("Rect"))
                    
                if(index != -1) { //if mm exists in description
                    let length = des[index].split("mm")[0] //take lengnth

                    if(length.includes("x")) {
                        let lens = length.split("x")
                        let sum = 0
                        for(let i = 0; i<lens.length; i++) {
                            sum = sum + Number(lens[i])
                        }

                        if(rect != -1) {
                            sum = 2*sum
                        }
                       
                        if(typeof sum != 'number') {
                            console.log(f.cDescription)
                            sum = 0
                        }
                        f.length = sum
                    }
                    else {
                        f.length = length.replace(/[^\d.-]/g, '')
                    }
                }
                else {
                    f.length = 0
                }
                tot_len = tot_len+(Number(f.length)*Number(f.fQuantity))

            })
            return tot_len
        },
        
        async loadSOs() {
            this.fittings = []
            this.spin = true
            this.search = ''
            this.status = []
            //this.sos = await this.$axios.$post('/sos', this.selected)
            this.fittings = await this.$axios.$post('/ordered_fitting', this.selected)
            this.spin = false
    
            this.calcLength()
            
        },

        async getBOM() {

        },

       
    },

    created: async function() {
        this.selected.from = this.today()
        /*this.bins = await this.$axios.$get('/bins')
        this.order_status = await this.$axios.$get('/order_status')
        this.order_status.unshift({id: 0, status: 'All'})*/
    
    }
    
}
</script>

<style scoped>

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


</style>