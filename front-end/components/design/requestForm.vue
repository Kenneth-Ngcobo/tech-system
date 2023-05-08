<template>
<div>
    <validation-observer v-slot="{handleSubmit}">
    <form @submit.prevent="handleSubmit(addTest)">
        <span class="close" @click="$emit('closeLog')">&times;</span>
        <center>
             <h4>Design Request</h4>
        </center>
        <div class="row">

        <div class="col-lg-5 float-left">
            <div class="form-group">
                <label class="col-md-4">Project Name</label>
                <input type="text" v-model="design.project">
            </div>
             <div class="form-group">
                <label class="col-md-4">Client</label>
                <input type="text" v-model="design.client">
            </div>
            <div class="form-group">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Product Type</label>
                <select style="width:250px; height:30px" v-model="design.type">
                    <option value="">Please select</option>
                    <option value="Linear">Linear</option>
                    <option value="Custom">Custom</option>
                </select>
                 <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>
            <div class="form-group" v-if="design.type == 'Linear'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Type of Linear</label>
                <select v-model="design.name">
                    <option value="Linear Micro">Linear Micro</option>
                    <option value="Linear Mini">Linear Mini</option>
                    <option value="Linear">Linear</option>
                    <option value="Linear Maxi">Linear Maxi</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>
            <div class="form-group" v-if="design.type == 'Custom'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Product Name</label>
                <input type="text" v-model="design.name">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>
            <div class="form-group">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Light</label>
                <select>
                    <option value="Down">Down</option>
                    <option value="Up">Up</option>
                    <option value="Up & Down">Up & Down</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">CCT</label>
                 <select style="width:250px; height:30px" v-model="design.cct">
                    <option value="">Please select</option>
                    <option value="6000K">6000K</option>
                    <option value="5700K">5700K</option>
                    <option value="4000K">4000K</option>
                    <option value="3500K">3500K</option>
                    <option value="3000K">3000K</option>
                    <option value="2700K">2700K</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            
            <div class="form-group">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Dimming</label>
                 <select style="width:250px; height:30px" v-model="design.dimming">
                    <option value="">Please select</option>
                    <option value="Non-DIM">Non-DIM</option>
                    <option value="DALI">DALI</option>
                    <option value="Push-DIM">Push-DIM</option>
                    <option value="Phase-cut">Phase-cut</option>
                    <option value="1-10V">1-10V</option>
                    <option value="DMX">DMX</option>
                    <option value="Wireless">Wireless</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Linear'">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Mounting</label>
                 <select style="width:250px; height:30px" v-model="design.mounting">
                    <option value="">Please select</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Surface">Surface</option>
                    <option value="Recessed Frame">Recessed Frame</option>
                    <option value="Recessed No Frame">Recessed No Frame</option>
                    <option value="Semi Recessed">Semi Recessed</option>
                    <option value="Buried">Buried</option>
                    <option value="Plinth">Plinth</option>
                    <option value="Wall">Wall</option>
                    <option value="Other">Other</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Linear' && design.mounting == 'Suspended'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Suspension Height (m)</label>
                <input type="text" v-model="design.sus_height">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Linear'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Mounting Height (m)</label>
                <input type="text" v-model="design.height">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <!--div class="form-group" v-if="design.type == 'Linear'">
                <label class="col-md-4">Attachments</label>
                <input type="file" multiple>
            </div-->

          

            
        </div>

        <div class="col-lg-7 float-right">
            <div class="form-group" v-if="design.type == 'Custom'">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Mounting</label>
                 <select style="width:250px; height:30px" v-model="design.mounting">
                    <option value="">Please select</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Surface">Surface</option>
                    <option value="Recessed Frame">Recessed Frame</option>
                    <option value="Recessed No Frame">Recessed No Frame</option>
                    <option value="Semi Recessed">Semi Recessed</option>
                    <option value="Buried">Buried</option>
                    <option value="Plinth">Plinth</option>
                    <option value="Wall">Wall</option>
                    <option value="Other">Other</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Custom' && design.mounting == 'Suspended'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Suspension Height (m)</label>
                <input type="text" v-model="design.sus_height">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Custom'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Mounting Height (m)</label>
                <input type="text" v-model="design.height">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>
            <div class="form-group" v-if="design.type == 'Custom'">
                <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Mounting Detail</label>
                <input type="text" v-model="design.height" placeholder="Material to mount to">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Custom'">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Diffuser/Cover Material</label>
                <input type="text" v-model="design.diffuer">
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Custom'">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">Required For</label>
                 <select style="width:250px; height:30px" v-model="design.ip">
                    <option value="">Please select</option>
                    <option value="interior">Interior</option>
                    <option value="Exterior">Exterior</option>
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

            <div class="form-group" v-if="design.type == 'Custom'">
                 <validation-provider  rules="required" v-slot="{ errors }">
                <label class="col-md-4">IP Rating</label>
                 <select style="width:250px; height:30px" v-model="design.ip">
                    <option value="">Please select</option>
                    <option value="IP20">IP20</option>
                    <option value="IP40">IP40</option>
                    <option value="IP54">IP54</option>
                    <option value="IP64">IP64</option>
                    <option value="IP65">IP65</option>
                    <option value="IP66">IP66</option>
                    <option value="IP67">IP67</option>
                    <option value="IP68">IP68</option>
                    
                </select>
                <span class="required">{{ errors[0] }}</span>
                </validation-provider>
            </div>

             <div class="form-group" v-if="design.type == 'Custom'">
                <label class="col-md-4">Attachments</label>
                <input type="file" multiple>
            </div>

            

            <table class="table-bordered" style="width:60%; margin-left:2%" v-if="design.type == 'Linear'">
                <tr>
                    <td style="width:5%"><input type="radio" name="view" v-model="view" value="1"></td>
                    <!--td><input type="text"></td-->
                    <td style="wdith:45%"><img src="@/assets/design_pics/1.png" alt=""></td>
                    <td style="width:5%"><input type="radio" name="view" v-model="view" value="2"></td>
                    <!--td><input type="text"></td-->
                    <td style="wdith:45%"><img src="@/assets/design_pics/2.png" style="width:60%; height:60%" alt="" ></td>
                </tr>
                <tr>
                    <td ><input type="radio" name="view" v-model="view" value="3"></td>
                    <td><img src="@/assets/design_pics/3.png" style="width:50%; height:50%" alt=""></td>
                    <td ><input type="radio" name="view" v-model="view" value="4"></td>
                    <td><img src="@/assets/design_pics/4.png" style="width:40%; height:40%" alt="" ></td>
                </tr>
                <tr>
                    <td ><input type="radio" name="view" v-model="view" value="5"></td>
                    <td><img src="@/assets/design_pics/5.png" style="width:100%; height:100%"  alt=""></td>
                    <td ><input type="radio" name="view" v-model="view" value="6"></td>
                    <td><img src="@/assets/design_pics/6.png" alt="" ></td>
                </tr>
            </table>

             <div class="form-group" v-if="design.type == 'Linear'" style="margin-top:1%">
                <label class="col-md-3">Dimensions (mm)</label>
                <span v-if="view.length>0">
                    <strong >X</strong>
                    <input type="text" v-model="design.required" style="width:80px">
                </span>
                <span v-if="view>1">
                    <strong >Y</strong>
                    <input type="text" v-model="design.required" style="width:80px">
                </span>
                <span v-if="view == '2' || view == '5' || view == '6'">
                    <strong for="X">Z</strong>
                    <input type="text" v-model="design.required" style="width:80px">
                </span>
                <span v-if="view == '6'">
                    <strong for="X">A</strong>
                    <input type="text" v-model="design.required" style="width:80px">
                </span>
                

            </div>

            <div class="form-group" >
                <label class="col-md-3">Required On</label>
                <input type="date" v-model="design.required">
            </div>

           
        </div>
        <b-button type="submit" style="margin-left:45%" >Submit</b-button>
        </div>
    </form> 
    </validation-observer>
    
   

</div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
extend('required', {
  ...required,
  message: 'Required'
});
export default {
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
           design: {
                project: '',
                client: '',
                type: '',
                name: '',
                cct: '',
                orientation: '',
                mounting: '',
                height: '',
                dimming: '',
                sus_height: '',
                ip: '',
                diffuser: '',
                required: '',
                files: []
                

            },

            view: ''
          

        }
    },
    methods: {

      
    },
    
    created: async function() {
       
    }
    
}
</script>

<style scoped>
 input[type=text] {
     width:250px;
 }
/* The Close Button */
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

.required {
    color: red
}
</style>
