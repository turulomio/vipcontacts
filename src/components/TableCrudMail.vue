<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="dt_update" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
              <template v-slot:[`item.retypes`]="{ item }">
                <span>{{ MailTypeName(item.retypes) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="mail(item)">mdi-mail</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add mail') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="login">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit mail") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add mail") }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-select :items="this.$store.state.catalogs.mailtype" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value"  ></v-select>  
                <v-text-field v-model="selected.mail" type="text" :counter="75"  v-bind:label="$t('Mail')" required v-bind:placeholder="$t('Enter a mail')" :rules="RulesEmail" />
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
    import {localtime, MailTypeName, CountryName, fullName} from '../functions.js'
    export default {
        name: 'TableCrudMail',
        props: ['person','obsolete'],
        data () {
            return {
                refreshKey:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { text: this.$t('Mail'),  sortable: true, value: 'mail'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.mail,
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
                
                form_valid:false,
                RulesEmail: [
                    v => /.+@.+/.test(v) || this.$t('Invalid Email address') 
                ]
            }
        },
        methods:{
            localtime,
            MailTypeName,
            CountryName,
            fullName,
            addItem(){
                this.selected={
                    mail: "",
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
                axios.post(`${this.$store.state.apiroot}/api/mail/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    this.dialog=false;
                    this.TableCrudMail_refreshKey();
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
                console.log(this.selected)
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.TableCrudMail_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            cancelDialog(){
                this.dialog = false;                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this mail?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableCrudMail_refreshKey();
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
                    this.TableCrudMail_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudMail_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudMail RefreshKey to ${this.refreshKey}`)
            },
            mail(item){
                window.open(`mailto:${this.fullName(this.person)}<${item.mail}>`)
            },
        },
    }
</script>
<style scoped>
</style>
