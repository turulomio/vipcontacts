<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
            <template v-slot:[`item.dt_update`]="{ item }">{{ localtime(item.dt_update) }}</template>
            <template v-slot:[`item.retypes`]="{ item }">{{ getObjectPropertyByValue("addresstype",item.retypes,"display_name") }}</template>
            <template v-slot:[`item.country`]="{ item }">{{ getObjectPropertyByValue("countries",item.country,"display_name") }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableAddress_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableAddress_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableAddress_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="googleMaps(item)">mdi-google-maps</v-icon>
                <v-icon :data-test="`TableAddress_ButtonEnvelope${item.id}`" small class="mr-2" @click="generateEnvelope(item)">mdi-email-open-outline</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableAddress_Add" color="primary" @click="addItem()" >{{ $t('Add address') }}</v-btn>
        <v-btn data-test="TableAddress_ButtonObsolete" color="primary" @click="showObsolete">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete_number>0" class="ml-2" :content="obsolete_number"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
            <v-card  class="pa-3">
                <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit address") }}</v-card-title>
                <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add address") }}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-select :items="useStore().addresstype" v-model="selected.retypes" :label="$t('Select a type')"  item-title="display_name" item-value="value" required />
                    <v-text-field data-test="TableAddress_Address" v-model="selected.address" type="text" :counter="300"  :label="$t('Address')" required :placeholder="$t('Enter a address')" :rules="RulesString(300,true)"  />
                    <v-text-field data-test="TableAddress_Code" v-model="selected.code" type="text" :label="$t('Enter a code')" :counter="10" :placeholder="$t('Enter a code')" :rules="RulesString(10,false)" />
                    <v-text-field data-test="TableAddress_City" v-model="selected.city" type="text" :label="$t('Enter a city')" :counter="100" :placeholder="$t('Enter a city')"   :rules="RulesString(100,true)"/>
                    <v-autocomplete data-test="TableAddress_Country" :items="useStore().countries" v-model="selected.country" :label="$t('Select a country')" item-title="display_name" item-value="value" required/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn data-test="TableAddress_Button" color="primary" @click="acceptEdition()" v-if="isEdition==true" :disabled="!form_valid">{{ $t("Edit") }}</v-btn>
                    <v-btn data-test="TableAddress_Button" color="primary" @click="acceptAddition()" v-if="isEdition==false" :disabled="!form_valid">{{ $t("Add") }}</v-btn>
                    <v-btn color="error" @click="cancelDialog()">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { jsPDF } from "jspdf";
    import { RulesString,localtime } from 'vuetify_rules';
    import { getObjectPropertyByValue, myheaders,parseResponseError, getLocalStorage } from '@/functions';
    export default {
        props: ['person','obsolete'],
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true },
                    { title: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { title: this.$t('Address'),  sortable: true, value: 'address'},
                    { title: this.$t('Code'),  sortable: true, value: 'code'},
                    { title: this.$t('City'),  sortable: true, value: 'city'},
                    { title: this.$t('Country'),  sortable: true, value: 'country'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
                
                form_valid:false,
            }
        },
        computed: {
            obsolete_number(){
                let r=0

                this.person.address?.forEach((o)=>{
                    if (o.dt_obsolete!=null){
                        r+=1
                    } 
                })
                return r
            }
        },
        methods:{
            useStore,
            getLocalStorage,
            localtime,
            RulesString,
            getObjectPropertyByValue,
            myheaders,parseResponseError,
            addItem(){
                this.selected={
                    address: "",
                    city: "",
                    code: "",
                    country: this.$i18n.locale.toUpperCase(), //To use locale country
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: this.person.url,
                    retypes: 0,
                };
                this.dialog=true;
                this.isEdition=false;
                
            },
            acceptAddition(){
                if (this.$refs.form.validate()==false) return
                this.selected.dt_update=new Date();
                axios.post(`${this.useStore().apiroot}/api/address/`, this.selected, this.myheaders())
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
                this.selected.dt_update=new Date();
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
                centeredText(this.person.fullname, height*6/11);
                centeredText(item.address, height*7/11);
                centeredText(`${item.code} ${item.city}`, height*8/11)
                centeredText(getObjectPropertyByValue("countries",item.country,"display_name"), height*9/11)
                doc.save(`${this.person.fullname}.pdf`);
            },
            googleMaps(item){
                window.open(`https://maps.google.com/?q=${item.address} ${item.city}`)
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
                this.refreshTableData()
                this.key=this.key+1
            },
            refreshTableData(){
                this.tableData=[]
                // console.log(this.person.alias, "REFRESH")
                // console.log(this.person.alias.length)
                this.person.address?.forEach((o) => {
                    if (this.vShowObsolete==true && o.dt_obsolete!=null){
                        this.tableData.push(o)
                    } else if  (this.vShowObsolete==false && o.dt_obsolete==null) {
                        this.tableData.push(o)       
                    }
                });
            }
        },
        created(){
            // console.log(this.person, "PERSON")
            // console.log(this.person.alias, "ALIAS")
            this.refreshTableData()
        }
    }
</script>
<style scoped>
</style>
