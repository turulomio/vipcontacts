<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
              <template v-slot:item.dt_update="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
              <template v-slot:item.type="{ item }">
                <span>{{ RelationshipTypeName(item.retypes) }}</span>
            </template>
              <template v-slot:item.country="{ item }">
                <span>{{ CountryName(item.country) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add relationship') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}</v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="login">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit relationship") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add relationship") }}</v-card-title>
            
            <v-select :items="this.$store.state.catalogs.relationshiptype" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value"  ></v-select>  
            <v-text-field v-model="selected.relationship" type="text" :counter="75"  v-bind:label="$t('Relationship')" required v-bind:placeholder="$t('Enter a relationship')" ></v-text-field>
            <v-text-field v-model="selected.code" type="text" :label="$t('Enter a code')" :counter="75" :placeholder="$t('Enter a code')" ></v-text-field>
            <v-text-field v-model="selected.city" type="text" :label="$t('Enter a city')" :counter="75" :placeholder="$t('Enter a city')" ></v-text-field>
            
            <v-select :items="this.$store.state.catalogs.countries" v-model="selected.country" :label="$t('Select a country')" item-text="display_name" item-value="value"  ></v-select> 
            
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
    import {localtime, RelationshipTypeName, CountryName} from '../functions.js'
    export default {
        name: 'TableCrudRelationship',
        props: ['person'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Type'),  sortable: true, value: 'type'},
                    { text: this.$t('Relationship'),  sortable: true, value: 'relationship'},
                    { text: this.$t('Code'),  sortable: true, value: 'code'},
                    { text: this.$t('City'),  sortable: true, value: 'city'},
                    { text: this.$t('Country'),  sortable: true, value: 'country'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.relationship,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
            }
        },
        methods:{
            localtime,
            RelationshipTypeName,
            CountryName,
            addItem(){
                this.selected={
                    relationship: "",
                    city: "",
                    code: "",
                    country: this.$i18n.locale.toUpperCase(), //To use locale country
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `http://192.168.1.100:8001/api/persons/${this.person.id}/`,
                    retypes: 0,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                this.selected.dt_update=new Date();
                axios.post(`${this.$store.state.apiroot}/api/relationship/`, this.selected, { headers: {'Authorization': `Token ${this.$store.state.token}`,"Content-Type": "application/json"}})
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.person.relationship.push(this.selected);
                    this.dialog=false;
                    this.TableCrudRelationship_refreshKey();
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
                this.selected.dt_update=new Date();
                axios.put(this.selected.url, this.selected,{ headers: {'Authorization': `Token ${this.$store.state.token}`, 'Content-Type': 'application/json'}})
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.TableCrudRelationship_refreshKey();
                }, (error) => {
                    console.log(error);
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
                axios.delete(item.url ,{headers: {"Authorization": `Token ${this.$store.state.token}`}})
                .then((response) => {
                    console.log(response);
                    var i = this.person.relationship.indexOf( item ); //Remove item
                    this.person.relationship.splice( i, 1 );
                    this.TableCrudRelationship_refreshKey();
                }, (error) => {
                    console.log(error);
                });
                return item;
            },
            obsoleteItem(item){
                if (item.dt_obsolete == null){
                    item.dt_obsolete=this.localtime(new Date());
                }else{
                    item.dt_obsolete=null;
                }
                axios.put(item.url, item,{ headers: {'Authorization': `Token ${this.$store.state.token}`, 'Content-Type': 'application/json'}})
                .then((response) => {
                    console.log(response.data);
                    this.TableCrudRelationship_refreshKey();
                }, (error) => {
                    console.log(error);
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
        },
    }
</script>
<style scoped>
</style>
