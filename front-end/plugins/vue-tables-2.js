import Vue from "vue";
import { ClientTable } from "vue-tables-2";

//import { library } from '@fortawesome/fontawesome-svg-core'
//import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


//Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(ClientTable, {
    skin: 'table table-hover table-bordered',
    sortIcon: {
      base : 'fas',
      is: 'fa-sort',
      up: 'fa-sort-up',
      down: 'fa-sort-down'
    }
}, false,'bootstrap4');

Vue.config.productionTip = false