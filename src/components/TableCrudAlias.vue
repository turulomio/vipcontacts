<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
            <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableCrudAlias_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableCrudAlias_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableCrudAlias_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>        
        <v-btn data-test="TableCrudAlias_Add" color="primary" @click="addItem()" >{{ $t('Add alias') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
               
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
    export default {
        components: {
            PersonAliasCRUD,
        },
        props: ['person','obsolete'],
        data () {
            return {
                key:0,
                tableHeaders: [
                    { text: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { text: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true, filter: value => {
                        if (value==null){
                            return true;
                        } else if ( this.vShowObsolete==true) {
                            return true;
                        }
                        return false;
                    }},
                    { text: this.$t('Name'),  sortable: true, value: 'name'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: this.person.alias,
                vShowObsolete:false,

                //Dialog crud
                dialog: false,
                alias: null,
                mode:"",
            }

        },
        methods:{
            useStore,
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
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
        },
    }
</script>
