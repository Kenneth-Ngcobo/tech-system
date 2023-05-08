<template>
  <div>

  <h1 style="margin: 0 0 0 40%">TECH SYSTEM 2</h1>

    <div>
      <nuxt-link to="/sales">
        <b-button style="padding:50px; margin:2% 0 0 36%; width:162.36px; border-radius: 25px">Sales</b-button>
      </nuxt-link>
      <nuxt-link to="/production">
        <b-button style="padding:50px; margin:2% 0 0 2%; width:162.36px; border-radius: 25px">Production</b-button>
      </nuxt-link>
    </div>
  
    <div>
      <nuxt-link to="/ncr">
        
        <b-button style="padding:30px; margin:5% 0 0 36%; width:162.36px; height:125px; border-radius: 25px" ><span style="margin-left: 0%; margin-top:-15%; word-wrap: break-word">QC & Maintenance</span></b-button>
      </nuxt-link>
      <nuxt-link to="/testing">
        <b-button style="padding:50px; margin:5% 0 0 2%; width:162.36px; border-radius: 25px">Testing</b-button>
      </nuxt-link>
    </div>
    <!--div>
      <nuxt-link to="/specifier">
        <b-button style="padding:50px; margin:2% 0 0 36%; width:162.36px; border-radius: 25px">Specifier</b-button>
      </nuxt-link>
      <nuxt-link to="/boards">
        <b-button style="padding:50px; margin:2% 0 0 2%; width:162.36px; border-radius: 25px">Boards</b-button>
      </nuxt-link>
    </div>
    <div>
      <nuxt-link to="/drivers">
        <b-button style="padding:50px; margin:2% 0 0 36%; width:162.36px; border-radius: 25px">Drivers</b-button>
      </nuxt-link>
      <nuxt-link to="/tasks" v-if="$auth.user.username == 'Kenneth' || $auth.user.username == 'Welcome.M' || $auth.user.username == 'Lindo' || $auth.user.username == 'kentest2'">
        <b-button style="padding:50px; margin:2% 0 0 2%; width:162.36px; border-radius: 25px">Task Tracker</b-button>
      </nuxt-link>
    </div-->


  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
 middleware: ['auth'],
computed: {
      ...mapGetters({
          isLoggedIn: 'user/isLoggedIn',
          User: 'user/User',
          scannerStatus: 'getScannerStatus'
      })
  },

  data() {
    return {
      
    }
  }

}
</script>

<style scoped>


/*.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}*/

/*.title {
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
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}*/

/*.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}*/
</style>
