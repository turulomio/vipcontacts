<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
            <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableAlias_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableAlias_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableAlias_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>        
        <v-btn data-test="TableAlias_Add" color="primary" @click="addItem()" >{{ $t('Add alias') }}</v-btn>
        <v-btn data-test="TableAlias_ButtonObsolete" color="primary" @click="showObsolete">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete_number>0" class="ml-2" :content="obsolete_number"/></v-btn>
               
        <!-- DIALOG -->
        <v-dialog v-model="dialog" max-width="50%">
            <PersonAliasCRUD :alias="alias" :mode="mode" :key="key" @cruded="on_PersonAliasCRUD_cruded"/>
        </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { myheaders, parseResponseError } from '@/functions';
    import { empty_person_alias } from '@/empty_objects';
    import PersonAliasCRUD from './PersonAliasCRUD.vue';
    import { localtime } from 'vuetify_rules';
    export default {
        components: {
            PersonAliasCRUD,
        },
        props: {
            person: { //url
                required: true
            },
        },
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true},
                    { title: this.$t('Name'),  sortable: true, value: 'name'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                vShowObsolete:false,

                //Dialog crud
                dialog: false,
                alias: null,
                mode:"",
            }

        },
        computed: {
            obsolete_number(){
                let r=0

                this.person.alias?.forEach((o)=>{
                    if (o.dt_obsolete!=null){
                        r+=1
                    } 
                })
                return r
            }
        },
        methods:{
            useStore,
            localtime,
            myheaders,
            parseResponseError,
            empty_person_alias,
            addItem(){
                this.alias=empty_person_alias()
                this.alias.person=this.person.url
                this.mode="C"
                this.dialog=true;
            },
            
            editItem(item){
                this.alias=item
                this.mode="U"
                this.dialog=true;
            },
            deleteItem(item){

                this.alias=item
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
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
                this.refreshTableData()
                this.key=this.key+1
            },
            on_PersonAliasCRUD_cruded(){
                this.$emit('cruded')
            },
            refreshTableData(){
                this.tableData=[]
                // console.log(this.person.alias, "REFRESH")
                // console.log(this.person.alias.length)
                this.person.alias?.forEach((o) => {
                    if (this.vShowObsolete==true && o.dt_obsolete!=null){
                        this.tableData.push(o)
                    } else if  (this.vShowObsolete==false && o.dt_obsolete==null) {
                        this.tableData.push(o)       
                    }
                });
                console.log("FINISHED", this.tableData)
            }
        },
        created(){
            // console.log(this.person, "PERSON")
            // console.log(this.person.alias, "ALIAS")
            this.refreshTableData()
        }
    }
</script>
