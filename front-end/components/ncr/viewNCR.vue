<template>
<div>
    <form>
        <span class="close" @click="$emit('closeLog')">&times;</span>
        <center>
             <h4>{{ncr.ncr_no}}</h4>
        </center>
        <div class="col-lg-6 float-left">
            <div class="form-group">
                <label class="col-md-4">Type</label>
                <select style="width: 250px; height:30px" v-model="ncr.type">
                    <option value="Production">Production</option>
                    <option value="Site">Site</option>
                    <option value="Stores/Recieving">Stores/Recieving</option>
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
                <input type="text" v-model="ncr.so" :disabled="ncr.type != 'Site'">
            </div>
             <div class="form-group">
                <label class="col-md-3">Client</label>
                <input type="text" v-model="ncr.client" :disabled="ncr.type != 'Site'">
            </div>
            <div class="form-group">
                <label class="col-md-3">Supplier</label>
                <input type="text" v-model="ncr.supplier" :disabled="ncr.type != 'Stores/Recieving'">
            </div>
            <div class="form-group">
                <label class="col-md-3">Responsible</label>
                <div class="dropdown" style="margin-left: 26%; margin-top:-30px"> <!--class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"-->
                <select style="width: 250px; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        
                </select>
                <div :class="{'dropdown-menu' : true, 'show': show}" >

                    <a class="dropdown-item"><input type="checkbox" value="Chetan" v-model="ncr.responsible"> Chetan</a>
                    <a class="dropdown-item"><input type="checkbox" value="Design" v-model="ncr.responsible"> Design</a>
                    <a class="dropdown-item"><input type="checkbox" value="Hoxani" v-model="ncr.responsible"> Hoxani</a>
                    <a class="dropdown-item"><input type="checkbox" value="Kenneth" v-model="ncr.responsible"> Kenneth</a>
                    <a class="dropdown-item"><input type="checkbox" value="Lindo" v-model="ncr.responsible"> Lindo</a>
                    <a class="dropdown-item"><input type="checkbox" value="Production" v-model="ncr.responsible"> Production</a>
                    <a class="dropdown-item"><input type="checkbox" value="Themba" v-model="ncr.responsible"> Themba</a>
                    <a class="dropdown-item"><input type="checkbox" value="Welcome" v-model="ncr.responsible"> Welcome</a>
                </div>
                </div>
            </div>
         </div>
        <b-button style="margin-top: 3%" @click="logNCR()">Submit</b-button>
    </form>
      
    
</div>
</template>

<script>
export default {
    props: ['oldNCR'],
    data() {
        return {
            show: false,
            ncr: {}
        }
    },

    methods: {
        /*async logNCR() {
            let responsible = this.ncr.responsible[0]
            for(let i = 1; i<this.ncr.responsible.length; i++) {
    
                responsible = responsible + ', ' + this.ncr.responsible[i]
            }

            this.ncr.responsible = responsible
            await this.$axios.$post('/ncr', this.ncr)
            this.$emit('closeLog')
        }*/
    },

    created: async function() {
        //this.ncr.responsible = this.ncr.responsible.trim()
        this.ncr = Object.assign({}, this.oldNCR)
        if(this.ncr.responsible != null) {
            this.ncr.responsible = this.ncr.responsible.split(',')
            for(let i = 0; i<this.ncr.responsible.length; i++) {
                this.ncr.responsible[i] = this.ncr.responsible[i].trim()
            }
        }
        
    }
    
}
</script>

<style scoped>

input[type="text"] {
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