<template>
<div>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>
    <h5>Welcome to boards</h5>
    <b-button @click="add_board = true" style="margin-bottom:1%">Add Board</b-button>
    <div style="margin-bottom:1%">
        <input type="text" v-model="filter" placeholder="Search Boards" style="width:400px">
    </div>
    
    <table class="table table-bordered table-hover" style="width:60%; font-size:13px">
        <thead>
            <th>Board Name</th>
            <th>LED</th>
            <th>No. LEDs</th>
            <th>Config</th>
            <th>Typ Voltage (V)</th>
            <th>Typ Current (mA)</th>
            <th>Length</th>
            <th>Width</th>
            <th>Pic</th>
            <th>Datasheet</th>
        </thead>
        <tbody>
            <tr v-for="board in filteredBoards()" :key="board.id">
                <td>{{board.board_name}}</td>
                <td style="text-align: center"><a href="#" @click="openLED(board.led)">{{board.led}}</a></td>
                <td style="text-align: center">{{board.no_leds}}</td>
                <td style="text-align: center">{{board.config}}</td>
                <td style="text-align: center">{{board.typ_volt}}V</td>
                <td style="text-align: center">{{board.typ_current}}mA</td>
                <td style="text-align: center">{{board.length}} mm</td>
                <td style="text-align: center">{{board.width}} mm</td>
                <td v-if="board.pics != null" style="text-align: center">
                    <i class="fa fa-eye"  @click="showImages(board.pics)"></i>
                </td>
                <td v-else>{{''}}</td>
                <td v-if="board.datasheet != null" style="text-align: center">
                    <i class="fa fa-file-pdf-o" style="font-size:20px;color:red" @click="openReport(board.datasheet)"></i>
                </td>
                <td v-else>{{''}}</td>
            </tr>
        </tbody>
    </table>

    <viewer :images="images">
      <img v-for="src in images" :key="src" :src="src">
    </viewer>

    
    <div v-if="add_board" id="myModal" class="modal">
    <div class="modal-content">
        <add-board @closeModal="closeModal"></add-board>
    </div>
    </div>
</div>
</template>

<script>
import AddBoard from '../../components/boards/AddBoard.vue'
import { component as Viewer } from 'v-viewer';
import 'viewerjs/dist/viewer.css'
export default {
    middleware: ['auth'],
    components: { AddBoard, Viewer },
    data() {
        return {
            add_board: false,
            boards: [],
            filter: '',
            images: []
            
        }
    },
    methods: {
        closeModal() {
            this.add_board = false
        },
        
        filteredBoards() {

                return this.boards.filter(board => 
                
                {
                    const part = board.board_name.toString().toLowerCase();
                    const searchTerm = this.filter.toLowerCase();

                    return part.includes(searchTerm) }
            
            );
        },

        async openReport(path) {
            //uploads/file-1618943984147-AQUA%20FITTING%20THERMAL%20REPORT.docx
          
            window.open('http://localhost:2000/uploads/boards/datasheet/'+path);  //http://it-foundry:3001/uploads/ //localhost:2000/uploads/
        },

        async openLED(path) {
          
            window.open('http://localhost:2000/uploads/boards/leds/'+path+'.pdf');  
        },


        showImages(images) {
            
            
            let tot_images = images.split(',')
               
            
            if(tot_images.length>0) {
                for(let i = 0; i<tot_images.length; i++) {
                    tot_images[i] = `http://localhost:2000/uploads/boards/pic/`+tot_images[i] //`http://it-foundry:3001/uploads/`+tot_images[i]
                } 
                
            }
            else {
                tot_images = ['http://localhost:2000/uploads/No_Image_Available.jpg'] //['http://it-foundry:3001/uploads/No_Image_Available.jpg']
                
            }
            
            this.$viewerApi({
                images: tot_images,
            })
            
        },

    },
    created: async function() {
        let boards = await this.$axios.$get('/boards')
        this.boards = boards.sort((a,b) => (a.board_name > b.board_name) ? 1 : -1)
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
  margin: 5% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

table.table-bordered{
    border:1px solid rgba(0, 0, 0, 0.282);
    margin-top:20px;
  }
table.table-bordered > thead > tr > th{
    border:1px solid rgba(0, 0, 0, 0.282);
}
table.table-bordered > tbody > tr > td{
    border:1px solid rgba(0, 0, 0, 0.282);
}

th {
  /*background: white;*/
  position: sticky;
  top: 35px; /* Don't forget this, required for the stickiness */
  background-color:rgb(88, 89, 92); 
  color:white;
  /*box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);*/
}

td {
    padding: 0.3rem 0.75rem;
}



</style>