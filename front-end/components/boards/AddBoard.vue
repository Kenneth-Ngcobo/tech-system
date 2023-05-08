<template>
<div>

    <form >
         <span class="close" @click="$emit('closeModal')">&times;</span>
        <center>
             <h4>Add Board</h4>
        </center>
        <div class="float-left">
            <div class="form-group">
                <label class="col-md-4">CC/CV</label>
                <select v-model="board.type" style="width:250px; height:30px">
                    <option value="">Select Type</option>
                    <option value="CC">CC</option>
                    <option value="CV">CV</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-md-4">Board Name</label>
                <input type="text" v-model="board.name">
            </div>
            <div class="form-group">
                <label class="col-md-4">LED</label>
                <select v-model="board.led" style="width:250px; height:30px">
                    <option value="">Select LED</option>
                    <option value="Unknown">Unknown</option>
                </select>
            </div>
            <div class="form-group">
                <label class="col-md-4">Typical Voltage (V)</label>
                <input type="text" v-model="board.typ_voltage">
            </div>
            <div v-if="type == 'CC'" class="form-group">
                <label class="col-md-4">Min Current (mA)</label>
                <input type="text" v-model="board.min_current">
            </div>
        </div>

        <div style="margin-left:50%">
            <div v-if="type == 'CC'" class="form-group">
                <label class="col-md-4">Max Current (mA)</label>
                <input type="text" v-model="board.max_current">
            </div>
            <div class="form-group">
                <label class="col-md-4">Length (mm)</label>
                <input type="text" v-model="board.length">
            </div>
            <div class="form-group">
                <label class="col-md-4">Width (mm)</label>
                <input type="text" v-model="board.width">
            </div>
            <div class="form-group">
                <label class="col-md-4">Price (R)</label>
                <input type="text" v-model="board.price">
            </div>
            <div class="form-group">
                <label class="col-md-4">Supplier</label>
                <input type="text" v-model="board.supplier">
            </div>
        </div>
    </form>  

    <b-button style="margin-left:10%; margin-top:2%">Submit</b-button>

</div>
</template>

<script>
export default {
    data() {
        return {
            board: {
                name: '',
                led: '',
                type: '',
                typ_voltage: '',
                min_current: '',
                max_current: '',
                length: '',
                width: '',
                price: '',
                supplier: '',
            }

        }
    },

    methods: {
        async addBoard() {
            await this.$axios.$post('/board', this.board)
        }

    },
    
    created: async function() {

    }
}
</script>

<style scoped>
 input {
     width:250px;
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