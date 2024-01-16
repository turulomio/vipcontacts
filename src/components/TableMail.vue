<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>            
            <template v-slot:[`item.retypes`]="{ item }">{{getObjectPropertyByValue("mailtype",item.retypes,"display_name") }}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableMail_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableMail_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableMail_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="mail_link(item)">mdi-mail</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableMail_Add" color="primary" @click="addItem()" >{{ $t('Add mail') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="800">
            <PersonMailCRUD :mail="mail" :mode="mode" :key="key" @cruded="on_PersonMailCRUD_cruded"/>
        </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { empty_person_mail } from '@/empty_objects';
    import { localtime } from 'vuetify_rules';
    import PersonMailCRUD from './PersonMailCRUD.vue';
    import { getObjectPropertyByValue, myheaders,parseResponseError } from '@/functions';
    export default {
        props: ['person','obsolete'],
        components:{
            PersonMailCRUD,
        },
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {if (value==null){return true;} else if ( this.vShowObsolete==true) {return true;} return false;}},
                    { title: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { title: this.$t('Mail'),  sortable: true, value: 'mail'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.mail,
                vShowObsolete:false,
                dialog: false,
                mail: null,
                mode: "",
            }
        },
        methods:{
            useStore,
            empty_person_mail,
            getObjectPropertyByValue,
            myheaders,
            parseResponseError,
            localtime,
            addItem(){
                this.mail=empty_person_mail()
                this.mail.person=this.person.url
                this.mode="C"
                this.dialog=true;
            },
            editItem(item){
                this.mail=item
                this.mode="U"
                this.dialog=true;
            },
            deleteItem(item){
                this.mail=item
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
            on_PersonMailCRUD_cruded(){
                this.dialog=false
                this.$emit("cruded")

            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            mail_link(item){
                window.open(`mailto:${this.person.fullname}<${item.mail}>`)
            },
        },
    }
</script>
