<template>
<div>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    </head>
    <form>
        <span class="close" style="margin-top: -2%" @click="$emit('closeModal')">&times;</span>
        <div class="row">
        <div class="col-lg-6 float-left" style="margin-top:2%">
            <div class="form-group">
                <label class="col-md-3">Product Name</label>
                <input type="text" v-model="log.product_name" @click="edit = 1" :readonly="edit != 1">
            </div>
            <div class="form-group">
                <label class="col-md-3">Wattage</label>
                <input type="text" v-model="log.wattage" @click="edit = 2" :readonly="edit != 2">
            </div>
            <div class="form-group">
                <label class="col-md-3">Current</label>
                <input type="text" v-model="log.current" @click="edit = 3" :readonly="edit != 3">
            </div>
            <div class="form-group">
                <label class="col-md-3">Board</label>
                <input type="text" v-model="log.board"  @click="edit = 4" :readonly="edit != 4">
            </div>
             <div class="form-group">
                <label class="col-md-3">Reason</label>
                <textarea cols="32" rows="3" type="text" v-model="log.reason"  @click="edit = 5" :readonly="edit != 5"></textarea>
            </div>
            <div class="form-group">
                <label class="col-md-3">CCT</label>
                <input type="text" v-model="log.cct"  @click="edit = 6" :readonly="edit != 6">
            </div>
            
        </div>
        <div class="col-lg-6 float-right" style="margin-top:2%">
            <div class="form-group">
                <label class="col-md-3">Lens/Cover</label>
                <input type="text" v-model="log.lens_cover"  @click="edit = 6" :readonly="edit != 6">
            </div>

             <div class="form-group">
                <label class="col-md-3">Status</label>
                <input type="text" v-model="log.pass"  @click="edit = 7" :readonly="edit != 7">
            </div>
             <div class="form-group">
                <label class="col-md-3">Approved</label>
                <input type="text" v-model="log.approved"  @click="edit = 8" :readonly="edit != 8">
            </div>
             <div class="form-group">
                <label class="col-md-3">Approved By</label>
                <input type="text" v-model="log.approved_by"  readonly>
            </div>
             <div class="form-group">
                <label class="col-md-3">Test Comments</label>
                <textarea cols="32" rows="3" type="text" v-model="log.test_comments"  @click="edit = 10" :readonly="edit != 10"></textarea>
            </div>
            <div class="form-group">
                <label class="col-md-3">Report</label>
                <i class="fa fa-file-pdf-o" style="font-size:35px;color:red" @click="openReport(log.report)"></i>
                <!--b-button style="margin-left:2%">Change Report</b-button-->
                 <input type="file" style="margin-left:3%" ref="file" accept=".pdf" @change="handleFileUpload()"> <!-- @change="handleFileUpload()"-->
            </div>
            <div v-if="log.test == 'Photometric'" class="form-group">
                <label class="col-md-3">IES</label>
                <i v-if="log.ies != null" class="fa fa-download" aria-hidden="true" @click="openIES(log.ies)"></i>
                <!--b-button style="margin-left:2%">Change Report</b-button-->
                 <input type="file" style="margin-left:6%" ref="ies" accept=".ies" @change="handleIESUpload()"> <!-- @change="handleFileUpload()"-->
            </div>
        </div>
        </div>
    </form>
    <center>
        <b-button style="" @click="saveChanges">Save</b-button>
    </center>

</div>
</template>

<script>
export default {
    props: ['log'],
    data() {
        return {
            edit: 0,
            change_report: false,
            original_log: {},
            file: null,
            ies: null,
            
        }
    },

    methods: {
         openReport(path) {
            //uploads/file-1618943984147-AQUA%20FITTING%20THERMAL%20REPORT.docx
            window.open('http://it-foundry:3001/uploads/'+path);  //http://it-foundry:3001/uploads/
        },

        openIES(path) {
            //uploads/file-1618943984147-AQUA%20FITTING%20THERMAL%20REPORT.docx

            window.open('http://it-foundry:3001/uploads/'+path);  //http://it-foundry:3001/uploads/ 
        },

        handleFileUpload() {
            console.log('this.$refs.file = ', this.$refs.file)
            console.log('this.$refs.file.files[0] = ', this.$refs.file.files[0])
            this.file = this.$refs.file.files[0];
        },

        handleIESUpload() {
            this.ies = this.$refs.ies.files[0];
          
        },

        async saveChanges() {
            let append = false
            let formData = new FormData();
            let changed = false
            let changes = {}
            formData.append("id", this.log.id)
            if(this.file != null) {
                formData.append("file", this.file)
                formData.append("orig_ies", this.original_log.ies)
                append = true
            }
            if(this.ies != null) {
                formData.append("ies", this.ies)
                formData.append("orig_file", this.original_log.report)
                append = true
            }

            if(append) {
                await this.$axios.$post('/upload', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
            }
           
            for(var key in this.log) {
               
                if(this.log[key] != this.original_log[key]) {
                    changed = true
                    changes[key]= this.log[key]

                }        
            }
            if(changed) {
                changes['dummy'] = null
                changes['dummy2'] = null
                changes['updated_by'] = this.$auth.user.username
                changes['id'] = this.log.id
                await this.$axios.$post('/modify_test_details', changes)

            }
            this.$emit('closeModal')
        }
    },

    created: async function() {
        this.original_log = Object.assign({}, this.log)
    }
    
}
</script>

<style scoped>

 input {
     width:250px;
 }

.close {
  color: rgb(66, 63, 63);
  float: right;
  font-size: 45px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

input:read-only {
  background-color: #EFEFEF4D;
  border-color: rgba(118, 118, 118, 0.3);
}

textarea:read-only {
  background-color: #EFEFEF4D;
  border-color: rgba(118, 118, 118, 0.3);
}

</style>