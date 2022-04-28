<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
            <template v-slot:[`item.dt_update`]="{ item }">{{ localtime(item.dt_update) }}</template>
            <template v-slot:[`item.retypes`]="{ item }">{{ $store.getters.getObjectPropertyByValue("addresstype",item.retypes,"display_name") }}</template>
            <template v-slot:[`item.country`]="{ item }">{{ $store.getters.getObjectPropertyByValue("countries",item.country,"display_name") }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="googleMaps(item)">mdi-google-maps</v-icon>
                <v-icon small class="mr-2" @click="generateEnvelope(item)">mdi-email-open-outline</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add address') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
            <v-card  class="login">
                <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit address") }}</v-card-title>
                <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add address") }}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-select :items="this.$store.state.addresstype" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value" required />
                    <v-text-field v-model="selected.address" type="text" :counter="300"  v-bind:label="$t('Address')" required v-bind:placeholder="$t('Enter a address')" :rules="RulesString(300,true)"  />
                    <v-text-field v-model="selected.code" type="text" :label="$t('Enter a code')" :counter="10" :placeholder="$t('Enter a code')" :rules="RulesString(10,false)" />
                    <v-text-field v-model="selected.city" type="text" :label="$t('Enter a city')" :counter="100" :placeholder="$t('Enter a city')"   :rules="RulesString(100,true)"/>
                    <v-autocomplete :items="this.$store.state.countries" v-model="selected.country" :label="$t('Select a country')" item-text="display_name" item-value="value" required/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="acceptEdition()" v-if="isEdition==true" :disabled="!form_valid">{{ $t("Edit") }}</v-btn>
                    <v-btn color="primary" @click.native="acceptAddition()" v-if="isEdition==false" :disabled="!form_valid">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click.native="cancelDialog()">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { jsPDF } from "jspdf";
    import {fullName} from '../functions.js'
    export default {
        props: ['person','obsolete'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { text: this.$t('Address'),  sortable: true, value: 'address'},
                    { text: this.$t('Code'),  sortable: true, value: 'code'},
                    { text: this.$t('City'),  sortable: true, value: 'city'},
                    { text: this.$t('Country'),  sortable: true, value: 'country'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.address,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
                
                form_valid:false,
            }
        },
        methods:{
            fullName,
            addItem(){
                this.selected={
                    address: "",
                    city: "",
                    code: "",
                    country: this.$i18n.locale.toUpperCase(), //To use locale country
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `${this.$store.state.apiroot}/api/persons/${this.person.id}/`,
                    retypes: 0,
                };
                this.dialog=true;
                this.isEdition=false;
                
            },
            acceptAddition(){
                if (this.$refs.form.validate()==false) return
                this.selected.dt_update=new Date();
                axios.post(`${this.$store.state.apiroot}/api/address/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    this.dialog=false;
                    this.TableCrudAddress_refreshKey();
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
                this.selected.dt_update=new Date();
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.TableCrudAddress_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            cancelDialog(){
                this.dialog = false;                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this address?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url , this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableCrudAddress_refreshKey();
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
                    this.TableCrudAddress_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            generateEnvelope(item){
                var centeredText = function(text, y) {
                    var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                    var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
                    doc.text(textOffset, y, text);
                }

                var height=this.getLocalStorage("envelope_height", 11)
                var width=this.getLocalStorage("envelope_width", 22)
                const doc = new jsPDF({
                    orientation: "landscape",
                    unit: "cm",
                    format: [height, width]
                });
                centeredText(this.fullName(this.person), height*6/11);
                centeredText(item.address, height*7/11);
                centeredText(`${item.code} ${item.city}`, height*8/11)
                centeredText(this.CountryName(item.country), height*9/11)
                doc.save(`${this.fullName(this.person)}.pdf`);
            },
            googleMaps(item){
                window.open(`https://maps.google.com/?q=${item.address} ${item.city}`)
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudAddress_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudAddress RefreshKey to ${this.refreshKey}`)
            },
            
        },
    }
</script>
<style scoped>
</style>
