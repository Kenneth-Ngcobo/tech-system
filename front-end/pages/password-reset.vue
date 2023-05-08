<template>
<div>
    <center>
      <h3>Reset Password</h3>
      <h3 style="color: red">Remember your username is: {{displayUsername()}}</h3>
    </center>
    
    <div v-if="valid && !showMessage">
    <validation-observer v-slot="{handleSubmit}">
    <form @submit.prevent="handleSubmit(resetPassword)" class="my-form">
   
        <div class="form-group">
          <!--label for>Enter password</label-->
          <validation-provider  name="confirm"  rules="required" v-slot="{ errors }">
          <label class="col-md-3">Enter New Password: </label>
          <input :type="showPassword ? 'text' : 'password'" v-model="password" ref="password" placeholder="Enter New Password" />
          <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
        <div class="form-group">
          <!--label for>Enter password</label-->
          <validation-provider rules="required|password:@confirm" v-slot="{ errors }">
          <label class="col-md-3"> Confirm Password: </label>
          <input :type="showPassword ? 'text' : 'password'" v-model="confirmPass" placeholder="Confirm Password" />
          <span class="required">{{ errors[0] }}</span>
          </validation-provider>
        </div>
  
        <div>
          <input style="margin-left:25%" type="checkbox" @click="showPassword = !showPassword"> Show Password
        </div>
        <b-button type="submit" variant="outline-primary" style="width:130px; margin: 2% 0 0 25%;"  @click="resetPassword">Sumbit</b-button>
    </form>
    </validation-observer>
    </div>
    <div v-if="!valid">
      <center>
         <b-alert :variant="'danger'" show v-text="'This link has expired please request another password reset'"></b-alert>
         <nuxt-link to="/">
         <b-button variant="outline-primary" style="width:130px;">Go Home</b-button>
         </nuxt-link>
      </center>
     
    </div>
    <div v-if="showMessage">
      <center>
        <b-alert :variant="message.type" show v-text="message.text"></b-alert>
        <nuxt-link to="/login">
          <b-button variant="outline-primary" style="width:130px;">Login</b-button>
        </nuxt-link>
      </center>
    </div>

</div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, confirmed, password } from 'vee-validate/dist/rules';

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
    components: {
        ValidationProvider,
        ValidationObserver
    },
    computed: {

      showMessage(){
        return (this.message.text && (this.message.text.trim() !== ''));
      }
  },
    data() {
        return {
            password: '',
            confirmPass: '',
            showPassword: false,
            hash: [],
            valid: true,
            message: {
              type: 'danger',
              text: ''
            }
        }
    }, 

    methods: {
        async resetPassword() {
          let response = await this.$axios.$post('/reset_password', {password: this.password, username: this.hash[0].username})
          if(response.hasOwnProperty('type')) {
            if(response.type == 'ERROR') {
              this.message.text = response.message
            }
            else {
              this.message.type = 'success'
              this.message.text = response.message
            }
          }
        },

        today() {
            return new Date() //.toLocaleString().replace('/', '-') //.slice(0, 19)
        },

        displayUsername() {
          if(this.hash.length>0) {
            if(this.hash[0].hasOwnProperty('username')) {
              return this.hash[0].username
            }
          }
            
        }
    },

    created: async function() {
        console.log('this.$route = ', this.$route)
        if(this.$route.hasOwnProperty('query')) {
            if(this.$route.query.hasOwnProperty('hash')) {
              console.log('this.$route.query = ', this.$route.query)
              if(this.$route.query.hash != null) {
                if(this.$route.query.hash.length>0) {
                  console.log('this.$route.query.hash = ', this.$route.query.hash)
                  this.hash = await this.$axios.$get(`/password_reset/${this.$route.query.hash}`)
                  console.log('this.hash = ', this.hash)
                }
                else {
                  this.valid = false
                  console.log('Invalid hash')
                }
              }
              else {
                  this.valid = false
                  console.log('Invalid hash')
                }
          }
          else {
            this.valid = false
            console.log('Invalid hash')
          }

        }
        else {
            this.valid = false
            console.log('Invalid hash')
        }
        
        //console.log('route query', this.$route.query)
        if(this.hash.length>0) {
          if(this.hash[0].hasOwnProperty('date')) {
              console.log('today = ', this.today())
              let expiry_date = new Date(this.hash[0].date)
              expiry_date = expiry_date.setDate(expiry_date.getDate() + 1)
              expiry_date = new Date(expiry_date)
              console.log('expiry date = ', expiry_date)
              //console.log(this.today().getTime())
              var hours = (expiry_date - this.today()) / 36e5;
              
              console.log('hours = ', hours)
              if(hours > 0) {
                  this.valid = true
                  console.log('Valid hash')
              }
              else {
                  this.valid = false
                  console.log('Expired hash')
              }
          }
          else {
            this.valid = false
            console.log('Invalid hash')
          }
        }
        else {
            this.valid = false
            console.log('Invalid hash')
        }
    }
}
</script>

<style scoped>

.my-form {
  margin-left: 30%;
  margin-top: 3%
 
}
/*h3 {
  margin-left: 40%;
  margin-top: 50px;
}*/
.my-form .form-group {
  padding-bottom:15px;
}

.my-form input[type = 'text'], input[type="password"]{
  padding:8px;
  width:35%;
}

.required {
    color: red
}

</style>