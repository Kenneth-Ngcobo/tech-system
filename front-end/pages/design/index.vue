<template>
<div>
  <b-card no-body >
        <b-tabs card >
            <b-tab title="Product Development">
                <product-dev></product-dev>
            </b-tab>
            <b-tab title="Design Request">
               <design-request></design-request>
            </b-tab>
        </b-tabs>
  </b-card>
 
   
</div>
</template>

<script>
import designRequest from '../../components/design/designRequest'
import productDev from '../../components/design/productDev'


export default {
    middleware: ['auth'],

    components: { designRequest, productDev },

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