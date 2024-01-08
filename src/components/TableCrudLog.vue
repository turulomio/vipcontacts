<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.datetime`]="{ item }">
                <span>{{ localtime(item.datetime) }}</span>
            </template>
            <template v-slot:[`item.retypes`]="{ item }">{{ $store.getters.getObjectPropertyByValue("logtype",item.retypes,"display_name") }}</template>

            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add log') }}</v-btn>
        <v-btn color="primary" @click="showAutomatic()" v-if="vShowAutomatic==false">{{ $t('Show automatic logs') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showAutomatic()" v-if="vShowAutomatic==true">{{ $t('Hide automatic logs') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="pa-3">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit log") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add log") }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-select :items="nonAutomaticTypes" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value"/>
                <v-textarea v-model="selected.text" type="text" :counter="1000" :label="$t('Log')" required :placeholder="$t('Enter a log')" :rules="RulesString(1000,true)" />
            </v-form>
                        
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="acceptEdition()" v-if="isEdition==true" :disabled="!form_valid">{{ $t("Edit") }}</v-btn>
                <v-btn color="primary" @click.native="acceptAddition()" v-if="isEdition==false" :disabled="!form_valid">{{ $t("Add") }}</v-btn>
                <v-btn color="error" @click.native="
                dialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    export default {
        name: 'TableCrudLog',
        props: ['person','obsolete'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Datetime'), value: 'datetime', sortable: true },
                    { text: this.$t('Type'),  sortable: true, value: 'retypes', 
                        filter: value => {
                            if (this.vShowAutomatic==true){
                                return true;
                            } else {
                                
                                if (value<99){
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                        }
                    },
                    { text: this.$t('Text'),  sortable: true, value: 'text'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.log,
                vShowAutomatic:false,
                isEdition: true,
                dialog: false,
                selected: {},
                nonAutomaticTypes: this.useStore().logtype.filter( x=> x.value>=100),
                
                form_valid:false,
            }
        },
        methods:{
            useStore,
            addItem(){
                this.selected={
                    text: "",
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
                    this.TableCrudLog_refreshKey();
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
                    this.TableCrudLog_refreshKey();
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
                    this.TableCrudLog_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showAutomatic(){
                this.vShowAutomatic=!this.vShowAutomatic;
            },
            TableCrudLog_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudLog RefreshKey to ${this.refreshKey}`)
            },
        },
    }
</script>
