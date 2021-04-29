<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
            <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.blob`]="{ item }">
                {{ showImage(item)}}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add blob') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}</v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="login">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit media file") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add media file") }}</v-card-title>
            
            <v-file-input v-model="selected.blob"  v-bind:label="$t('File')" required v-bind:placeholder="$t('Select a filename')" @change="onFilePicked" />
            <v-select :items="this.$store.state.catalogs.mimetype" v-model="selected.mime" :label="$t('Select a mime')"  item-text="display_name" item-value="value"  ></v-select>  

            <AutoCompleteApiOneField v-model="selected.name" v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter a name')" canadd :apiurl="`${$store.state.apiroot}/api/blobnames/`" field="name" />   
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                <v-btn color="primary" @click.native="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                <v-btn color="error" @click.native="cancelDialog()">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import {localtime} from '../functions.js'
    import AutoCompleteApiOneField from './AutoCompleteApiOneField.vue'
    export default {
        name: 'TableCrudBlob',
        components: {
            AutoCompleteApiOneField,
        },
        props: ['person'],
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
                    dt_obsolete: null,
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
                data.append('dt_update', "2021-04-17T06:22:30.348856Z"); // add your file to form data
                data.append('dt_obsolete', "2021-04-17T06:22:30.348856Z"); // add your file to form data
                data.append('person', this.selected.person); // add your file to form data
                data.append('name', this.selected.name); // add your file to form data
                data.append('mime', this.selected.mime); // add your file to form data
                data.append('blob', this.selected.blob); // add your file to form data
                data.append('photocontact', this.selected.photocontact); // add your file to form data
                console.log(this.selected)
                axios.post(`${this.$store.state.apiroot}/api/blobpost/`, data, this.myheaders_formdata())
                .then((response) => {
                    this.parseResponse(response)
//                     this.selected=response.data; //To get id
                    console.log(response.data)
                    this.tableData.push(this.selected);
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
                this.selected.dt_update=new Date();
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    console.log(response.data);
                    this.selected=response.data;
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
                axios.delete(item.ur, this.myheaders())
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
//             onFilePicked(e) {
//                 console.log(e)
//                 console.dir(e)
//                 const fr = new FileReader()
//                 fr.readAsDataURL(e)
//                 fr.addEventListener('load', () => {
//                     this.blob_string=fr.result
//                     console.log(this.blob_string)
//                     }
//                 )
//             },
            showImage(item){
                console.log(item)
            }
        },
        
        created() {           
        }
    }
</script>
