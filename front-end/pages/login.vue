<template>
  <div>
    <div v-if="submitted">
     
    </div>

    <div v-if="!submitted">
    <h3>Login</h3>

    <b-alert v-if="showMessage" :variant="message.type" show v-text="message.text"></b-alert>

    <form @submit.prevent="submitForm" class="my-form">
      <div class="form-group">
        <!--label for>Enter username</label-->
        <input type="text" v-model="userInfo.username" placeholder="Enter username" />
      </div>
      <div class="form-group">
        <!--label for>Enter password</label-->
        <input :type="showPassword ? 'text' : 'password'" v-model="userInfo.password" placeholder="Enter password" />
      </div>
      <div>
      <input type="checkbox" @click="showPassword = !showPassword"> Show Password
      <input type="checkbox" style="margin-left:2%" v-model="forgot"> Forgot Password?
      </div>
      <br>
      <span v-if="!forgot">
        <b-button type="submit" variant="outline-primary" style="width:130px;" >Login</b-button>
        <nuxt-link to="/register" style="margin-left:5%">Register</nuxt-link>
      </span>
      

       

       <div v-if="forgot">
          <label >Enter Email Address</label>
          <input type="text" placeholder="Enter Email Address" v-model="email">
          <b-button @click="resetEmail">Send</b-button>
        </div>
      
    </form>
    <!--div style="margin-top:2%" v-if="showMessage">
          <center>
            <b-alert :variant="message.type" show v-text="message.text"></b-alert>
          </center>
        </div-->
    </div>
    
    
  </div>
</template>

<script>
//import axios from "axios";

import {mapGetters} from 'vuex'

export default {
  name: "login",

  data: function() {
    return {
      userInfo: {
        username: "",
        password: "",
        sessionID: ""
      },
      submitted: false,
      showPassword: false,
      message: {
        type: 'danger',
        text: ''
      },
      forgot: false,
      email: '',
      message: {
        type: 'danger',
        text: ''
      }
    };
  },
  computed: {
    showMessage(){
      return (this.message.text && (this.message.text.trim() !== ''));
    },
    ...mapGetters({
           isLoggedIn: 'user/isLoggedIn',
           isAdmin: 'user/isAdmin'
       })
  },
  methods: {

    async resetEmail() {

     let result = await this.$axios.$post('/reset_email', {email: this.email})
     console.log('result = ', result)
     if(result.hasOwnProperty('type')) {
       if(result.type == 'ERROR') {
         this.message.text = result.message
         console.log('result.message = ', result.message)
       }
     }
     else {
       this.forgot = false
       this.message.type = 'success'
       this.message.text = `Email has been sent to ${result.email}`
     }
    },
     
    async submitForm() {
      //console.log(this.userInfo);
      this.userInfo.sessionID = this.sessionID()
      //console.log('this.userInfo = ', this.userInfo)
      //console.log('redirect before = ', this.$auth.query.redirect)
      try {
        let response = await this.$auth.loginWith('local', { data: this.userInfo })
        console.log('login response = ', response);
        if(response.hasOwnProperty('data'))
        {
          if(response.data.hasOwnProperty('type'))
          {
            if(response.data.type == 'OK')
            {
              if(response.data.hasOwnProperty('user') && (JSON.stringify(response.data.user) !== '{}'))
              {
                //console.log('Login user data =',response.data.user);
                await this.$auth.setUser(response.data.user);
                //this.$store.commit('user/SET_NAME','Phuti 2');
                window.sessionStorage.currentUser = JSON.stringify(response.data.user);
                //let scannerId = this.sessionID();
                //window.sessionStorage.sessionID = scannerId;
                //this.$store.commit('scanner/SET_SCANNER_ID',scannerId)
                //this.$store.commit('SET_SCANNER_ID',scannerId)
                //this.$store.commmit('parts/')
                //console.log('Login.vue store = ', this.$store)
                //console.log('store state = ', this.$store.state)
                //console.log('store scanner = ', this.$store.scanner)
                //this.$connect()
                //console.log('window.sessionStorage.query ', window.sessionStorage.query)
                let path = JSON.parse(window.sessionStorage.query)
                if(Object.keys(path).length>0) {
                  //console.log(`/ncr/${path.ncr}`)
                  this.$router.push(`/ncr/${path.ncr}`)
                }
                else {
                  console.log('this.$auth.user = ', this.$auth.user)
                  if(this.$auth.user.role == 'sales') {
                    this.$router.push('/home2')
                  }
                  else{
                    this.$router.push('/home')
                  }
                  
                }
               // let redirect_url = this.$route.query.redirect || '/home'
                //console.log('redirect_url = ', this.$route.query)
                //this.$router.push(redirect_url)
              }
            } else {
              this.message.text = 'Invalid Login';
            }
            
          }
          
        }
        
      } catch (err) {
        console.log(err)
      }

      

     /* const { data } = await this.$axios.$post("", this.userInfo)
      .then(this.$store.state.loggedIn = true);
      this.$store.state.token = data.jwt;
      //this.submitted = true;
      this.$store.state.username = data.user.username
      //console.log(this.$store.state.loggedIn);
      
      */
      
    },

    sessionID() {
        return Math.random().toString(36).substring(3)
    }
  },
  beforeCreate(){
    if(this.$auth.loggedIn)
    {
      this.$router.push('/home')
    }
  },
  created() {
   console.log('isLoggedIn = ', this.isLoggedIn)
  }
};

/*this.submitted = true;
        this.$auth.loginWith('local', {
            data: this.userInfo
        }).then(() => this.$toast.success('Logged In!'))
        .catch(e => {
          console.log("error:", e)
        })
     
  }*/
</script>

<style scoped>
.my-form {
  margin-left: 30%;
}
h3 {
  margin-left: 30%;
  margin-top: 50px;
}
.my-form .form-group {
  padding-bottom: 15px;
}

.my-form label {
  display: block;
}

.my-form input[type=text], input[type=password] {
  padding: 8px;
  width: 50%;
}

.my-form button {
  margin-left: 0%;
  
}

.my-form button:hover {
  background-color: cyan;
  
}

.my-form input[type=checkbox] {
  margin-left: 0%;
  
}


</style>