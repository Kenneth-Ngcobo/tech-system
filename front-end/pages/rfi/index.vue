<template>
<div>
    <h5>Welcome to RFI</h5>
    <b-button @click="add_rfi = true">Load RFI</b-button>

    <div v-if="add_rfi" id="myModal" class="modal">
        <div class="modal_backdrop" @click="add_rfi = false" />
    <!-- Modal content -->
    <div class="modal-content">
        <addRFI></addRFI>
    </div>
    </div>

    
</div>
</template>

<script>
import addRFI from '../../components/rfi/addRFI'
export default {
    middleware: ['auth'],
    components: { addRFI },
    data() {
        return {
            add_rfi: false,
           
        }
    },
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

.modal_backdrop {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 10% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  z-index: 2; /* Could be more or less, depending on screen size */
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