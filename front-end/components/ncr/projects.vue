<template>
<div>

    <b-button @click="add = true" style="margin-bottom:1%">Add</b-button>

    <table class="table table-bordered">
        <thead>
            <th>SO</th>
            <th>Project</th>
            <th>Region</th>
            <th>Status</th>
            <th>Client</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Team</th>
        </thead>
        <tbody>
            <tr v-for="p in projects" :key="p.id">
                <td>{{p.so}}</td>
                <td>{{p.name}}</td>
                <td>{{p.region}}</td>
                <td>{{p.status}}</td>
                <td>{{p.client}}</td>
                <td>{{p.start_date}}</td>
                <td>{{p.end_date}}</td>
                <td>{{p.team}}</td>
            </tr>
        </tbody>
    </table>

    <div v-if="add" id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content" style="width:95%">
            <add-project @closeAdd="closeAdd" @loadProjects="loadProjects"></add-project>
        </div>
    </div>

</div>
</template>

<script>
import addProject from '../../components/ncr/add_project.vue'
    export default {

        components: { addProject },

        data() {
            return {
                add: false,
                projects: []
            }
        },

        methods: {
            closeAdd() {
                this.add = false
            },

            async loadProjects() {
                this.projects = await this.$axios.$get('/maint_projects')
                this.add = false
            }
        },

        created: async function() {
            await this.loadProjects()
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
  margin: 2% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
  word-wrap: break-word;
}





</style>