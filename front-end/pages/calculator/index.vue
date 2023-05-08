<template>
<div>
    <label>Select Product</label>
    <select v-model="product" @change="boardsFilter()">
        <option :value="{value: '', name: '', board: []}">Please Select</option>
        <option v-for="prod in products" :key="prod.value" :value="prod">{{prod.name}}</option>
    </select>
    <label>Boards</label>
   <select v-model="sel_board">
       <option value="">Please Select</option>
       <option v-for="board in prod_boards" :key="board.no" :value="board.name">{{board.name}}</option>
   </select>

   <div>
       <label>Required Length</label>
       <input type="text" v-model="length"> mm
   </div>
   <div>
       <b-button @click="calculator()">Calculate</b-button>
   </div>

   <table class="table table-bordered" style="width:50%">
      <tbody>
          <tr>
              <td>Length</td>
              <td></td>
          </tr>
          <tr>
              <td>Gear Tray Length</td>
              <td>{{gtray_length}}mm</td>
          </tr>
          <tr>
              <td>Extrusion Length</td>
              <td>{{ext_length}}mm</td>
          </tr>
          <tr>
              <td>{{board_qty1}}</td>
              <td>{{len1}}mm</td>
          </tr>
          <tr>
              <td>{{board_qty2}}</td>
              <td>{{len2}}mm</td>
          </tr>
          <tr>
              <td>Board length</td>
              <td>{{board_length}}mm</td>
          </tr>
          <tr>
              <td>Board length with 1mm gap</td>
              <td>{{actual_board_length}}mm</td>
          </tr>
      </tbody>
   </table>

</div>
</template>

<script>
export default {

    data() {
        return {
            product: {
                value: '',
                name: '',
                board: []
            }, 
            sel_board: '',
            products: [{value: '100', name: 'Linear Maxi 100', board: [1]}, {value: '70', name: 'Linear Pro 70', board: [1]}, {value: '50', name: 'Linear Mini 50', board: [1]}, {value: '33', name: 'Linear Micro 33', board: [2, 3, 4]}, {value: '27', name: 'Linear 27', board: [2, 3, 4]}],
            boards: [{no: '1', name: 'Zhaga Board 28W/m'}, {no: '2', name: '24V Board 22W/m'}, {no: '3', name: 'LED Tape 5W/m'}, {no: '4', name: 'LED Tape 9.6W/m'}],
            prod_boards: [],
            length: '',
            len1: 0,
            len2: 0,
            board_qty1: 0,
            board_qty2: 0,
            board_length: 0,
            actual_board_length: 0,
            ext_length: 0,
            gtray_length: 0
        }
    },

    methods: {
        boardsFilter() {
            let length = this.product.board.length
            let boards = []
            for(let i = 0; i<length; i++) {
                boards.push(this.boards.find(b => b.no == this.product.board[i]))
            }
           if(boards.length == 1) {
               this.sel_board = boards[0].name
           }
           
           if(boards.length>1) {
               this.sel_board = ''
           }
           

            this.prod_boards = boards
        },

        calculator() {
            this.len1 = 0
            this.len2 = 0
            this.board_qty1 = 0
            this.board_qty2 = 0
            if(this.sel_board == 'Zhaga Board 28W/m') {
                this.len1 = 560
                this.len2 = 240
                this.len3 = 140
            }
            if(this.sel_board == '24V Board 22W/m') {
                this.len1 = 594
                this.len2 = 99
            }
            this.board_qty1 = Math.floor(this.length/this.len1)
            let rem_length = this.length - (this.board_qty1*this.len1)
            this.board_qty2 = Math.floor(rem_length/this.len2)
            this.board_length = (this.len1*this.board_qty1) + (this.len2*this.board_qty2)
            this.actual_board_length = this.board_length + (this.board_qty1+this.board_qty2-1)*1
            this.gtray_length = this.actual_board_length+12
            this.ext_length = this.gtray_length+3
        }
    },

    created: async function() {
        
    }

    
}
</script>

<style scoped>

</style>