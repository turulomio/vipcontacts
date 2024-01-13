<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>            
            <template v-slot:[`item.retypes`]="{ item }">{{ getObjectPropertyByValue("phonetype",item.retypes,"display_name") }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TablePhone_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TablePhone_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TablePhone_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="call_phone(item)">mdi-phone</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TablePhone_Add" color="primary" @click="addItem()" >{{ $t('Add phone') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
 
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
            <PersonPhoneCRUD :phone="phone" :mode="mode" @cruded="on_PersonPhoneCRUD_cruded" />
        </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { getObjectPropertyByValue, myheaders,parseResponseError } from '@/functions';
    import { localtime } from 'vuetify_rules';
    import PersonPhoneCRUD from '@/components/PersonPhoneCRUD'
    import {empty_person_phone} from '@/empty_objects'
    export default {
        components:{
            PersonPhoneCRUD
        },
        props: ['person','obsolete'],
        data () {
            return {
                key:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { text: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { text: this.$t('Phone'),  sortable: true, value: 'phone'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.phone,
                vShowObsolete:false,
                dialog: false,
                phone:null,
                mode:"",
                
                form_valid:false,
            }
        },
        methods:{
            useStore,
            localtime,
            getObjectPropertyByValue,
            myheaders,
            parseResponseError,
            addItem(){
                this.phone=empty_person_phone()
                this.phone.person=this.person.url
                this.mode="C"
                this.dialog=true;
            },
            editItem(item){
                this.phone=item
                this.mode="U"
                this.dialog=true;
            },
            deleteItem(item){
                this.phone=item
                this.mode="D"
                this.dialog=true;
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
                    this.key+=1
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            call_phone(item){
                window.open(`tel:${item.phone}`)
            },
            on_PersonPhoneCRUD_cruded(){
                this.dialog = false;   
                this.$emit('cruded')   
            }
        },
    }
</script>
<style scoped>
</style>
