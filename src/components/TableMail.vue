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

        <v-btn data-test="TableMail_ButtonObsolete" color="primary" @click="showObsolete">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete_number>0" class="ml-2" :content="obsolete_number"/></v-btn>
        
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
        props: {
            person: { 
                required: true
            },
        },
        components:{
            PersonMailCRUD,
        },
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true},
                    { title: this.$t('Type'),  sortable: true, value: 'retypes'},
                    { title: this.$t('Mail'),  sortable: true, value: 'mail'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                vShowObsolete:false,
                dialog: false,
                mail: null,
                mode: "",
            }
        },
        computed: {
            obsolete_number(){
                let r=0

                this.person.mail?.forEach((o)=>{
                    if (o.dt_obsolete!=null){
                        r+=1
                    } 
                })
                return r
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
            on_PersonMailCRUD_cruded(){
                this.dialog=false
                this.$emit("cruded")

            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
                this.refreshTableData()
                this.key=this.key+1
            },
            mail_link(item){
                window.open(`mailto:${this.person.fullname}<${item.mail}>`)
            },
            refreshTableData(){
                this.tableData=[]
                this.person.mail?.forEach((o) => {
                    if (this.vShowObsolete==true && o.dt_obsolete!=null){
                        this.tableData.push(o)
                    } else if  (this.vShowObsolete==false && o.dt_obsolete==null) {
                        this.tableData.push(o)       
                    }
                });
            }
        },
        created(){
            this.refreshTableData()
        }
    }
</script>
