<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.retypes`]="{ item }">{{ getObjectPropertyByValue("relationshiptype",item.retypes,"display_name") }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableRelationship_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableRelationship_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableRelationship_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableRelationship_Add"  color="primary" @click="addItem()" >{{ $t('Add relationship') }}</v-btn>
        <v-btn data-test="TableRelationship_ButtonObsolete" color="primary" @click="showObsolete">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete_number>0" class="ml-2" :content="obsolete_number"/></v-btn>

        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="pa-3">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit relationship") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add relationship") }}</v-card-title>
            
            <v-select data-test="TableRelationship_Retypes"  :items="useStore().relationshiptype" v-model="selected.retypes" :label="$t('Select a type')"  item-title="display_name" item-value="value"  ></v-select>  
            
            <SelectPersons data-test="TableRelationship_Destiny"  v-model="selected.destiny"></SelectPersons>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="TableRelationship_Button" color="primary" @click="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                <v-btn data-test="TableRelationship_Button" color="primary" @click="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
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
        props: {
            person: { 
                required: true
            },
        },
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true },
                    { title: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { title: this.$t('Destiny'),  sortable: true, value: 'destiny_fullname'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
                relationship_names:[]
            }
        },
        computed: {
            obsolete_number(){
                let r=0

                this.person.relationship?.forEach((o)=>{
                    if (o.dt_obsolete!=null){
                        r+=1
                    } 
                })
                return r
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
                    this.key+=1
                    
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
                    this.key+=1
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
                    this.key+=1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            obsoleteItem(item){
                if (item.dt_obsolete == null){
                    item.dt_obsolete=new Date().toISOString();
                }else{
                    item.dt_obsolete=null;
                }
                axios.put(item.url, item, this.myheaders())
                .then(() => {
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
                this.refreshTableData()
                this.key=this.key+1
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
            refreshTableData(){
                this.tableData=[]
                this.person.relationship?.forEach((o) => {
                    if (this.vShowObsolete==true && o.dt_obsolete!=null){
                        this.tableData.push(o)
                    } else if  (this.vShowObsolete==false && o.dt_obsolete==null) {
                        this.tableData.push(o)       
                    }
                });
            }
        },
        
        created() {
            this.refreshTableData()  
        }
    }
</script>
<style scoped>
</style>
