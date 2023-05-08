<template>
<div>

    <div class="close" @click="$emit('closeAdd')">&times;</div>


    <div class="row">
        <div class="col-md-6">
            <table class="table">
                <tr>
                    <td><strong>SO</strong></td>
                    <td><input v-model="pro.so" type="text"></td>
                    <td><b-button>Load</b-button></td>
                    
                </tr>
                <tr>
                    <td><strong>Project Name</strong></td>
                    <td><input v-model="pro.name" type="text"></td>
                </tr>
                
                <tr>
                    <td><strong>Quote No</strong></td>
                    <td><input v-model="pro.quote_no" type="text"></td>
                </tr>
                
                <tr>
                    <td><strong>Region</strong></td>
                    <td><select v-model="pro.region">
                        <option value="">Select</option>
                        <option value="JHB">JHB</option>
                        <option value="CPT">CPT</option>
                        <option value="DBN">DBN</option>
                    </select></td>
                </tr>
                <tr>
                    <td><strong>Sales Rep</strong></td>
                    <td><input v-model="pro.rep" type="text"></td>
                </tr>
                <tr>
                    <td><strong>Start Date</strong></td>
                    <td><input v-model="pro.start_date" type="date"></td>
                </tr>
                <tr>
                    <td><strong>End Date</strong></td>
                    <td><input v-model="pro.end_date" type="date"></td>
                </tr>
                
            </table>
        </div>

        <div class="col-md-6">
            <table class="table">
                <tr>
                    <td><strong>Client</strong></td>
                    <td><input v-model="pro.client" type="text"></td>
                </tr>
                <tr>
                    <td><strong>Address</strong></td>
                    <td><textarea v-model="pro.address" name="" id="" style="width:100%" rows="10"></textarea></td>
                </tr>
                <tr>
                    <td><strong>Team</strong></td>
                    <td><input v-model="pro.team" type="text"></td>
                </tr>
            </table>

        </div>

    </div>

    <center>
        <b-button @click="AddProject()">Add</b-button>      
    </center>


</div>
</template>

<script>
export default {

    data() {
        return {
            pro: {
                name: "",
                client: "",
                region: "",
                rep: "",
                start_date: "",
                end_date: "",
                status: "new",
                team: "",
                quote_no: "",
                so: "",
                address: "",
                cost: ""
            }
           
        }
    },
    
    methods: {
        async AddProject() {
            await this.$axios.$post('add_project', this.pro)
            this.$emit('loadProjects')
            
        }
    }
    
}
</script>

<style lang="css" scoped>

input {
    width: 100%;
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

</style>