<template>
<div>
  <b-card no-body>
    <b-tabs card>
      <b-tab v-for="res in people" :key="res" :title="res" @click="activeTab(res)" :active="responsible == res">
      <div class="container mt-2">
        <div class="row" >
          <div class="col form-inline">
           
            <b-button @click="add_task = true; responsible=res" variant="primary" class="ml-3">Add Task</b-button> <!--@click="add"-->
            <b-button v-if="move" style="margin-left: 15%" class="blink" @click="commitChanges()">Commit Changes</b-button>
            <b-button v-if="move" style="margin-left: 2%" @click="move = false; loadTasks()">Cancel</b-button>

          </div>
          <div class="col">
            <nuxt-link :to="{ path: '/tasks/archived', query: { res: res }}">
             <b-button >View Archived</b-button>
            </nuxt-link>
          </div>
          </div>
           
          <h6 style="margin-left: 1.5%; margin-top:2%">QR: Quick Reminder || DT: Day Task || MN: Mini Project ||  PR: Project</h6>
            
          
        
        <div class="row mt-4">
          <div class="col-3" >
            <div class="p-2 alert alert-secondary">
              <h3>Staging</h3>
              <!-- Backlog draggable component. Pass arrBackLog to list prop -->
              <draggable
                class="list-group kanban-column"
                :list="staging"
                group="tasks"
                @change="onEnd($event,'Staging')"
               

              >
                <div
                  class="list-group-item"
                  v-for="(element,index) in staging.slice(0, st_end)"
                  :key="element.task"
                  @dblclick="viewTask(element)" 
                  id="draggable"
                  @contextmenu.prevent="$refs.menu.open($event, element)"
                ><!--viewTask(element)-->
                  <span>
                  {{ element.task }}
                  <span class="badge">{{taskType(element.type)}} {{element.due}}</span>
                  </span>
                  <span v-if="index == 5 && st_show == 'more' && staging.length>6">
                    <a href="#" @click="st_end = staging.length; st_show = 'less'">Show More ...</a>
                  </span>
                  <span v-if="index == staging.length-1 && st_show == 'less'">
                    <a href="#" @click="st_end = 6; st_show = 'more'">Show Less ...</a>
                  </span>
                  <!--span class="badge">{{element.due}}</span-->
                </div>
              </draggable>
            </div>
          </div>

          <div class="col-3">
            <div class="p-2 alert alert-primary">
              <h3>In Progress</h3>
              <!-- In Progress draggable component. Pass arrInProgress to list prop -->
              <draggable
                class="list-group kanban-column"
                :list="progress"
                group="tasks"
                 @change="onEnd($event,'Progress')"
              >
                <div
                  class="list-group-item"
                  v-for="element in progress"
                  :key="element.task"
                  @dblclick="viewTask(element)"
                  id="draggable"
                  @contextmenu.prevent="$refs.menu.open($event, element)"
                >
                  {{ element.task }}
                  <span class="badge">{{taskType(element.type)}} {{element.due}}</span>
                </div>
              </draggable>
            </div>
          </div>

          <div class="col-3">
            <div class="p-2 alert alert-warning">
              <h3>Testing / Review</h3>
              <!-- Testing draggable component. Pass arrTested to list prop -->
              <draggable
                class="list-group kanban-column"
                :list="testing"
                group="tasks"
                 @change="onEnd($event,'Testing')"
              >
                <div
                  class="list-group-item"
                  v-for="element in testing"
                  :key="element.task"
                  @dblclick="viewTask(element)"
                  id="draggable"
                  @contextmenu.prevent="$refs.menu.open($event, element)"
                >
                  {{ element.task }}
                  <span class="badge">{{taskType(element.type)}} {{element.due}}</span>
                </div>
              </draggable>
            </div>
          </div>

          <div class="col-3">
            <div class="p-2 alert alert-success">
              <h3>Done</h3>
              <!-- Done draggable component. Pass arrDone to list prop -->
              <draggable
                class="list-group kanban-column"
                :list="done"
                group="tasks"
                @change="onEnd($event, 'Done')"
              >
                <div
                  class="list-group-item"
                  v-for="(element,index) in done.slice(0, d_end)"
                  :key="element.task"
                  @dblclick="viewTask(element)"
                  id="draggable"
                  @contextmenu.prevent="$refs.menu.open($event, element)"
                >
                  {{ element.task }}
                  <span class="badge">{{taskType(element.type)}}</span>
                  <span v-if="index == 5 && d_show == 'more' && done.length > 6">
                    <a href="#" @click="d_end = done.length; d_show = 'less'">Show More ...</a>
                  </span>
                  <span v-if="index == done.length-1 && d_show == 'less'">
                    <a href="#" @click="d_end = 6; d_show = 'more'">Show Less ...</a>
                  </span>
                </div>
              </draggable>
            </div>
          </div>
        </div>
      </div>
      </b-tab>
      <!--b-tab title="Welcome">

      </b-tab>
      <b-tab title="Lindo">

      </b-tab-->
    </b-tabs>
  </b-card>



   <div v-if="view" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:90%">
        <div>
        <span class="close" @click="closeView()">&times;</span>
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
               <draggable v-model="task_todos" tag="tbody" @change="onSort"> <!--:sort="false"-->
                 <tr v-for="(task, index) in task_todos" :key="index">
                   <td scope="row" style="width:5%"><input type="checkbox" v-model="task.done" @change="Tick(task)"></td>
                   <td style="width:60%"><input type="text" v-model="task.to_do" style="width:100%"></td>
                   <td style="width:15%"><input type="date" v-model="task.due" style="width:100%"></td>
                   <td style="width:15%"><input type="date" v-model="task.finished" style="width:100%"></td>
                   <td style="width:5%;"><span class="close" style="margin-left:-12px" @click.prevent="removeToDo(index)">&times;</span></td>
                 </tr>
               </draggable>
             </table>
             
              <b-button @click="addToDo()">Add</b-button>
              <b-button @click="saveChanges()">Save</b-button>
          
             
          </center>
           
         </div>
    </div>
    </div>

    <div v-if="add_task" id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content" style="width:90%">
       <add-task @closeTaskModal="closeTaskModal" :responsible="responsible"></add-task>
    </div>
    </div>

     <vue-context ref="menu" class="context-menu" v-slot="{ data }">
      <!--ul-->
        <template v-if="data">
        <li v-if="data.stage != 'Done'" v-on:click.prevent="updateStatus(data, 'deleted')"><a>Delete Task</a></li>
        <li v-if="data.stage == 'Staging' || data.stage == 'Done'" v-on:click.prevent="updateStatus(data, 'archived')"><a>Archive Task</a></li>
        <li v-if="data.stage != 'Done'" v-on:click.prevent="" class="v-context__sub">
          <a>Re-assign</a>
          <ul class="v-context">
              <li>
                <a v-if="responsible != 'Kenneth'" @click="reAssign(data, 'Kenneth')">Kenneth</a>
                <a v-if="responsible != 'Welcome'" @click="reAssign(data, 'Welcome')">Welcome</a>
                <a v-if="responsible != 'Lindo'" @click="reAssign(data, 'Lindo')">Lindo</a>
                <a v-if="responsible != 'Moses'" @click="reAssign(data, 'Moses')">Moses</a>
              </li>
          </ul>
        </li>
        </template>
      <!--/ul-->   
   </vue-context>



