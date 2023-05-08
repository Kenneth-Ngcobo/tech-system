<template>

<div> <!--class="nav justify-content-start nav-pills cstm-class" v-if="isLoggedIn"-->

<div id="mySidenav" class="sidenav">
  <a href="javascript:void(0)" class="closebtn" style="background-color: black; width:100%"  @click="closeNav()">Close</a> <!--class="closebtn"--&times;-->
  <span @click="closeNav()">
  <nuxt-link  class="nav-link" to='/user'>{{$auth.user.name}}</nuxt-link>
  </span>
  <span @click="closeNav()">
  <nuxt-link  class="nav-link" to='/testing'>Testing</nuxt-link>
  </span>
  <span @click="closeNav()">
  <nuxt-link class="nav-link" to='/specifier'>Product Specifier</nuxt-link>
  </span>
  <!--span @click="closeNav()">
  <nuxt-link class="nav-link" to='/rfi'>RFI</nuxt-link>
  </span-->
   <span @click="closeNav()">
  <nuxt-link class="nav-link" to='/drivers'>Drivers & EM Matrix</nuxt-link>
  </span>
  <span @click="closeNav()">
  <nuxt-link class="nav-link" to='/boards'>Boards</nuxt-link>
  </span>
   <span @click="closeNav()">
  <nuxt-link class="nav-link" to='/tasks'>Task Tracker</nuxt-link>
  </span>
  <span @click="closeNav()">
    <nuxt-link class="nav-link" to='/sales'>Sales</nuxt-link>
  </span>
</div>

<!-- Use any element to open the sidenav -->

<div class="row">

<div @click="openNav()" class="col-md-1">
    <i style="padding:10px;" class="fa fa-bars"></i>
</div>

<!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page -->
<!--div id="main">
  
</div--> <!-- END OF MAIN SPAN------>
<ul class="nav nav-pills col-md-11" id="Menu">
    <li class="nav-item" id="Home"  @click="active = 'Home'">
        <nuxt-link :class="{'nav-link' : true, 'active': active == 'Home'}" data-toggle="pill" to='/home'>Home</nuxt-link>
    </li>

    <li class="nav-item" @click="active = 'Jobs'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Jobs'}" to='/testing'>Testing</nuxt-link>
   </li>

    <li class="nav-item" id="Home" @click="active = 'Components'">
        <nuxt-link :class="{'nav-link' : true, 'active': active == 'Components'}" to='/calculator'>Linera Calc</nuxt-link>
    </li>

     <!--li class="nav-item" @click="active = 'Boms'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Boms'}" to='/rfi'>RFI</nuxt-link>
    </li-->

    <li class="nav-item" @click="active = 'Pos'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Pos'}" to='/drivers'>Drivers & EM Matrix</nuxt-link>
   </li>
    <li class="nav-item" @click="active = 'Boards'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Boards'}" to='/boards'>Boards</nuxt-link>
   </li>
    <li class="nav-item" @click="active = 'QC & Maintenance'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'QC & Maintenance'}" to='/ncr'>QC & Maintenance</nuxt-link>
   </li>
   <li class="nav-item" @click="active = 'SFA Forecast'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'SFA Forecast'}" to='/sales'>Sales</nuxt-link>
   </li>
   <li class="nav-item" @click="active = 'Tech Tasks'" v-if="$auth.user.username == 'Kenneth' || $auth.user.username == 'Welcome.M' || $auth.user.username == 'Lindo' || $auth.user.username == 'NCUBEM' || $auth.user.username == 'kentest2'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Tech Tasks'}" to='/tasks'>Task Tracker</nuxt-link>
   </li>
   <li class="nav-item" @click="active = 'Production'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Production'}" to='/production'>Production</nuxt-link>
   </li>
   <li class="nav-item" @click="active = 'Design'">
       <nuxt-link :class="{'nav-link' : true, 'active': active == 'Design'}" to='/design'>Design</nuxt-link>
   </li>
     <li class="nav-item" id="validateUsers" @click="active = 'Authorize'" v-if="isAdmin">
        <nuxt-link :class="{'nav-link' : true, 'active': active == 'Authorize'}" to='/authorize'>Authorize Users <b-badge v-if="authorize>0">{{authorize}}</b-badge></nuxt-link> <!-- v-if="isAdmin"-->
    </li>

  </ul>
</div>

</div> <!-- END OF TEMPLATE SPAN------>

</template>

<script>
import {mapGetters} from 'vuex'
export default {
   name: 'AppHeader',
   props: ['open'],
   data() {
     return {
       active: '',
       authorize: ''
     }
   },

   computed: {
       ...mapGetters({
           isLoggedIn: 'user/isLoggedIn',
           isAdmin: 'user/isAdmin'
       })
   },
   methods: {
        openNav() {
            document.getElementById("mySidenav").style.width = "170px";
            document.getElementById("Menu").style.marginLeft = "170px";
            this.$emit('Open')
           
        },

/* Set the width of the side navigation to 0 */
        closeNav(active) {
            this.active = active
            if(document.getElementById("mySidenav") != undefined && document.getElementById("Menu") != undefined ) {
                document.getElementById("mySidenav").style.width = "0";
                document.getElementById("Menu").style.marginLeft = "0px";
                this.$emit('Close') 
            }
           
            
        }
   },
   created: async function() {
    let unauth_users = await this.$axios.$get('/users')
    this.authorize = unauth_users.length
  }
}
</script>

<style scoped>

/* The side navigation menu */
.sidenav {
  height: 100%; /* 100% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0; /* Stay at the top */
  left: 0;
  background-color: rgb(36, 138, 36); /* Black*/
  border-width: 100px;
  border-color: red;
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 50px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}

/* The navigation menu links */
.sidenav a {
  padding: 0px 0px 8px 10px;
  text-decoration: bold;
  font-size: 20px;
  color: white;
  display: block;
  /*transition: 0.1s;*/
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover {
  color: #626ab9;
}

/* Position and style the close button (top right corner) */
.sidenav .closebtn {
  position: absolute;
  top: 0;
  /*right: 25px;*/
  font-size: 22px;

  /*margin-left: 50px;*/
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */
#main {
  transition: margin-left .5s;
  padding: 20px;
}

#Menu {
  transition: 0.5s;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

</style>