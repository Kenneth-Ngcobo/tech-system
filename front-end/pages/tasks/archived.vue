<template>
<div>
    <h5>Archived</h5>
    <table class="table table-bordered table-hover" style="width:50%">
        <thead>
            <th>#</th>
            <th>Task</th>
            <th>Type</th>
            <th>Stage</th>
            <th>Finished On</th>
        </thead>
        <tbody>
            <tr v-for="(task,index) in tasks" :key="task.id"
            @dblclick="viewTask(task)"
            @contextmenu.prevent="$refs.menu.open($event, task)">
                <td>{{index+1}}</td>
                <td>{{task.task}}</td>
                <td>{{task.type}}</td>
                <td>{{task.stage}}</td>
                <td>{{task.completed_on}}</td>
            </tr>
        </tbody>
    </table>

     <vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <!--ul-->
        <template v-if="data">
        <li v-on:click.prevent="updateStatus(data, 'active')"><a>Restore</a></li>
        </template>
      <!--/ul-->   
   </vue-context>

    <div v-if="view" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:90%">
        <div>
        <span class="close" @click="view = false">&times;</span>
          <center>
          <!--h5 v-if="!edit" @dblclick="edit = true" style="align-center;">{{task.task}}</h5>
          <h5 v-else><input type="text" v-model="task.task" style="width:80%; text-align:center"> <span @click="edit = false">X</span></h5-->
          <table> <!-- class="table-bordered"-->
            <tr>
              <td colspan="3" v-if="!edit" style="text-align: center" @dblclick="edit = true">
                <h5 >{{task.task}}</h5>
              </td>
             
              <td v-if="edit" colspan="3" >
               
                <input type="text" v-model="task.task" style="width:100%; text-align:center">
               
              </td>
              <td v-if="edit"><span @click="edit = false" class="close">&times;</span></td>
             
            </tr>
            <tr>
              <td><input type="date" v-model="task.due"></td>
              <td style="width:50px"></td>
              <td><select v-model="task.type">
                  <option value="Quick Remainder">Quick Reminder</option>
                  <option value="Day Task">Day Task</option>
                  <option value="Mini Project">Mini Project</option>
                  <option value="Project">Project</option>
                </select>
              </td>
              <td></td>
             
            </tr>
          </table>
          
          </center>
          <center>
             <table class="table table-bordered" style="width:95%; margin-top:1%">
               <thead>
                 <th>Done</th>
                 <th>To Do</th>
                 <th>Due</th>
                 <th>Completed On</th>
                 <th>DEL</th>
               </thead>
               <draggable v-model="task_todos" tag="tbody" @change="onSort">
                 <tr v-for="(task, index) in task_todos" :key="index">
                   <td scope="row" style="width:5%"><input type="checkbox" v-model="task.done" @change="Tick(task)"></td>
                   <td style="width:60%"><input type="text" v-model="task.to_do" style="width:100%"></td>
                   <td style="width:15%"><input type="date" v-model="task.due" style="width:100%"></td>
                   <td style="width:15%"><input type="date" v-model="task.finished" style="width:100%"></td>
                   <td style="width:5%;"><span class="close" style="margin-left:-12px" @click.prevent="removeToDo(index)">&times;</span></td>
                 </tr>
               </draggable>
             </table>
             
          </center>
           
         </div>
    </div>
    </div>

</div>
</template>

<script>
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css'

export default {
    components: {
        VueContext
    },

    data() {
        return {
            tasks: [],
            to_dos: [],
            view: false,
            task: {},
            task_todos: []

        }
    },

    methods: {
       viewTask(element) {
        this.view = true; 
        this.task = element
        this.task_todos = this.to_dos.filter(t => t.task_id == element.id).sort((a,b) => a['prio'] - b['prio'])
        },

        async updateStatus(data, status) {
           
            await this.$axios.$post('/update_task_status', {id: data.id, status: status})
            this.tasks = await this.$axios.$get(`/archived/${this.$route.query.res}`)
    
            
        },
    },
    
    created: async function() {
        console.log('res =', this.$route.query.res)
        this.tasks = await this.$axios.$get(`/archived/${this.$route.query.res}`)
        this.to_dos = await this.$axios.$get('/todos')

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
  word-wrap: break-word;
}

.close {
  color: rgb(66, 63, 63);
  font-size: 35px;
  font-weight: bold;
  margin-left: 0px;
  padding-left: 0px
}


</style>