</div>
</template>

<script>
//import draggable
//import { component as draggable } from "vuedraggable";
import addTask from '../../components/tasks/addTask'
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css'

export default {
  middleware: ['auth'],
  name: "kanban-board",
  components: {
    addTask,
    VueContext,
    //draggable
  },
  data() {
    return {
      edit: false,
      staging: [],
      st_end: 6,
      st_show: 'more',
      or_staging: [],
      progress: [],
      or_progress: [],
      testing: [],
      or_testing: [],
      done: [],
      d_end: 6,
      d_show: 'more',
      or_done: [],
      view: false,
      task: {},
      all_tasks: [],
      this_task: {},
      old_task: {},
      add_task: false,
      responsible: 'Kenneth',
      tasks: [],
      to_dos: [],
      task_todos: [],
      old_task_todos: [],
      changed_ids: [],
      changes: [],
      original_todos: [],
      delete: [],
      move: false,
      people: ['Kenneth', 'Welcome', 'Lindo', 'Moses'],
      task_changes: {}
     
    };
  },
  methods: {

    taskType(type) {
      if(type == 'Day Task') {
        return 'DT'
      }
      if(type == 'Quick Reminder') {
        return 'QR'
      }
      if(type == 'Mini Project') {
        return 'MP'
      }
      if(type == 'Project') {
        return 'PR'
      }
    },

    onEnd(evt, stage) {
      
      if(evt.hasOwnProperty('added')) {
        console.log('stage = ', stage)
        console.log('evt = ', evt)
        evt.added.element.stage = stage
        console.log('new element  = ', evt.added.element)
      }
      //console.log('onEnd called')
      this.move = true
    },

    onSort(evt) {
        console.log('onSort', evt)
    },

    async reAssign(data, person) {
         data.responsible = person
         data.assigned_by = this.$auth.user.username.split('.')[0]
         await this.$axios.$post('/reassign', data)
         await this.loadTasks()
    },

    async updateStatus(data, status) {
      let confirmed = false
      if(status == 'deleted') {
        if(confirm(`Are you sure you want to delete ${data.task}?`)) {
          confirmed = true
        }
      }
      else {
        confirmed = true
      }
      if(confirmed) {
         await this.$axios.$post('/update_task_status', {id: data.id, status: status})
      }
      await this.loadTasks()
    },

    activeTab(res) {
       this.responsible = res
       this.tasks = this.all_tasks.filter(t => t.responsible == this.responsible)
       this.original_todos = JSON.parse(JSON.stringify(this.to_dos))
        this.staging = this.tasks.filter(t => t.stage == 'Staging').sort((a,b) => a['prio'] - b['prio'])
        this.or_staging = JSON.parse(JSON.stringify(this.staging))
        this.progress = this.tasks.filter(t => t.stage == 'Progress').sort((a,b) => a['prio'] - b['prio'])
        this.or_progress = JSON.parse(JSON.stringify(this.progress))
        this.testing = this.tasks.filter(t => t.stage == 'Testing').sort((a,b) => a['prio'] - b['prio'])
        this.or_testing = JSON.parse(JSON.stringify(this.testing))
        this.done = this.tasks.filter(t => t.stage == 'Done').sort((a,b) => new Date(b.completed_on) - new Date(a.completed_on)) //.sort((a,b) => a['prio'] - b['prio'])
        this.or_done = JSON.parse(JSON.stringify(this.done))
    },

    unique(arr1, arr2) { //find new items added to a stage
      let new_items = []
      for(let i = 0; i<arr2.length; i++) {
          let found = arr1.find(item => item.task == arr2[i].task)
          if(found == undefined) {
            new_items.push(arr2[i])
          }
      }
      return new_items
    },

    async commitChanges() {

      let task_changes = []

      for(let i = 0; i<this.staging.length; i++) {
        this.staging[i].prio = i
        //let staging_changes = []
        let or_staging = this.or_staging.find(st => st.id == this.staging[i].id)
        if(or_staging != undefined) {
           if(this.staging[i].prio != or_staging.prio) {
             task_changes.push({prio: this.staging[i].prio, id: this.staging[i].id})
           }
        }
        else {
             task_changes.push({stage: this.staging[i].stage, prio: i, completed_on: null, id: this.staging[i].id})
        }
      }

      for(let i = 0; i<this.progress.length; i++) {
        this.progress[i].prio = i
        //let progress_changes = []
        let or_progress = this.or_progress.find(st => st.id == this.progress[i].id)
        if(or_progress != undefined) {
           if(this.progress[i].prio != or_progress.prio) {
             task_changes.push({prio: this.progress[i].prio, id: this.progress[i].id})
           }
        }
        else {
             task_changes.push({stage: this.progress[i].stage, prio: i, completed_on: null, id: this.progress[i].id})
        }
      }

      for(let i = 0; i<this.testing.length; i++) {
        this.testing[i].prio = i
        //let testing_changes = []
        let or_testing = this.or_testing.find(st => st.id == this.testing[i].id)
        if(or_testing != undefined) {
           if(this.testing[i].prio != or_testing.prio) {
             task_changes.push({prio: this.testing[i].prio, id: this.testing[i].id})
           }
        }
        else {
             task_changes.push({stage: this.testing[i].stage, prio: i, completed_on: null, id: this.testing[i].id})
        }
      }

      for(let i = 0; i<this.done.length; i++) {
        this.done[i].prio = i
        //let done_changes = []
        let or_done = this.or_done.find(st => st.id == this.done[i].id)
        if(or_done != undefined) {
           if(this.done[i].prio != or_done.prio) {
             task_changes.push({prio: this.done[i].prio, id: this.done[i].id})
           }
        }
        else {
             task_changes.push({stage: this.done[i].stage, prio: i, completed_on: this.today(), id: this.done[i].id})
        }
      }

      await this.$axios.$post('/update_stage2', {changes: JSON.stringify(task_changes)})
      await this.loadTasks()
      this.move = false
    },

    Tick(task) {
       if(task.done && task.finished == null) {
         task.finished = this.today()
       }
       if(!task.done) {
         task.finished = null
       }
    },

    today() {
      let newDate = new Date()
      let dt = ('0' + (newDate.getDate())).slice(-2)
      let mth = ('0' + (newDate.getMonth()+1)).slice(-2)
      let yr = (newDate.getFullYear()).toString()
      return (yr + '-' + mth + '-' + dt)
    },

    addToDo() {
      let to_do = {}
      to_do.task_id = this.task.id
      this.to_dos.push(to_do)
      this.viewTask(this.task)
    },

    removeToDo(index) {
      console.log('index = ', index)
      console.log('this.task_todos[index] = ', this.task_todos[index])
      if(confirm('Are you sure you want to delete this to do?')) {
          this.delete.push(this.task_todos[index])
          this.task_todos.splice(index,1)
      }
      
    },
   
    

    async closeTaskModal() {
      await this.loadTasks()
      this.add_task = false
    },

    /*taskToDos() {
      return this.to_dos.filter(t => t.task_id == this.task.id)
    },*/

    viewTask(element) {
      this.view = true; 
      this.task = element
      this.old_task = Object.assign({}, this.task)
      this.task_todos = this.to_dos.filter(t => t.task_id == element.id).sort((a,b) => a['prio'] - b['prio'])
      this.old_task_todos = JSON.parse(JSON.stringify(this.task_todos))
      //return this.to_dos.filter(t => t.task_id == element.id)
    },

    closeView() {
      if(!this.checkChanges()) {
        //this.old_task = {}
        //this.old_task_todos = []
        this.view = false
      }
      else {
        if(confirm('Close without saving?')) {
          this.to_dos = JSON.parse(JSON.stringify(this.original_todos))
          this.view = false
        }
      }
      
    },



    async loadTasks() {
        this.all_tasks = await this.$axios.$get('/tasks')
        this.tasks = this.all_tasks.filter(t => t.responsible == this.responsible)
        this.to_dos = await this.$axios.$get('/todos')
        this.original_todos = JSON.parse(JSON.stringify(this.to_dos))
        this.staging = this.tasks.filter(t => t.stage == 'Staging').sort((a,b) => a['prio'] - b['prio'])
        this.or_staging = JSON.parse(JSON.stringify(this.staging))
        this.progress = this.tasks.filter(t => t.stage == 'Progress').sort((a,b) => a['prio'] - b['prio'])
        this.or_progress = JSON.parse(JSON.stringify(this.progress))
        this.testing = this.tasks.filter(t => t.stage == 'Testing').sort((a,b) => a['prio'] - b['prio'])
        this.or_testing = JSON.parse(JSON.stringify(this.testing))
        this.done = this.tasks.filter(t => t.stage == 'Done').sort((a,b) => new Date(b.completed_on) - new Date(a.completed_on)); //sort((a,b) => a['prio'] - b['prio'])
        this.or_done = JSON.parse(JSON.stringify(this.done))
    },

    checkChanges() {
      //check task & task_todos
      let todo_change = false
      this.changed_ids = []
      this.changes = []
     
      for(let i = 0; i<this.task_todos.length; i++) {
        let obj = {}
        this.task_todos[i].prio = i
     
        let old_todo = this.original_todos.find(t => t.id == this.task_todos[i].id)
        if(old_todo != undefined) { //New task
          for(var key in old_todo) {
          let count = 0
          
            if(old_todo[key] != this.task_todos[i][key]) {
              count = count+1
              todo_change = true
              this.changed_ids.push(this.task_todos[i].id)
              if(count == 1) {
                obj.id = this.task_todos[i].id
              }
              obj[key] = this.task_todos[i][key]
              console.log(`${key} has changed from ${old_todo[key]} to ${this.task_todos[i][key]}`)
            } 
          }
        }
        else {
          todo_change = true
        }
        
        if(Object.keys(obj).length>0) {
          this.changes.push(obj)
        }
      }
      this.task_changes = {}
      for(var key in this.task) {
        //let len = Object.keys(this.task)
        if(this.task[key] != this.old_task[key]) {
            todo_change = true
            this.task_changes[key] = this.task[key]
        }
      }
      if(Object.keys(this.task_changes).length>0) {
          this.task_changes['id'] = this.task.id
      }
      console.log('this.to_dos.length = ', this.to_dos.length)
      console.log('this.original_todos.length = ', this.original_todos.length)
      if(this.to_dos.length > this.original_todos.length) {
        todo_change = true
      }
      
      console.log('this.delete from checkChanges = ', this.delete)

      if(this.delete.length>0) {
        console.log('this.delete.length = ', this.delete.length)
        todo_change = true
      }

      return todo_change
    },

    async saveChanges() {
      
      this.checkChanges()
      if(this.changes.length>0) {
        await this.$axios.$post('/modify_todos', {changes: JSON.stringify(this.changes)})
      }
     
      for(let i = 0; i<this.delete.length; i++) {
        console.log('detele todo = ', this.delete)
        await this.$axios.$post('/delete_todo', this.delete[i])
      }
        
      
      let old_length = this.original_todos.length
      let new_length = this.to_dos.length
      for(let i = old_length; i<new_length; i++) {
        if(this.to_dos[i].due != null) {
          console.log('adding new task', this.to_dos[i])
          await this.$axios.$post('/new_todo', this.to_dos[i])
        }
        else {
          alert("Please enter due dates for to dos")
          return false
        }
      }
      if(Object.keys(this.task_changes).length > 0) {
          await this.$axios.$post('/update_task', this.task_changes)
      }

      await this.loadTasks()
      this.view = false
      this.edit = false
      this.delete = []
    }
  },

  created: async function() {

    if(this.$auth.user.username !== 'Randal' && this.$auth.user.username !== 'Sam' && this.$auth.user.username !== 'kentest2') {
      this.responsible = this.$auth.user.username.split('.')[0]
      if(this.responsible == 'NCUBEM') {
        this.responsible = 'Moses'
      }
    }
    else {
      this.responsible = 'Kenneth'
      
    }
      await this.loadTasks()
  }
}; 

</script>

<style>
/* light stylings for the kanban columns */
.kanban-column {
  min-height: 350px;
}

#draggable:hover,
#draggable:focus {
  background-color: yellow;
  cursor: pointer;
}

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

.context-menu:hover,
.context-menu:focus {
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.blink {
  animation: blink 1.5s steps(1, end) infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}


</style>
