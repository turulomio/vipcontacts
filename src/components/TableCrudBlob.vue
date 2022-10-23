<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
            <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.blob`]="{ item }">
                <img contain :src="`data:${item.mime};base64,${item.blob}`" width="24" height="24" v-if="canBeViewed(item)" @click="showCarrusel" />
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="downloadItem(item)">mdi-cloud-download</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add blob') }}</v-btn>
        <v-btn color="primary" @click="pasteItem()" >{{ $t('Paste blob') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showCarrusel()" >{{ $t('Carrusel') }}</v-btn>
        
        <!-- DIALOG CRUD -->
        <v-dialog v-model="dialog" max-width="800">
            <v-card  class="login">
                <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit media file") }}</v-card-title>
                <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add media file") }}</v-card-title>
                
                <v-file-input v-model="file_input" :label="$t('File')" required :placeholder="$t('Select a filename')" v-if ="isEdition==false"/>
                <AutoCompleteApiOneField v-model="selected.name" :label="$t('Name')" :placeholder="$t('Enter a name')" canadd :apiurl="`${$store.state.apiroot}/api/blobnames/`" field="name" />   

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                    <v-btn color="primary" @click.native="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click.native="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

                
        <!-- DIALOG PASTE-->
        <v-dialog v-model="dialog_paste" max-width="800" >
            <v-card  class="login">
                <v-card-title class="headline" v-if="isEdition==false">{{ $t("Paste image") }}</v-card-title>
                <AutoCompleteApiOneField v-model="selected.name" :label="$t('Name')" :placeholder="$t('Enter a name')" canadd :apiurl="`${$store.state.apiroot}/api/blobnames/`" field="name" />   
                <PasteImage v-model="pasted_image"></PasteImage>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="acceptPaste()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click.native="dialog_paste   = false">{{ $t("Cancel") }}</v-btn>
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
    import {empty_blob} from '../empty_objects.js'
    export default {
        name: 'TableCrudBlob',
        components: {
            AutoCompleteApiOneField,
            PasteImage,
        },
        props: ['person','obsolete'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Name'),  sortable: true, value: 'name'},
                    { text: this.$t('Type'),  sortable: true, value: 'mime'},
                    { text: this.$t('Media'),  sortable: true, value: 'blob'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.blob,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                //Paste dialog
                dialog_paste:false,
                pasted_image:null,
                //
                dialog_carrusel: false,
                carrusel:[],
                selected: {},
                file_input: null,
            }
        },
        methods:{
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
                if (this.pasted_image==null){
                    alert(this.$t("You need to paste and image"))
                    return
                }

                this.selected.mime=this.pasted_image.mime
                this.selected.blob=this.pasted_image.image
                this.selected.person=`${this.$store.state.apiroot}/api/persons/${this.person.id}/`
                axios.post(`${this.$store.state.apiroot}/api/blob/`, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.$emit('person')
                    this.dialog=false;
                    this.refreshKey=this.refreshKey+1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            async acceptAddition(){                
                var image= await this.getBase64(this.file_input)
                this.selected.mime=image.mime
                this.selected.blob=image.image
                this.selected.person=`${this.$store.state.apiroot}/api/persons/${this.person.id}/`
                axios.post(`${this.$store.state.apiroot}/api/blob/`, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.$emit('person')
                    this.dialog=false;
                    this.refreshKey=this.refreshKey+1
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
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.$emit("person")
                    this.dialog=false;
                    this.refreshKey=this.refreshKey+1 
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
                    this.refreshKey=this.refreshKey+1
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
                    this.refreshKey=this.refreshKey+1
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
