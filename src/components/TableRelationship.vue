<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.retypes`]="{ item }">{{ getObjectPropertyByValue("relationshiptype",item.retypes,"display_name") }}</template>

              <template v-slot:[`item.destiny`]="{ item }">
                <span>{{ showRelationShipName(item) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add relationship') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="pa-3">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit relationship") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add relationship") }}</v-card-title>
            
            <v-select :items="useStore().relationshiptype" v-model="selected.retypes" :label="$t('Select a type')"  item-title="display_name" item-value="value"  ></v-select>  
            
            <SelectPersons v-model="selected.destiny"></SelectPersons>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                <v-btn color="primary" @click="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                <v-btn color="error" @click="cancelDialog()">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import SelectPersons from './SelectPersons.vue'
    import { useStore } from '@/store';
    import { localtime } from 'vuetify_rules';
    import { getObjectPropertyByValue, myheaders,parseResponseError } from '@/functions';

    export default {
        name: 'TableRelationship',
        components: {
            SelectPersons,
        },
        props: ['person','obsolete'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { text: this.$t('Destiny'),  sortable: true, value: 'destiny'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.relationship,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
                relationship_names:[]
            }
        },
        methods:{
            localtime,
            getObjectPropertyByValue,myheaders,parseResponseError,
            useStore,
            addItem(){
                this.selected={
                    destiny: null,
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `${this.useStore().apiroot}/api/person/${this.person.id}/`,
                    retypes: 0,
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
                axios.post(`${this.useStore().apiroot}/api/relationship/`, this.selected, this.myheaders())
                .then((response) => {
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    this.$emit('person')
                    this.dialog=false;
                    this.TableRelationship_refreshKey();
                    
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
                    this.TableRelationship_refreshKey();
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
                var r = confirm("Do you want to delete this relationship?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.ur, this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableRelationship_refreshKey();
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
                    this.TableRelationship_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableRelationship_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableRelationship RefreshKey to ${this.refreshKey}`)
            },
            showRelationShipName(item){
                const o = this.relationship_names.filter(x => `${this.useStore().apiroot}/api/person/${x.id}/`==item.destiny)
                if (o.length>0){
                    return o[0].name
                }
                else {
                    return ""
                }
            
            },
            updateRelationshipNames(){
                axios.get(`${this.useStore().apiroot}/api/find/relationship/${this.$route.params.id}`, this.myheaders())
                .then((response) => {
                    this.relationship_names= response.data;         
                    console.log(this.relationship_names)
                    this.TableRelationship_refreshKey();
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        
        created() {
            this.updateRelationshipNames()            
        }
    }
</script>
<style scoped>
</style>
