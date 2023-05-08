<template>
<div>

    <form>
        <span class="close" @click="$emit('closeModal')">&times;</span>
        <center>
             <h4>Modify Test</h4>
        </center>
        <div class="col-lg-6 float-left">
            <div class="form-group">
                <label class="col-md-3">Type of Test</label>
                <select style="width:250px; height:30px" v-model="test.test">
                    <option value="">Please select</option>
                    <option value="Photometric">Photometric</option>
                    <option value="Thermal">Thermal</option>
                    <option value="IP">IP</option>
                    <option value="Electrical">Electrical</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-md-3">Product Name</label>
                <input type="text" v-model="test.product_name" @change="refreshData">
            </div>
             <div>
                <label class="col-md-3">Reason For Test</label>
                <textarea name="" id="" cols="32" rows="3" v-model="test.reason"></textarea>
            </div>
             <div class="form-group">
                <label class="col-md-3">Length (mm)</label>
                
                <input type="text" v-model="test.length">
            </div>
            <div class="form-group">
                <label class="col-md-3">Board</label>
                 <select style="width:250px; height:30px" v-model="test.board"  @change="selectLED()">
                    <option value="">Please select</option>
                    <option :value="board.board_name" v-for="board in boards" :key="board.id">{{board.board_name}}</option>
                    <!--option value="RL18">RL18 10mm</option>
                    <option value="RL18">RL18 20mm</option>
                    <option value="RL21">RL21</option>
                    <option value="Zhaga">Zhaga</option>
                    <option value="Olympia">Olympia</option>
                    <option value="Argo">Argo</option>
                    <option value="Lumina 12 LED">Lumina 12 LED</option>
                    <option value="Lumina 36 LED">Lumina 36 LED</option>
                    <option value="Dega">Dega</option>
                    <option value="COB">COB</option>
                    <option value="Other">Other</option-->
                </select>
            </div>

            <div class="form-group" v-if="test.board == 'COB' || test.board == 'Other'">
                <label class="col-md-3">Specify</label>
                <input type="text"  v-model="test.other" @change="refreshData">
            </div>

            <div class="form-group">
                <label class="col-md-3">LED</label>
                <input type="text"  v-model="test.led">
            </div>
            
           
        </div>
        <div class="col-lg-6 float-right">

            <div class="form-group">
                <label class="col-md-4">CCT</label>
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
                <label class="col-md-4">LED Bin</label>
                <input type="text" v-model="test.led_bin">
            </div>
            <div class="form-group">
                <label class="col-md-4">Wattage (W)</label>
                <input type="text"  v-model="test.wattage">
            </div>
            <div class="form-group">
                <label class="col-md-4">Current (mA)</label>
                <input type="text"  v-model="test.current">
            </div>
            <div class="form-group">
                <label class="col-md-4">Lens/Angle/Cover</label>
                <input type="text" v-model="test.lens_cover">
            </div>
           
             <!--div class="form-group">
                <label class="col-md-4">Priority</label>
                <select style="width:250px; height:30px" v-model="test.priority">
                    <option value="">Please select</option>
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Super Urgent">Super Urgent</option>
                
                </select>
            </div-->
             <div class="form-group">
                <label class="col-md-4">Date Required</label>
                <input type="date" :min="today()" v-model="test.date_required">
            </div>
        </div>
    </form> 
    <div style="margin: 3% 0 0 -15%; display: inline-block">
        <b-button style="margin-top: 0px" @click="modifyTest()">Save</b-button>
        <b-button style="margin: 0px 0 0 5px" @click="newTest">Create New Test</b-button>
        <b-button style="margin: 0px 0 0 5px" @click="Delete">Delete</b-button>
    </div>
    <!--datalist id="product-name">
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
    </datalist--> 

</div>
</template>

<script>
export default {
    props: ['test'],
    data() {
        return {
            products: [],
            original_test: {},
            boards: [],
            

        }
    },
    methods: {

        selectLED() {
            this.test.led = this.boards.find(b => b.board_name == this.test.board).led
        },

        async Delete() {
            if(confirm('Are you sure you want to delete this test?')){
               await this.$axios.$post('delete_test', this.test)
                this.$emit('closeModal')
            }
            
        },

        async modifyTest() {
            let changed = false
            let changes = {}
            this.test.updated_by = this.$auth.user.username
            //this.test.email = this.$auth.user.email
            if(this.test.board == 'Other' || this.test.board == 'COB') {
                this.test.board = this.test.other
            }
            for(var key in this.test) {
                if(this.test[key] != this.original_test[key]) {
                    changed = true
                    changes[key] = this.test[key]

                 
                  
                }
            }
            if(changed) {
                changes['product_name'] = this.test.product_name
                changes['test'] = this.test.test
                changes['updated_by'] = this.$auth.user.username
                changes['id'] = this.test.id
                await this.$axios.$post('/modify_test_details', changes)
            }
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

         async addTest() {
            this.test.priority = null
            this.test.person = this.$auth.user.username
            this.test.email = this.$auth.user.email
            if(this.test.board == 'Other' || this.test.board == 'COB') {
                this.test.board = this.test.other
            }
            await this.$axios.$post('/testing', this.test)
            this.$emit('closeModal')
        },


        newTest() {

            let change = false
            if(confirm('Are you sure you want to create a new test?')){
               for(var key in this.test) { // Check if any changes have been made to the original test
                if(this.test[key] != this.original_test[key]) {
                    change = true
                }
               }
               if(change) {
                   this.addTest()
               }
               else {
                   alert("No changes have been detected on the original test")
               }
            }
            else {
                alert('Cancelled')
            }
        },



    },
    
    created: async function() {
        //this.products = await this.$axios.$get('/products')
        //var new_obj = Object.assign({}, obj1);
        this.original_test = Object.assign({}, this.test)
        this.boards = await this.$axios.$get('/boards')
        this.boards.push({board_name: 'Other', led: ''})
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