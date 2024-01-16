<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
            <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.blob`]="{ item }">
                <img contain :src="`data:${item.mime};base64,${item.blob}`" width="24" height="24" v-if="canBeViewed(item)" @click="showCarrusel" />
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableBlob_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableBlob_ButtonEdit${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableBlob_ButtonEdit${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="downloadItem(item)">mdi-cloud-download</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableBlob_Add" color="primary" @click="addItem()" >{{ $t('Add blob') }}</v-btn>
        <v-btn color="primary" @click="pasteItem()" >{{ $t('Paste blob') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showCarrusel()" >{{ $t('Carrusel') }}</v-btn>
        
        <!-- DIALOG CRUD -->
        <v-dialog v-model="dialog" max-width="800">
            <v-card  class="pa-3">
                <h1 class="headline" v-if="isEdition==true">{{ $t("Edit media file") }}</h1>
                <h1 class="headline" v-if="isEdition==false">{{ $t("Add media file") }}</h1>
                <v-form ref="form" v-model="form_valid" lazy-validation >
                    <v-file-input data-test="TableBlob_File" v-model="file_input" :label="$t('File')" required :placeholder="$t('Select a filename')" v-if ="isEdition==false" :rules="RulesSelection(true)"/>
                    <AutoCompleteApiOneField data-test="TableBlob_Name" v-model="selected.name" :label="$t('Name')" :placeholder="$t('Enter a name')" canadd :apiurl="`${useStore().apiroot}/api/blobnames/`" field="name" :rules="RulesSelection(true)"/>   
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn data-test="TableBlob_Button" color="primary" @click="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                    <v-btn data-test="TableBlob_Button" color="primary" @click="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

                
        <!-- DIALOG PASTE-->
        <v-dialog v-model="dialog_paste" max-width="800" >
            <v-card  class="pa-3">
                <h1 v-if="isEdition==false">{{ $t("Paste image") }}</h1>
                <v-form ref="form_paste" v-model="form_paste_valid" lazy-validation >
                   <AutoCompleteApiOneField v-model="selected.name" :label="$t('Name')" :placeholder="$t('Enter a name')" canadd :apiurl="`${useStore().apiroot}/api/blobnames/`" field="name" :rules="RulesSelection(true)"/>   
                   <PasteImage v-model="pasted_image" :rules="RulesSelection(true)" :key="key"  />
                </v-form>
                <br>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptPaste()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click="dialog_paste   = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
<!--         DIALOG CARRUSEL -->
        <v-dialog v-model="dialog_carrusel" max-width="800">
            <v-carousel height="auto">
                <v-carousel-item
                v-for="(item,i) in carrusel"
                :key="i"
                :src="item.src"
                reverse-transition="fade-transition"
                transition="fade-transition"
                ></v-carousel-item>
            </v-carousel>
        </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import AutoCompleteApiOneField from './reusing/AutoCompleteApiOneField.vue'
    import PasteImage from './PasteImage.vue'
    import { useStore } from '@/store';
    import {empty_blob} from '../empty_objects.js'
    import { localtime, RulesSelection } from 'vuetify_rules';
    import { getObjectPropertyByValue, myheaders,parseResponseError } from '@/functions';
    export default {
        name: 'TableBlob',
        components: {
            AutoCompleteApiOneField,
            PasteImage,
        },
        props: ['person','obsolete'],
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { title: this.$t('Name'),  sortable: true, value: 'name'},
                    { title: this.$t('Type'),  sortable: true, value: 'mime'},
                    { title: this.$t('Media'),  sortable: true, value: 'blob'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.blob,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                form_valid: false,
                //Paste dialog
                dialog_paste:false,
                pasted_image:null,
                form_paste_valid:false,
                //
                dialog_carrusel: false,
                carrusel:[],
                selected: {},
                file_input: null,
            }
        },
        methods:{
            useStore,
            RulesSelection,
            localtime,
            parseResponseError,
            getObjectPropertyByValue,
            myheaders,
            addItem(){
                this.selected=empty_blob()
                this.isEdition=false;
                this.dialog=true;
            },
            async pasteItem(){
                this.selected=empty_blob()
                this.isEdition=false
                this.pasted_image=null
                this.key=this.key+1
                this.dialog_paste=true
            },

            async acceptPaste(){                
                if (this.$refs.form_paste.validate()==false) return     
                if (this.pasted_image==null){
                    alert(this.$t("You need to paste an image"))
                    return
                }

                this.selected.mime=this.pasted_image.mime
                this.selected.blob=this.pasted_image.image
                this.selected.person=`${this.useStore().apiroot}/api/person/${this.person.id}/`
                axios.post(`${this.useStore().apiroot}/api/blob/`, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.$emit('person')
                    this.dialog=false;
                    this.key=this.key+1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            async acceptAddition(){     
                if (this.$refs.form.validate()==false) return          
                var image= await this.getBase64(this.file_input)
                this.selected.mime=image.mime
                this.selected.blob=image.image
                this.selected.person=`${this.useStore().apiroot}/api/person/${this.person.id}/`
                axios.post(`${this.useStore().apiroot}/api/blob/`, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.$emit('person')
                    this.dialog=false;
                    this.key=this.key+1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            editItem(item){
                console.log(item)
                this.selected=item;
                this.dialog=true;
                this.isEdition=true;
            },
            empty_blob,
            acceptEdition(){
                if (this.$refs.form.validate()==false) return     
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.$emit("person")
                    this.dialog=false;
                    this.key=this.key+1 
                    this.$emit('cruded') 
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this blob?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.key=this.key+1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            obsoleteItem(item){
                if (item.dt_obsolete == null){
                    item.dt_obsolete=this.localtime(new Date());
                }else{
                    item.dt_obsolete=null;
                }
                axios.put(item.url, item, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    console.log(response.data);
                    this.key=this.key+1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            canBeViewed(item){
                if (item.mime=="image/png" || item.mime=="image/jpeg") return true
                return false
            },
            downloadItem(item){
                const linkSource = `data:${item.mime};base64,${item.blob}`
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = item.name;
                downloadLink.click();
            },
            showCarrusel(){
                this.carrusel=this.person.blob.filter(o => o.mime.includes("image")).map(function(o){
                    return {src:`data:${o.mime};base64,${o.blob}`}
                })
                this.dialog_carrusel=true
            }
        },
    }
</script>
