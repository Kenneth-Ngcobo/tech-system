<template>
<div>

    <form>
        <span class="close" @click="$emit('closeModal')">&times;</span>
        <center>
             <h4>RFI</h4>
        </center>
        <div class="col-lg-6 float-left">
            <div class="form-group">
                <label class="col-md-3">Information required</label>
                <select style="width:250px; height:30px" multiple v-model="test.test">
                    <option value="" hidden>Please select</option>
                    <option value="Photometric">Photometric</option>
                    <option value="Thermal">Thermal</option>
                    <option value="Electrical">Electrical</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-md-3">Product Name</label>
                <input list="product-name"  v-model="test.name" @change="refreshData">
            </div>
             <div class="form-group">
                <label class="col-md-3">Length</label>
                <input type="text" v-model="test.length">
            </div>
            <div class="form-group">
                <label class="col-md-3">Board</label>
                 <select style="width:250px; height:30px" v-model="test.board">
                    <option value="">Please select</option>
                    <option value="RL18">RL18 10mm</option>
                    <option value="RL18">RL18 20mm</option>
                    <option value="RL21">RL21</option>
                    <option value="Zhaga">Zhaga</option>
                    <option value="Olympia">Olympia</option>
                    <option value="Argo">Argo</option>
                    <option value="Lumina 12 LED">Lumina 12 LED</option>
                    <option value="Lumina 36 LED">Lumina 36 LED</option>

                </select>
            </div>
            
             <div class="form-group">
                <label class="col-md-3">CCT</label>
                 <select style="width:250px; height:30px" v-model="test.cct">
                    <option value="">Please select</option>
                    <option value="6000">6000</option>
                    <option value="5700">5700</option>
                    <option value="4000">4000</option>
                    <option value="3500">3500</option>
                    <option value="3000">3000</option>
                    <option value="2700">2700</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-md-3">LED Bin</label>
                <input type="text" v-model="test.led_bin">
            </div>
           
        </div>
        <div class="col-lg-6 float-right">
            
            <div class="form-group">
                <label class="col-md-4">Wattage/Drive Current</label>
                <input list="current"  v-model="test.current_wattage">
            </div>
            <div class="form-group">
                <label class="col-md-4">Lens/Angle/Cover</label>
                <input type="text" v-model="test.lens_cover">
            </div>
            <div>
                <label class="col-md-4">Comments</label>
                <textarea name="" id="" cols="32" rows="2.5" v-model="test.comments"></textarea>
            </div>
             <div class="form-group">
                <label class="col-md-4">Priority</label>
                <select style="width:250px; height:30px" v-model="test.priority">
                    <option value="">Please select</option>
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Super Urgent">Super Urgent</option>
                
                </select>
            </div>
             <div class="form-group">
                <label class="col-md-4">Date Required</label>
                <input type="date" :min="today()" v-model="test.date_required">
            </div>
        </div>
    </form> 
    <b-button style="margin-left:45%" @click="addTest()">Submit</b-button>
    <datalist id="product-name">
        <option v-for="(product,index) in filter('name')" :key="index">{{product}}</option>
    </datalist>
    <datalist id="current">
        <option v-for="(product,index) in filter2('current')" :key="index">{{product}}</option>
    </datalist>
    <datalist id="beam">
         <option v-for="(product,index) in filter2('beam_or_cover')" :key="index">{{product}}</option>
    </datalist>
    <datalist id="modules">
         <option v-for="(product,index) in filter2('modules')" :key="index">{{product}}</option>
    </datalist> 

</div>
</template>

<script>
export default {
    data() {
        return {
            test: {
                test: '',
                name: '',
                length: '',
                board: '',
                cct: '',
                led_bin: '',
                current_wattage: '',
                lens_cover: '',
                comments: '',
                priority: '',
                date_required: ''

            },
            products: []

        }
    },
    methods: {

        async addTest() {
            await this.$axios.$post('/testing', this.test)
            this.$emit('closeModal')
        },

        today() {
            let newDate = new Date()
            let dt = ('0' + (newDate.getDate())).slice(-2)
            let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
            let yr = (newDate.getFullYear()).toString()
            return (yr + '-' + mth + '-' + dt)
        },

        refreshData() {

        },

        filter(variable) {
            var names = [];

            for (var i = 0; i < this.products.length; i++){

                if (this.products[i][variable] && names.indexOf(this.products[i][variable]) == -1){
                    names.push(this.products[i][variable]);
                }

            }
            return names
        },

        filter2(variable) {
            var products = this.products.filter(p => p.name == this.test.name)
            var names = [];

            for (var i = 0; i < products.length; i++){

                if (products[i][variable] && names.indexOf(products[i][variable]) == -1){
                    names.push(products[i][variable]);
                }

            }
            return names
        },

        /*checkParameter(parameter) {
            var products = this.products.filter(p => p.name == this.test.name && p[parameter] != null)
            if(products.length>0) {
                return true
            }
            else {
                return false
            }
        }*/



    },
    
    created: async function() {
        this.products = await this.$axios.$get('/products')
    }
    
}
</script>

<style scoped>
 input {
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
</style>