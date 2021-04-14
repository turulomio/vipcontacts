<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="datetime" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.datetime`]="{ item }">
                <span>{{ localtime(item.datetime) }}</span>
            </template>
              <template v-slot:[`item.retypes`]="{ item }">
                <span>{{ LogTypeName(item.retypes) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add log') }}</v-btn>
        <v-btn color="primary" @click="showAutomatic()" v-if="vShowAutomatic==false">{{ $t('Show automatic logs') }}</v-btn>
        <v-btn color="primary" @click="showAutomatic()" v-if="vShowAutomatic==true">{{ $t('Hide automatic logs') }}</v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="login">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit log") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add log") }}</v-card-title>
            
            <v-select :items="nonAutomaticTypes" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value"  ></v-select>  
            <v-text-field v-model="selected.text" type="text" :counter="1000"  v-bind:label="$t('Log')" required v-bind:placeholder="$t('Enter a log')" ></v-text-field>
                        
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                <v-btn color="primary" @click.native="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                <v-btn color="error" @click.native="
                dialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import {myheaders} from '../functions.js'
    import {localtime, LogTypeName} from '../functions.js'
    export default {
        name: 'TableCrudLog',
        props: ['person'],
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
                nonAutomaticTypes: this.$store.state.catalogs.logtype.filter( x=> x.value>=100),
            }
        },
        methods:{
            localtime,
            LogTypeName,
            myheaders,
            addItem(){
                this.selected={
                    text: "",
                    datetime: new Date(),
                    person: `http://192.168.1.100:8001/api/persons/${this.person.id}/`,
                    retypes: 0,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                this.selected.datetime=new Date();
                axios.post(`${this.$store.state.apiroot}/api/log/`, this.selected, {'headers': this.myheaders()})
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    //this.$emit('input', 'test')//FALTA
                    this.tableData.push(this.selected);
                    console.log(this.tableData)
                    console.log(this.person.log)
                    
                    //this.$emit('input', this.
                    this.dialog=false;
                    this.TableCrudLog_refreshKey();
                }, (error) => {
                    console.log(error);
                });
            },
            
            editItem(item){
                this.selected=item;
                this.dialog=true;
                this.isEdition=true;
            },
            acceptEdition(){
                this.selected.datetime=new Date();
                console.log(this.selected)
                axios.put(this.selected.url, this.selected, {'headers': this.myheaders()})
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.TableCrudLog_refreshKey();
                }, (error) => {
                    console.log(error);
                });
                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this log?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url , {'headers': this.myheaders()})
                .then((response) => {
                    console.log(response);
                    var i = this.person.log.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableCrudLog_refreshKey();
                }, (error) => {
                    console.log(error);
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
<style scoped>
</style>
