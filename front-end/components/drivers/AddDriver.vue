<template>
<div>

    <form>
        <span class="close" @click="$emit('closeModal')">&times;</span>
        <center>
             <h4>Add Driver</h4>
        </center>
        <div class="form-group">
            <label>Part Number</label>
            <input type="text">
        </div>
        <div class="form-group">
            <label>Part Number</label>
            <input type="text">
        </div>
    </form>  

</div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
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