<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
              <template v-slot:item.dt_update="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
              <template v-slot:item.retypes="{ item }">
                <span>{{ PhoneTypeName(item.retypes) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add phone') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}</v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="login">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit phone") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add phone") }}</v-card-title>
            
            <v-select :items="this.$store.state.catalogs.phonetype" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value"  ></v-select>  
            <v-text-field v-model="selected.phone" type="text" :counter="75"  v-bind:label="$t('Phone')" required v-bind:placeholder="$t('Enter a phone')" ></v-text-field>
                        
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
    import {localtime, PhoneTypeName, CountryName} from '../functions.js'
    export default {
        name: 'TableCrudPhone',
        props: ['person'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { text: this.$t('Phone'),  sortable: true, value: 'phone'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.phone,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
            }
        },
        methods:{
            localtime,
            PhoneTypeName,
            CountryName,
            addItem(){
                this.selected={
                    phone: "",
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
                axios.post(`${this.$store.state.apiroot}/api/phone/`, this.selected, { headers: {'Authorization': `Token ${this.$store.state.token}`,"Content-Type": "application/json"}})
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.person.phone.push(this.selected);
                    this.dialog=false;
                    this.TableCrudPhone_refreshKey();
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
                console.log(this.selected)
                axios.put(this.selected.url, this.selected,{ headers: {'Authorization': `Token ${this.$store.state.token}`, 'Content-Type': 'application/json'}})
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.TableCrudPhone_refreshKey();
                }, (error) => {
                    console.log(error);
                });
                
            },
            cancelDialog(){
                this.dialog = false;                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this phone?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url ,{headers: {"Authorization": `Token ${this.$store.state.token}`}})
                .then((response) => {
                    console.log(response);
                    var i = this.person.phone.indexOf( item ); //Remove item
                    this.person.phone.splice( i, 1 );
                    this.TableCrudPhone_refreshKey();
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
                    this.TableCrudPhone_refreshKey();
                }, (error) => {
                    console.log(error);
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudPhone_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudPhone RefreshKey to ${this.refreshKey}`)
            },
        },
    }
</script>
<style scoped>
</style>
