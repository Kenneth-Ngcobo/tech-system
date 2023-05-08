<template>
<div>
    <validation-observer v-slot="{handleSubmit}">
    <form @submit.prevent="handleSubmit(Submit)">
        <span class="close" @click="$emit('closeTaskModal')">&times;</span>
         <center>
             <h4>Add Task</h4>
        </center>
        <div class="row">
            <div class="col-lg-12">
                <div class="form-group">
                    <validation-provider  rules="required" v-slot="{ errors }">
                        <label class="col-md-2">Task Name</label>
                        <input type="text" style="width:400px" v-model="task.task">
                    <span class="required">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <div class="form-group">
                    <validation-provider  rules="required" v-slot="{ errors }">
                    <label class="col-md-2">Task Type</label>
                    <select v-model="task.type" style="width:170px">
                        <option value="">Select</option>
                        <option value="Quick Remainder">Quick Reminder</option>
                        <option value="Day Task">Day Task</option>
                        <option value="Mini Project">Mini Project</option>
                        <option value="Project">Project</option>
                    </select>
                    <span class="required">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                <div class="form-group">
                    <validation-provider  rules="required" v-slot="{ errors }">
                    <label class="col-md-2">Due</label>
                    <input type="date" v-model="task.due">
                    <span class="required">{{ errors[0] }}</span>
                    </validation-provider>
                </div>
                 <hr style="border:1px solid black">
                <!--h6 style="margin-left:1%">To Do List</h6-->
                <!--div class="form-group" style="margin-left:1%" >
                    <input type="checkbox" style="width:25px; height:20px" v-model="to_do.done">
                    <input type="text" style="width:600px;" v-model="to_do.to_do">
                    <input type="date" v-model="to_do.due">
                    <b-button @click="addTask()">Add</b-button>
                </div>
                <div class="form-group" style="margin-left:1%" v-for="(el,index) in to_dos" :key="index">
                    <!--span class="hide">=></span-c->
                    <input type="checkbox"  class="indent" style="width:25px; height:20px; margin-top: 0%" v-model="el.done">
                    <input type="text" style="width:600px" v-model="el.to_do">
                    <input type="date" v-model="el.due">
                    <span class="delete" @click="deleteTask(index)">&times;</span>
                </div-->
                <table style="margin-left:1%">
                    <thead>
                        <td></td>
                        <th>To Do</th>
                        <th>Due</th>
                        <td></td>
                    </thead>
                    <!--tbody-->
                    <!--draggable v-model="to_dos" tag="tbody"-->
                        <tr>
                            <td><input type="checkbox" style="width:25px; height:20px" v-model="to_do.done"></td>
                            <td><input type="text" style="width:600px;" v-model="to_do.to_do"></td>
                            <td><input type="date" v-model="to_do.due"></td>
                            <td><b-button @click="addTask()">Add</b-button></td>
                        </tr>
                        <draggable v-model="to_dos" tag="tbody">
                        <tr v-for="(el,index) in to_dos" :key="index">
                            <td scope="row"><input type="checkbox"  class="indent" style="width:25px; height:20px; margin-top: 0%" v-model="el.done"></td>
                            <td><input type="text" style="width:600px" v-model="el.to_do"></td>
                            <td><input type="date" v-model="el.due"></td>
                            <td><span class="delete" @click="deleteTask(index)">&times;</span></td>
                        </tr>
                    </draggable>
                    <!--/tbody-->
                </table>
            </div>
        </div>
        <center>
             <b-button type="submit" style="margin-top:1%">Submit</b-button>
        </center>
    </form>
    </validation-observer>
</div>
</template>

<script>

import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, confirmed, password } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required'
});

export default {
    props: ['responsible'],
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            count: 1,
            task: {
                task: '',
                type: '',
                responsible: '',
                assigned_by: '',
                stage: 'Staging',
                due: null,
            },
           
            to_do: {
                done: false,
                to_do: '',
                due: null, 
                finished: null
            }, 
            to_dos: [],
            tasks: []
        }
    },

    methods: {

        deleteTask(index) {
            console.log('index = ', index)
            console.log(this.to_dos)
            this.to_dos.splice(index, 1)
        },

        addTask() {
            if(this.to_do.due != null) {
                this.to_dos.push(this.to_do)
                this.to_do = {
                                done: false,
                                to_do: '',
                                due: null,
                }
                if(this.task.due == null) {
                    let dates = []
                    for(let i = 0; i<this.to_dos.length; i++) {
                        dates.push(new Date(this.to_dos[i].due))
                    }
                    console.log('dates = ', dates)
                    let maxDate = new Date(Math.max.apply(null, dates))
                    console.log('maxDate = ', maxDate)
                    console.log('maxDate = ', maxDate.toISOString().split('T')[0])
                    this.task.due = maxDate.toISOString().split('T')[0]
                }
            }
            else {
                alert("Please enter due date for to do")
            }
        },

        async Submit() {
            if(this.to_do.to_do.length>0 && this.to_do.due.length>0) {
                this.to_dos.push(this.to_do)
                this.to_do = {
                    done: false,
                    to_do: '',
                    due: '', 
                } 
            }
        
     
            this.task.responsible = this.responsible
            this.task.assigned_by = this.$auth.user.username
            this.task.prio = this.tasks.length
            let to_dos = JSON.stringify(this.to_dos)
            let task = JSON.stringify(this.task)
            await this.$axios.$post('/tasks', {to_dos: to_dos, task: task})
    
            this.$emit('closeTaskModal')
        },

       

    },

    created: async function() {
        this.tasks = await this.$axios.$get(`/tasks/${this.responsible}`)
    }
}
</script>

<style scoped>

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
  cursor:
   pointer;
}

.delete {
    font-size:30px; 
    font-weight: bold
}
.delete:hover,
.delete:focus {
    color: red;
}
.hide {
    display: block;
}

.indent:hover + .hide {
    display: block;
}

.required {
    color: red
}

</style>