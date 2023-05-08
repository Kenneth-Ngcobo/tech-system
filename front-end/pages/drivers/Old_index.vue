<template>
<div>
    <h5>Welcome to drivers</h5>
    <b-button @click="add_driver = true">Add Driver</b-button>

    <div v-if="add_driver" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <add-driver @closeModal="closeModal"></add-driver>
    </div>
    </div>

    <table class="table table-bordered table-hover" style="font-size:15px">
        <thead>
            <th>Driver</th>
            <th>W</th>
            <th>Type</th>
            <!--th>V Range</th-->
            <th>V-Range</th>
            <!--th>Max Volt</th-->
            <th>Drive Current</th>
            <th>I-Range</th>
            <th>Dimming</th>
            <th>Price</th>
            <th>Form Factor</th>
            <th>Dimensions</th>
            <th>Manufactuer</th>
        </thead>
        <tbody>
            <tr v-for="driver in joined_drivers" :key="driver.id">
                <td>{{driver.name}}</td>
                <td>{{driver.wattage}}</td>
                <td>{{driver.type}}</td>
                <!--td>{{driver.min_voltage}} - {{driver.max_voltage}}</td-->
                <td>{{findCurrent(driver.name, driver.current)[0].min_voltage}} - {{findCurrent(driver.name, driver.current)[0].max_voltage}} V</td>
               
                <td>
                    <select v-model="driver.current">
                        <option :value="specific.current" v-for="specific in findDriver(driver.name)" :key="specific.id">{{specific.current}}</option>
                    </select>
                </td>
                <td>{{driver.min_current}} - {{driver.max_current}}</td>
                <td>{{driver.dimming}}</td>
                <td>{{driver.price}}</td>
                <td>{{driver.form_factor}}</td>
                <td>{{driver.dimensions}}</td>
                <td>{{driver.manufacturer}}</td>
            </tr>
        </tbody>
    </table>

</div>
</template>

<script>
import AddDriver from '../../components/drivers/AddDriver'

export default {
    middleware: ['auth'],
    components: { AddDriver },
    data() {
        return {
            add_driver: false,
            joined_drivers: [],
            all_drivers: [],
            selected_current: ''
        }
    },
    methods: {
        closeModal() {
            this.add_driver = false
        },

        findDriver(name) {
            return this.all_drivers.filter(d => d.name == name)
        },
        findCurrent(name, current) {
            return this.all_drivers.filter(d => d.name == name && d.current == current)
        }
    },
    
    created: async function() {
        this.all_drivers = await this.$axios.$get('/drivers')
        this.joined_drivers = await this.$axios.$get('/joined_drivers')
    }
}
</script>

<style scoped>

/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
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
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}



</style>