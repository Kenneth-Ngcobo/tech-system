<template>
<div>
    <b-button>New</b-button>
    <table class="table table-bordered">
        <thead>
            <th>Definition</th>
            <th>Init Design</th>
            <!--th>Prototyping</th>
            <th>Testing</th>
            <th>Detailed Design</th>
            <th>Final Testing & Documentation</th>
            <th>Handover</th-->
        </thead>
        <draggble  tag="tbody">
            
            <tr>
                <template>
                    <draggable>
                        <td>Test</td>
                        <td>Test2</td>
                    </draggable>
                </template>
               
                
            </tr>
             <tr>
                <draggable>
                    <td>Test3</td>
                    <td>Test4</td>
                </draggable>
                 
            </tr>
        
        </draggble>
       
    </table>
</div>
</template>

<script>

//import { component as draggable } from "vuedraggable";

export default {
   
   components: {
       // draggable
   }
    
}
</script>

<style scoped>

</style>