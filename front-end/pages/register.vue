<template>
  <div id="register">

    <span v-if="showMessage">
    <b-alert show :variant="message.type">{{message.text}}</b-alert>
    </span>

    <div v-if="!submitted">
      <h3>Register</h3>
      <validation-observer v-slot="{handleSubmit}">
      <form  @submit.prevent="handleSubmit(submitForm)" class="my-form"> <!-- @submit.prevent="handleSubmit(addTest)"-->
        <div class="col-md-12">
        <div class="form-group">
          <!--label for>Enter username</label-->
           <validation-provider  rules="required" v-slot="{ errors }">
          <label  class="col-md-1">Username: </label>
          <input type="text" v-model="userInfo.username" placeholder="Enter username" />
           <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter username</label-->
           <validation-provider  rules="required" v-slot="{ errors }">
          <label class="col-md-1">Name: </label>
          <input type="text" v-model="userInfo.name" placeholder="Enter name" />
          <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter username</label-->
          <validation-provider  rules="required" v-slot="{ errors }">
            <label class="col-md-1">Surname: </label>
          <input type="text" v-model="userInfo.surname" placeholder="Enter surname" />
          <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <label class="col-md-1">Email: </label>
          <validation-provider name="email" rules="required|email" v-slot="{ errors }">
          <input type="text" v-model="userInfo.email" placeholder="Enter email address" />
           <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <validation-provider  name="confirm"  rules="required" v-slot="{ errors }">
          <label class="col-md-1">Password: </label>
          <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.password" ref="password" placeholder="Enter password" />
          <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <validation-provider rules="required|password:@confirm" v-slot="{ errors }">
          <label class="col-md-1">Password: </label>
          <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.confirmPass" placeholder="Confirm password" />
          <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div>
          <input id="show-pass" type="checkbox" @click="showPassword = !showPassword"> Show Password
        </div>
        <br>
          <b-button variant="outline-primary" href="/" style="width:130px;" >Go Home</b-button>
          <b-button type="submit" variant="outline-primary" style="width:130px;" class="ml-2">Register</b-button>
        </div>
      </form>
      </validation-observer>
    </div>

    <div v-if="submitted">
      <b-button variant="outline-primary" href="/login" style="width:130px; margin-left: 50%" >Login</b-button>
    </div>
    <!--div style="margin-left:50%">
      <input type="checkbox" @click="showPassword = !showPassword">
        <span>Show Password</span>
    </div-->
    
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, confirmed, password } from 'vee-validate/dist/rules';

// No message specified.
extend('email', {
    ...email,
    message: 'Please enter a valid email'
    });

// Override the default message.
extend('required', {
  ...required,
  message: 'This field is required'
});

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Please make sure the passwords match'
});

export default {
name: "register",
components: {
    ValidationProvider,
    ValidationObserver
  },
computed:{
  showMessage(){
    return (this.message.hasOwnProperty('text') && (this.message.text.trim() !== '')) ? true : false;
  }
},
data: function() {
    return {
      userInfo: {
        username: "",
        name: "",
        surname: "",
        role: "",
        email: "",
        password: "",
        confirmPass: ""
      },
      message: {
        text: '',
        type: 'danger'
      },
      showPassword: false,
      submitted: false,
      users: [],
      user_exists: false
     
    };
  },

 

methods: {
   
  checkUser() {
    this.user_exists = false
    for(let i = 0; i<this.users.length; i++) {
      if(this.users[i].username.trim().toLowerCase() == this.userInfo.username.trim().toLowerCase()) {
        this.user_exists = true
      }
    }
  },

   async submitForm() {
    await this.checkUser()
    if(!this.user_exists) {
        this.message.type = 'danger';
        this.message.text = '';

        let res = await this.$axios.$post('/register', this.userInfo);
        //console.log(res);
        if(res.hasOwnProperty('type'))
        {
          this.message.text = res.message || ''; 
          if(res.type == 'OK')
          {
            this.message.type = 'success';
            this.message.text = 'You have successfully registered, please login';
            this.submitted = true;
          }
        }
    
      }
      else {
        alert("Username already taken")

    }
   

   }
  },
  created: async function() {
      this.users = await this.$axios.$get('/all_users')
  }

}

</script>

<style scoped>
.my-form {
  margin-left: 20%;
 
}
h3 {
  margin-left: 30%;
  margin-top: 50px;
}
.my-form .form-group {
  padding-bottom:15px;
}

/*.my-form label{
  display:inline;
  
}*/

.my-form input[type = 'text'], input[type="password"]{
  padding:8px;
  width:45%;
}

#show-pass {
  margin: 0px;
  padding: 0px;
}

.required {
    color: red
}
</style>