<template>
  <div class="container-fluid">
    <div class="row" style="background-color:lightgreen; position:relative; width: 100%; top:0; z-index: 1">
   
      <AppHeader v-if="isLoggedIn" class="nav justify-content-start col-md-10 appHeader" @Open="Open" @Close="Close" ref="childClose" /> <!--@Open="Open" @Close="Close" ref="childClose"-->
      <nav v-if="isLoggedIn" class="nav justify-content-end nav-pills col-md-2"> <!--v-if="isLoggedIn"-->
         <h6>Logged in: {{$auth.user.username}}</h6> <!--{{$auth.user.username}}-->
          <a class="nav-link"  @click.prevent="Logout"  href="#" data-toggle="pills">Logout</a>
      </nav>
    </div>
    <span @click="Close">
    <Nuxt id="Nuxt" style="margin-top:1%"/>
    </span>
    <!--link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"/-->
  </div>
</template>

<script>
/*import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';*/
import '../node_modules/@fortawesome/fontawesome-free/css/brands.css'
import '../node_modules/@fortawesome/fontawesome-free/css/regular.css'
import '../node_modules/@fortawesome/fontawesome-free/css/solid.css'
import '../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css'
import AppHeader from "../components/AppHeader";
import {mapGetters} from 'vuex';

export default {
  components: {
    AppHeader,
    //AutoLogout
  },
  data() {
    return {
       open: false,
    }
  },

  computed: {
      ...mapGetters({
        isLoggedIn: 'user/isLoggedIn',
        isAdmin: 'user/isAdmin'
      })
  },
  methods: {
      async Logout() {
      //this.$store.state.token = null;

      await this.$auth.logout();
      window.sessionStorage.currentUser = JSON.stringify({})
      window.sessionStorage.sessionID = ''
      //this.$disconnect(); // Websocket disconnect
      this.$router.push("/");
    },

    Open() {
      document.getElementById("Nuxt").style.marginLeft = "170px";
      this.open = true
    },

    Close() {
      if(this.open) {
        document.getElementById("Nuxt").style.marginLeft = "0px";
        //console.log('close clicked')
        //this.$emit('closeNav')
        this.open = false
        this.$refs.childClose.closeNav()
        return true
      }
    },

  },

  mounted(){
    //console.log("window.sessionStorage =",window.sessionStorage)

    if(window.sessionStorage.hasOwnProperty('currentUser'))
    {
      if(JSON.parse(window.sessionStorage.currentUser).hasOwnProperty('username')) { 
        this.$auth.setUser(JSON.parse(window.sessionStorage.currentUser))
      }
    }

    //window.addEventListener('resize', this.widthMethod)
  
    
  },
}

</script>


<style>

@media (min-width: 576px)
{
  .form-inline label {
      display: inline-block;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      margin-right:5px;
      margin-left:5px;
  }
}

.nav-link {
  color: rgb(7, 7, 7);
}

h6 {
  margin-top: 10px;
}

#Nuxt {
  transition: 0.5s;
}

</style>
