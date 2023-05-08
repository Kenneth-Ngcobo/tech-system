<template>
<div>
    <h6>Authorize users</h6>
    <table class="table table-bordered table-hover grid">
        <thead>
            <tr>
                <th>#</th>
                <th>Username</th>
                <th>Name & Surname</th>
                <th>Email</th>
                <th>User role</th>
                <th>Authorize</th>
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="(user,index) in unauth_users"
            :key="user.userId"
            >
            <td>{{index+1}}</td>
            <td>{{user.username}}</td>
            <td>{{nameAndSurname(index)}}</td>
            <td>{{user.email}}</td>
            <td><select v-model="user.role">
                <option value="" disabled selected>Select user role</option>
                <option value="1">Admin</option>
                <option value="2">Technical</option>
                <option value="3">Sales</option>
                </select></td>
            <td><b-button v-on:click="Authorize(user)">Authorize</b-button></td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    middleware: ['auth'],
    data() {
        return {
            unauth_users: [],
         
        }
    },


    methods: {
       async Authorize(user) {
           //console.log(userId)
            await this.$axios.$post('/authorize', {
                    userId: user.userId,
                    role: user.role,
                    email: user.email,
                    name: user.name})

            this.unauth_users = await this.$axios.$get('/users')
        },

         nameAndSurname(index) {
            return this.unauth_users[index].name + ' ' + this.unauth_users[index].surname
        }
    },

    created: async function() {
        this.unauth_users = await this.$axios.$get('/users')
    }
        
}
</script>

<style scoped>

</style>