<template>
  <div>
    <b-container fluid>
      <h5 class="title">
        Welcome to Tech Hub
      </h5>

      <b-row class="mt-5">
        <b-col></b-col>
        <b-col sm="10" md="6" lg="4" class="pb-2 text-center">
          <nuxt-link to="/register">
          <b-button variant="outline-primary" size="lg"  style="width:150px;">Register</b-button>
          </nuxt-link>
          <nuxt-link to="/login">
          <b-button variant="outline-primary" size="lg" style="width:150px;" class="ml-2">Login</b-button>
          </nuxt-link>
        </b-col>
        <b-col></b-col>
      </b-row>

      <!--b-row class="mt-5">
        <b-col class="pb-2 text-center">
        <input type="checkbox"  v-model="forgot">
        <label style="font-size: 20px; margin-left:1%; color: #007bff">Forgot Password?</label>
        </b-col>
      </b-row-->

      <b-row class="mt-2" v-if="forgot">
        <b-col class="pb-2 text-center">
        <label >Enter Email Address</label>
        <input type="text" style="width:250px" v-model="email">
        <b-button @click="resetEmail">Send</b-button>
        </b-col>
      </b-row>
      <b-row v-if="showMessage">
        <b-col class="pb-2 text-center">
          <b-alert :variant="message.type" show v-text="message.text"></b-alert>
        </b-col>
      </b-row>

      

    </b-container>

  </div> 
 
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  computed: {
      ...mapGetters({
          isLoggedIn: 'user/isLoggedIn'
      }),
      showMessage(){
        return (this.message.text && (this.message.text.trim() !== ''));
      }
  },
  data() {
    return {
      forgot: false,
      email: '',
      message: {
        type: 'danger',
        text: ''
      },
     
    }
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
    }
  },

  beforeCreate(){
    //console.log(this.$route.query)
    if(this.$auth.loggedIn)
    {
      this.$router.push('/home')
    }
  },
  mounted() {
    //console.log('index route.query = ', this.$route.query)
    //console.log('process.browser', process.browser)
    if(this.$route.query) {
      window.sessionStorage.query = JSON.stringify(this.$route.query);
    }
    else {
      console.log('Window is undefined')
    }
     
  }
}

</script>

<style scoped>
.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 50px;
}


</style>
