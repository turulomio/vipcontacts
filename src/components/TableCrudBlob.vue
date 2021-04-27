<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
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
            
            <v-file-input v-model="selected.blob"  v-bind:label="$t('File')" required v-bind:placeholder="$t('Select a filename')" />
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
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.blob,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
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
                    name: null,
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `http://192.168.1.100:8001/api/blob/${this.person.id}/`,
                    mime: 0,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                this.selected.dt_update=new Date();
                console.log("DESTINTY")
                console.log(this.selected.destiny)
                console.log("ADDTITON")
                console.log(this.selected)
                axios.post(`${this.$store.state.apiroot}/api/blob/`, this.selected, this.myheaders())
                .then((response) => {
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    this.$emit('person')
                    this.dialog=false;
                    this.TableCrudRelationship_refreshKey();
                    
                    this.updateRelationshipNames()     
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
                    console.log(response.data);
                    this.selected=response.data;
                    this.$emit("person")
                    this.dialog=false;
                    this.TableCrudRelationship_refreshKey();
                    this.updateRelationshipNames()    
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
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableCrudRelationship_refreshKey();
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
                    console.log(response.data);
                    this.TableCrudRelationship_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudRelationship_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudRelationship RefreshKey to ${this.refreshKey}`)
            },
            showBlobName(item){
                const o = this.blob_names.filter(x => `${this.$store.state.apiroot}/api/persons/${x.id}/`==item.destiny)
                if (o.length>0){
                    return o[0].name
                }
                else {
                    return ""
                }
            
            },
        },
        
        created() {           
        }
    }
</script>
<style scoped>
</style>
