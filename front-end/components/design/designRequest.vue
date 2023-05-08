<template>
<div>
    <b-button @click="log = true" style="margin-bottom:1%">Log Request</b-button>

     <div v-if="log" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content" style="width:95%">
            <request-form @closeLog="closeLog"></request-form>
        </div>
    </div>

</div>
</template>

<script>
import requestForm from '../../components/design/requestForm'

export default {
    middleware: ['auth'],
    components: { requestForm },

    data() {
        return {
            log: false
        }
    },

    methods: {
          async closeLog() {
        
            //this.$emit('reloadNCRs')
            this.log = false
            //this.view_ncr = false
            
        },
    }
    
}
</script>

<style scoped>

/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 5; /* Sit on top */
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
  margin: 5% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  word-wrap: break-word;
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