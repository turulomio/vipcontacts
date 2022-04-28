<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
            <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.blob`]="{ item }">
                <img :src="`data:${item.mime};base64,${item.blob}`" width="24" height="24" v-if="canBeViewed(item)" @click="showCarrusel" />
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="downloadItem(item)">mdi-cloud-download</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add blob') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showCarrusel()" >{{ $t('Carrusel') }}</v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
            <v-card  class="login">
                <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit media file") }}</v-card-title>
                <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add media file") }}</v-card-title>
                
                <v-file-input v-model="selected.blob"  v-bind:label="$t('File')" required v-bind:placeholder="$t('Select a filename')" v-if ="isEdition==false"/>
                <v-select :items="this.$store.state.mimetype" v-model="selected.mime" :label="$t('Select a mime')"  item-text="display_name" item-value="value"  ></v-select>  

                <AutoCompleteApiOneField v-model="selected.name" v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter a name')" canadd :apiurl="`${$store.state.apiroot}/api/blobnames/`" field="name" />   
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                    <v-btn color="primary" @click.native="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click.native="cancelDialog()">{{ $t("Cancel") }}</v-btn>
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
    import {localtime} from '../functions.js'
    import AutoCompleteApiOneField from './reusing/AutoCompleteApiOneField.vue'
    export default {
        name: 'TableCrudBlob',
        components: {
            AutoCompleteApiOneField,
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
                dialog_carrusel: false,
                carrusel:[],
                selected: {},
                blob_string: null,
                blob_names:[],
                RulesTextRequired100: [
                    v => !!v || this.$t('Text is required'),
                    v => (v && v.length <100) || this.$t('Text must be less than 100 characters'),
                ],
            }
        },
        methods:{
            localtime,
            addItem(){
                this.selected={
                    dt_update: new Date(),
                    dt_obsolete: '',
                    person: `${this.$store.state.apiroot}/api/persons/${this.person.id}/`,
                    name: null,
                    mime: null,
                    blob: null,
                    photocontact: false,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                let data = new FormData(); // creates a new FormData object
                data.append('dt_update', this.selected.dt_update.toISOString()); // add your file to form data
                data.append('dt_obsolete', this.selected.dt_obsolete); // add your file to form data
                data.append('person', this.selected.person); // add your file to form data
                data.append('name', this.selected.name); // add your file to form data
                data.append('mime', this.selected.mime); // add your file to form data
                data.append('blob', this.selected.blob); // add your file to form data
                data.append('photocontact', this.selected.photocontact); // add your file to form data
                axios.post(`${this.$store.state.apiroot}/api/blob/`, data, this.myheaders_formdata())
                .then((response) => {
                    this.parseResponse(response)
                    console.log(response.data)
                    this.$emit('person')
                    this.dialog=false;
                    this.TableCrudBlob_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            
            editItem(item){
                console.log(item)
                this.selected=item;
                this.dialog=true;
                this.isEdition=true;
            },
            acceptEdition(){
                //Doesn't change blob only update metadata
                let data = new FormData(); // creates a new FormData object
                data.append('dt_update', new Date().toISOString()); // add your file to form data
                data.append('dt_obsolete', this.selected.dt_obsolete||""); // add your file to form data
                data.append('person', this.selected.person); // add your file to form data
                data.append('name', this.selected.name); // add your file to form data
                data.append('mime', this.selected.mime); // add your file to form data
                data.append('photocontact', this.selected.photocontact); // add your file to form data
                axios.put(this.selected.url, data, this.myheaders_formdata())
                .then((response) => {
                    this.parseResponse(response)
                    console.log(response.data);
                    this.$emit("person")
                    this.dialog=false;
                    this.TableCrudBlob_refreshKey(); 
                    this.$emit('cruded') 
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            cancelDialog(){
                this.dialog = false;                
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
                    this.TableCrudBlob_refreshKey();
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
                    this.TableCrudBlob_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudBlob_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudBlob RefreshKey to ${this.refreshKey}`)
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
        
        created() {           
        }
    }
</script>
