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
        <v-btn color="primary" @click="addItem()" >{{ $t('Add job') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}</v-btn>

        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="login">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit job") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add job") }}</v-card-title>
            <AutoCompleteApiOneField v-model="selected.profession" :label="$t('Profession')" :placeholder="$t('Enter a profession')" canadd :apiurl="`${this.$store.state.apiroot}/api/professions/`" field="profession" />
            <AutoCompleteApiOneField v-model="selected.organization" v-bind:label="$t('Organization')" v-bind:placeholder="$t('Enter a organization')" canadd :apiurl="`${this.$store.state.apiroot}/api/organizations/`" field="organization" />
            <AutoCompleteApiOneField v-model="selected.department" v-bind:label="$t('Department')" v-bind:placeholder="$t('Enter a department')" canadd :apiurl="`${this.$store.state.apiroot}/api/departments/`" field="department" />
            <AutoCompleteApiOneField v-model="selected.title" v-bind:label="$t('Title')" v-bind:placeholder="$t('Enter a title')" canadd :apiurl="`${this.$store.state.apiroot}/api/titles/`" field="title" />   

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
    import {localtime,} from '../functions.js'
    import AutoCompleteApiOneField from './AutoCompleteApiOneField.vue'
    export default {
        name: 'TableCrudJob',
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
                    { text: this.$t('Profession'),  sortable: true, value: 'profession'},
                    { text: this.$t('Organization'),  sortable: true, value: 'organization'},
                    { text: this.$t('Department'),  sortable: true, value: 'department'},
                    { text: this.$t('Title'),  sortable: true, value: 'title'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.job,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
            }
        },
        methods:{
            localtime,
            addItem(){
                this.selected={
                    profession: "",
                    organization: "",
                    department: "",
                    title: "",
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `${this.$store.state.apiroot}/api/persons/${this.person.id}/`,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                this.selected.dt_update=new Date();
                axios.post(`${this.$store.state.apiroot}/api/job/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    this.dialog=false;
                    this.TableCrudJob_refreshKey();
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
                    this.dialog=false;
                    this.TableCrudJob_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            cancelDialog(){
                this.dialog = false;                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this job?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableCrudJob_refreshKey();
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
                    this.TableCrudJob_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudJob_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudJob RefreshKey to ${this.refreshKey}`)
            },
        },
    }
</script>
<style scoped>
</style>
