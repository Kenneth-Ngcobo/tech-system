<template>
<div>
  <b-card no-body >
        <b-tabs card >
            <b-tab title="Drivers">
                <drivers></drivers>
            </b-tab>
            <b-tab title="Emergency Matrix">
              <emergency></emergency>
            </b-tab>
        </b-tabs>
  </b-card>
 
   
</div>
</template>

<script>
import drivers from '../../components/drivers/drivers'
import emergency from '../../components/drivers/emergency.vue'


export default {
    middleware: ['auth'],

    components: { drivers, emergency},

    data() {
        return {
           
        }
    },

    methods: {

        

    },

    created: async function() {
        

    }
    
}
</script>

<style scoped>

</style>