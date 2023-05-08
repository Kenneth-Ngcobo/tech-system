<template>
<div>
    <form>
        <span class="close" @click="$emit('closeLog')">&times;</span>
        <center>
             <h4>Log Non-conformance</h4>
        </center>
        <div>
        <div class="col-lg-6 float-left">
            <div class="form-group">
                <label class="col-md-4">Type</label>
                <select style="width: 250px; height:30px" v-model="ncr.type">
                    <option value="Site">Site</option>
                    <option value="Internal">Internal</option>
                </select>
            </div>
            <div class="form-group" v-if="ncr.type == 'Internal'">
                <label class="col-md-4">Department</label>
                <select style="width: 250px; height:30px" v-model="ncr.department">
                    <option value="Production">Design</option>
                    <option value="Production">Controls</option>
                    <option value="Production">Production</option>
                    <option value="Site">Foundry</option>
                    <option value="Site">Sales</option>
                    <option value="Stores">Stores</option>
                    <option value="Stores">Technical</option>
                    <option value="Stores">Recieving</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-md-4">Product</label>
                <input type="text" v-model="ncr.product">
            </div>
            <div class="form-group">
                <label class="col-md-4">Affected Components</label>
                <textarea name="" id="" cols="32" rows="3" v-model="ncr.components"></textarea>
            </div>
             <div class="form-group">
                <label class="col-md-4">Qty</label>
                <input type="text" v-model="ncr.qty">
            </div>
            
            <div class="form-group">
                <label class="col-md-4">Failure Description</label>
                <textarea name="" id="" cols="32" rows="3" v-model="ncr.failure"></textarea>
            </div>
            <div class="form-group">
                <label class="col-md-4">Reported By</label>
                <input type="text" v-model="ncr.reported_by">
            </div>
            <div class="form-group">
                <label class="col-md-4">Upload Pictures</label>
                <input type="file" ref="pic" accept="image/*" multiple> <!--@change="handleImageUpload()"  multiple-->
            </div>
           
        </div>

         <div class="col-lg-6 float-right">
            
            <div class="form-group">
                <label class="col-md-3">Sales Rep</label>
                <input type="text" v-model="ncr.sales_rep" :disabled="ncr.type != 'Site'">
            </div>
            <div class="form-group">
                <label class="col-md-3">Region</label>
                <select style="width: 250px; height:30px" v-model="ncr.region" :disabled="ncr.type != 'Site'">
                    <option value="JHB">JHB</option>
                    <option value="CPT">CPT</option>
                    <option value="DBN">DBN</option>
                </select>
            </div>
             <div class="form-group">
                <label class="col-md-3">Project/Site Name</label>
                <input type="text" v-model="ncr.project" :disabled="ncr.type != 'Site'">
            </div>
            <div class="form-group">
                <label class="col-md-3">SO</label>
                <input type="text" v-model="ncr.so">
            </div>
             <div class="form-group">
                <label class="col-md-3">Client</label>
                <input type="text" v-model="ncr.client">
            </div>
            <div class="form-group">
                <label class="col-md-3">Supplier</label>
                <input type="text" v-model="ncr.supplier" > <!--:disabled="ncr.type != 'Stores/Recieving'"-->
            </div>
            <div class="form-group">
                <label class="col-md-3">Value</label>
                <input type="text" v-model="ncr.value">
            </div>
            <div class="form-group">
                <label class="col-md-3">Responsible</label>
                <div class="dropdown" style="margin-left: 26%; margin-top:-30px"> <!--class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"-->
                <select style="width: 250px; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        
                </select>
                <div :class="{'dropdown-menu' : true, 'show': show}" >
                    <a class="dropdown-item" v-for="user in users" :key="user.id"><input type="checkbox" :value="user" v-model="ncr.responsible"> {{user.name}}</a>
                   
                </div>
                </div>
            </div>
            <div class="form-group">
                <label class="col-md-3">Due</label>
                <input type="date" :min="today()" v-model="ncr.due_date">
            </div>
         </div>
        </div>
         <div>
            <b-button style="margin: 3% 0 0 40%" @click="logNCR()">Submit</b-button>
         </div>
    </form>
      
    
</div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            ncr: {
                type: '',
                department: '',
                product: '',
                components: '',
                qty: '',
                failure: '',
                reported_by: '',
                sales_rep: '',
                region: '',
                so: '',
                project: '',
                client: '',
                supplier: '',
                responsible: [],
                email: '',
                status: 'open',
                value: '',
                due_date: ''
            },

            images: [],

            users: [{id: 1, name: 'Chetan', email: 'chetan@regentlight.co.za'},
                    {id: 2, name: 'Design', email: 'design@regentlight.co.za'},
                    {id: 3, name: 'Gary', email: 'gary@regentlight.co.za'},
                    {id: 4, name: 'Hoxani', email: 'hoxane@regentlight.co.za'},
                    {id: 5, name: 'Kenneth', email: 'kenneth@regentlight.co.za'},
                    {id: 6, name: 'Lindo', email: 'lindo@regentlight.co.za'},
                    {id: 7, name: 'Sales', email: 'sales@regentlight.co.za'},
                    {id: 8, name: 'Themba', email: 'themba@regentlight.co.za'},
                    {id: 9, name: 'Theo', email: 'theo@regentlight.co.za'},
                    {id: 10, name: 'Thomas', email: 'thomas@regentlight.co.za'},
                    {id: 11, name: 'Wayne', email: 'wayne@regentlight.co.za'},
                    {id: 12, name: 'Welcome', email: 'welcome.m@regentlight.co.za'},
                    {id: 13, name: 'kentest', email: 'nk.fuze@gmail.com'}]
        }
    },

    methods: {

        /*selectUser(name) {
            this.ncr.email = this.users.find(u => u.name == name).email
        },*/
        handleImageUpload() {
            this.images = this.$refs.pic.files
           
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
                let formData = new FormData();
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
    }
    
}
</script>

<style scoped>

input[type="text"],[type="date"] {
    width: 250px
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

</style>