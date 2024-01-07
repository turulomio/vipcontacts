<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>            
            <template v-slot:[`item.retypes`]="{ item }">{{ $store.getters.getObjectPropertyByValue("phonetype",item.retypes,"display_name") }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="call_phone(item)">mdi-phone</v-icon>
            </template>
        </v-data-table>            
        <v-btn color="primary" @click="addItem()" >{{ $t('Add phone') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
        <v-card  class="pa-3">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit phone") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add phone") }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-select :items="this.$store.state.phonetype" v-model="selected.retypes" :label="$t('Select a type')"  item-text="display_name" item-value="value"/>
                <v-text-field v-if="[7,8].includes(selected.retypes)" v-model="selected.phone" type="text" :counter="50" :label="$t('Phone')" required :placeholder="$t('Enter a phone')" :rules="RulesString(50,true)"/>
                <vue-tel-input defaultCountry="es" @validate="on_phone_validate" v-if="![7,8].includes(selected.retypes)" v-model="selected.phone" showDialCode mode="international"></vue-tel-input>
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
    export default {
        props: ['person','obsolete'],
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

                phone:null,
                
                form_valid:false,
            }
        },
        methods:{
            addItem(){
                this.selected={
                    phone: "",
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `${this.$store.state.apiroot}/api/persons/${this.person.id}/`,
                    retypes: 0,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                if (![7,8].includes(this.selected.retypes) && this.phone.valid==false) {
                    alert(this.$t("Phone is not valid"))
                    return
                }
                if (this.$refs.form.validate()==false) return
                this.selected.dt_update=new Date();
                axios.post(`${this.$store.state.apiroot}/api/phone/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected);
                    this.dialog=false;
                    this.TableCrudPhone_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_phone_validate(phone){
                console.log(phone)
                this.phone=phone
                if (phone.valid==true){
                    this.selected.phone=phone.formatted
                }
            },
            editItem(item){
                this.selected=item;
                this.tmp_phone=item.phone
                this.dialog=true;
                this.isEdition=true;
            },
            acceptEdition(){
                if (![7,8].includes(this.selected.retypes) && this.phone.valid==false) {
                    alert(this.$t("Phone is not valid"))
                    return
                }
                if (this.$refs.form.validate()==false) return
                this.selected.dt_update=new Date();
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    this.selected=response.data;
                    this.dialog=false;
                    this.TableCrudPhone_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            cancelDialog(){
                this.dialog = false;   
                this.$emit('cruded')             
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this phone?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
                    this.TableCrudPhone_refreshKey();
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
                    this.TableCrudPhone_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
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
            call_phone(item){
                window.open(`tel:${item.phone}`)
            }
        },
    }
</script>
<style scoped>
</style>
