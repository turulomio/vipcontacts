<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
              <template v-slot:[`item.datetime`]="{ item }">
                <span>{{ localtime(item.datetime) }}</span>
            </template>
            <template v-slot:[`item.retypes`]="{ item }">{{ getObjectPropertyByValue("logtype",item.retypes,"display_name") }}</template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableLog_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableLog_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableLog_Add" color="primary" @click="addItem()" >{{ $t('Add log') }}</v-btn>

        <v-btn data-test="TableLog_ButtonAutomatic" color="primary" @click="showAutomatic">{{ (vShowAutomatic) ?$t('Hide automatic logs'):  $t('Show automatic logs') }}<v-badge inline color="error" v-if="automatic_number>0" class="ml-2" :content="automatic_number"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="pa-3">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit log") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add log") }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-select data-test="TableLog_Retypes" :items="nonAutomaticTypes" v-model="selected.retypes" :label="$t('Select a type')"  item-title="display_name" item-value="value"/>
                <v-textarea data-test="TableLog_Text" v-model="selected.text" type="text" :counter="1000" :label="$t('Log')" required :placeholder="$t('Enter a log')" :rules="RulesString(1000,true)" />
            </v-form>
                        
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="TableLog_Button" color="primary" @click="acceptEdition()" v-if="isEdition==true" :disabled="!form_valid">{{ $t("Edit") }}</v-btn>
                <v-btn data-test="TableLog_Button" color="primary" @click="acceptAddition()" v-if="isEdition==false" :disabled="!form_valid">{{ $t("Add") }}</v-btn>
                <v-btn color="error" @click="
                dialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { getObjectPropertyByValue, myheaders,parseResponseError } from '@/functions';
    import { localtime, RulesString } from 'vuetify_rules';
    export default {
        name: 'TableLog',
        props: {
            person: { 
                required: true
            },
        },
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Datetime'), value: 'datetime', sortable: true },
                    { title: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { title: this.$t('Text'),  sortable: true, value: 'text'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                vShowAutomatic:false,
                isEdition: true,
                dialog: false,
                selected: {},
                nonAutomaticTypes: this.useStore().logtype.filter( x=> x.value>=100),
                
                form_valid:false,
            }
        },
        computed: {
            automatic_number(){
                let r=0

                this.person.log?.forEach((o)=>{
                    if (o.dt_obsolete!=null){
                        r+=1
                    } 
                })
                return r
            }
        },
        methods:{
            localtime,
            useStore,
            RulesString,
            getObjectPropertyByValue,
            myheaders,parseResponseError,
            addItem(){
                this.selected={
                    title: "",
                    datetime: new Date(),
                    person: `${this.useStore().apiroot}/api/person/${this.person.id}/`,
                    retypes: 100,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                if (this.$refs.form.validate()==false) return
                this.selected.datetime=new Date();
                axios.post(`${this.useStore().apiroot}/api/log/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    
                    this.dialog=false;
                    this.key+=1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            
            editItem(item){
                this.selected=item;
                this.dialog=true;
                this.isEdition=true;
            },
            acceptEdition(){
                if (this.$refs.form.validate()==false) return
                this.selected.datetime=new Date();
                console.log(this.selected)
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.key+=1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this log?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.person.log.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.key+=1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showAutomatic(){
                this.vShowAutomatic=!this.vShowAutomatic;
                this.refreshTableData()
                this.key=this.key+1
            },
            refreshTableData(){
                this.tableData=[]
                this.person.log?.forEach((o) => {
                    if (this.vShowAutomatic==true && o.retypes<100){
                        this.tableData.push(o)
                    } else if  (this.vShowAutomatic==false && o.retypes>=100) {
                        this.tableData.push(o)       
                    }
                });
            }
        },
        created(){
            this.refreshTableData()
        }
    }
</script>
