<template>
<div>
 <h5 style="margin-top: 8px">Welcome, {{$auth.user.name}}!</h5>
 <table>
     <tbody>
         <tr><td class="label">Name</td>
         <td style="width: 80px"></td>
         <td>{{$auth.user.name}}</td></tr>
         <tr><td class="label">Username</td>
        <td></td>
        <td>{{$auth.user.username}}</td></tr>
         <tr><td class="label">Email</td>
          <td></td>
         <td>{{$auth.user.email}}</td> </tr>
         <tr><td class="label">Rank</td>
          <td></td>
         <td>{{$auth.user.role}}</td></tr>
         <!--tr><td class="label">Password</td>
          <td></td>
          <td>{{$auth.user.password}}</td></tr-->
     </tbody>
 </table>
 <b-button style="margin-top: 8px" v-on:click="change_password = true">Change Password</b-button>
 <form style="margin-top: 15px" v-if="change_password">
     <div>
     <label class="control-label col-sm-2">Old Password</label>
     <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.old_password">
     </div>
     <div>
     <label class="control-label col-sm-2">New Password</label>
     <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.new_password">
     </div>
     <div>
     <label class="control-label col-sm-2" >Confirm Password</label>
     <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.password_conf">
     </div>
     <div>
      <input type="checkbox" @click="showPassword = !showPassword" style="margin-left:17%"> Show Password
      </div>
     <b-button v-on:click="submit()" style="margin-left:17%; margin-top:3px">Submit</b-button>
 </form>
</div>
</template>

<script>
export default {
     middleware: ['auth'],
     data() {
         return {
             change_password: false,
             showPassword: false,
             userInfo: {
                username: this.$auth.user.name,
                old_password: '',
                new_password: '',
                password_conf: ''
             }
         }
     },
     methods: {
         async submit() {
            if(this.userInfo.new_password == this.userInfo.password_conf) {
            //console.log(this.userInfo)
            let response = await this.$axios.$post('/post/change_password', this.userInfo )
            if(response.hasOwnProperty('type')) {
                if(response.type == 'SUCCESS') {
                    alert("Password succesfully changed!")
                    await this.$auth.logout();
                    window.sessionStorage.currentUser = JSON.stringify({})
                    this.$router.push("/");
                }
                else {
                    alert("Password change failed :(")
                }
            }
            this.change_password = false
            console.log('Change password response = ', response)
            }
            else {
                alert("The password doesn't match")
            }
         }
     }
}
</script>

<style lang="css" scoped>
.label {
    color:dimgray
}

</style>