<template>
<div>
  
    <form>
        <div class="col-lg-6 float-left">
        <div class="form-group">
            <label class="col-md-4">Select Board</label>
            <select v-model="selected_board" style="width:185.6px; height:30px">
                <option value="">Select Board</option>
                <option :value="board" v-for="board in boards" :key="board.id">{{board.board_name}}</option>
            </select>
        </div>
        <div class="form-group">
            <label class="col-md-4">Enter Board Qty</label>
            <input type="text" v-model="qty">
        </div>
        <div class="form-group">
            <label class="col-md-4">Enter Drive Current (mA)</label>
            <input type="text" v-model="current">
        </div>
        
        <b-button style="margin: 2% 0 2% 35%" @click="findDrivers()">Find Drivers</b-button>
        </div>
    </form>

       
            

    <table class="table table-bordered" style="width:50%">
        <thead>
            <th>Board</th>
            <th>Total Vf</th>
            <th>Total Wattage</th>
        </thead>
        <tbody>
            <tr>
                <td>{{selected_board.board_name}}</td>
                <td>{{selected_board.typ_volt*qty}}V</td>
                <td>{{selected_board.typ_volt*qty*current/1000}}W</td>
            </tr>
        </tbody>
    </table>

    <div style="margin:8% 0 0 2%">
     <label >Form Factor</label>
        <select style="width:185.6px; height:30px">
            <option value="all">All</option>
            <option value="linear">Linear</option>
            <option value="compact">Compact</option>
        </select>
       
        
        <label class="col-md-4">Dimming</label>
        <select style="width:185.6px; height:30px">
            <option value="">All</option>
            <option value="">None</option>
            <option value="">DALI</option>
            <option value="">DALI-2</option>
            <option value="">DT8</option>
            <option value="">switchDIM</option>
            <option value="">1-10V</option>
        </select>
        
     
      
        <label class="col-md-3">IP Rating</label>
        <div class="dropdown" style="margin-left: 34%; margin-top:-30px"> <!--class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"-->
        <select style="width: 185.6px; height:30px" @click.prevent="show=!show" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <!--option value="" disabled>Select</option-->
        </select>
        <div :class="{'dropdown-menu' : true, 'show': show}" style="margin-top:1%"> 

            <a class="dropdown-item"><input type="checkbox" v-model="check_all" @click="checkAll"> All</a>
            <a class="dropdown-item"><input type="checkbox" value="20" v-model="ip"> IP20</a>
            <a class="dropdown-item"><input type="checkbox" value="40" v-model="ip"> IP40</a>
            <a class="dropdown-item"><input type="checkbox" value="54" v-model="ip"> IP54</a>
            <a class="dropdown-item"><input type="checkbox" value="64" v-model="ip"> IP64</a>
            <a class="dropdown-item"><input type="checkbox" value="65" v-model="ip"> IP65</a>
            <a class="dropdown-item"><input type="checkbox" value="66" v-model="ip"> IP66</a>
            <a class="dropdown-item"><input type="checkbox" value="67" v-model="ip"> IP67</a>
            <a class="dropdown-item"><input type="checkbox" value="68" v-model="ip"> IP68</a>
        </div>
        </div>
    <!--h5>Matching Drivers</h5-->
    <table class="table table-bordered" style="width:90%">
        <thead>
            <th>Driver Name</th>
            <th>Wattage</th>
            <th>Forward Voltage</th>
            <th>Current</th>
            <th>I Select</th>
            <th>Form Factor</th>
            <th>Dimming</th>
            <th>IP</th>
            <th>Cost</th>
            <th>Mfg</th>
        </thead>
        <tbody>
            <tr v-for="driver in drivers" :key=driver.id>
                <td>{{driver.name}}</td>
                <td>{{driver.wattage}}</td>
                <td>{{driver.min_voltage}} - {{driver.max_voltage}} V</td>
                <td>{{driver.current}}</td>
                <td>{{driver.current_select}}</td>
                <td>{{driver.form_factor}}</td>
                <td>{{driver.dimming}}</td>
                <td>{{driver.ip}}</td>
                <td>R{{driver.price}}</td>
                <td>{{driver.manufacturer}}</td>
            </tr>
        </tbody>
    </table>
    </div>
</div>
</template>

<script>
export default {
    middleware: ['auth'],
    data() {
        return {
            boards: [],
            selected_board: {},
            qty: '',
            current: '',
            voltage: '',
            //all_drivers: [],
            drivers: [],
            ip: [],
            show: false,
            check_all: false
        }
    },

    methods: {
        checkAll() {
            if(this.check_all) {
                this.ip = [] 
            }
            else {
                this.ip = [20, 40, 54, 64, 65, 66, 67, 68]
            }
            //console.log(this.check_all)
        },

        async findDrivers() {
            this.drivers = await this.$axios.$post('/driver_match', {typ_volt: this.selected_board.typ_volt*this.qty, current: this.current})
        }

    },

    created: async function() {
        this.boards = await this.$axios.$get('/boards')
        //this.all_drivers = await this.$axios.$get('/drivers')
    }
    
}
</script>

<style scoped>

.dropdown-menu {
    width: 185.6px
}

</style>