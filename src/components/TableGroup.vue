<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData"  :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="key" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TableGroup_ButtonEdit${item.id}`" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TableGroup_ButtonDelete${item.id}`" small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`TableGroup_ButtonObsolete${item.id}`" small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableGroup_Add" color="primary" @click="addItem()" >{{ $t('Add group') }}</v-btn>
        <v-btn data-test="TableGroup_ButtonObsolete" color="primary" @click="showObsolete">{{ (vShowObsolete) ?$t('Hide obsolete'):  $t('Show obsolete') }}<v-badge inline color="error" v-if="obsolete_number>0" class="ml-2" :content="obsolete_number"/></v-btn>


        <!-- DIALOG -->
        <v-dialog data-test="TableGroup_Dialog" v-model="dialog" max-width="800">
        <v-card  class="pa-3">
            <v-card-title class="headline" v-if="isEdition==true">{{ $t("Edit group") }}</v-card-title>
            <v-card-title class="headline" v-if="isEdition==false">{{ $t("Add group") }}</v-card-title>
            <AutoCompleteApiOneField data-test="TableGroup_Name" v-model="selected.name" :label="$t('Name')" :placeholder="$t('Enter a name')" canadd :apiurl="`${this.useStore().apiroot}/api/groups/`" field="name" />

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="TableGroup_Button" color="primary" @click="acceptEdition()" v-if="isEdition==true">{{ $t("Edit") }}</v-btn>
                <v-btn data-test="TableGroup_Button" color="primary" @click="acceptAddition()" v-if="isEdition==false">{{ $t("Add") }}</v-btn>
                <v-btn color="error" @click="cancelDialog()">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { localtime } from 'vuetify_rules'
    import { parseResponseError, myheaders } from '@/functions'
    import AutoCompleteApiOneField from '@/components/reusing/AutoCompleteApiOneField.vue'
    export default {
        name: 'TableGroup',
        components: {
            AutoCompleteApiOneField,
        },
        props: {
            person: { 
                required: true
            },
        },
        data () {
            return {
                key:0,
                tableHeaders: [
                    { title: this.$t('Last update'), value: 'dt_update',sortable: true },
                    { title: this.$t('Obsolete'), value: 'dt_obsolete',sortable: true },
                    { title: this.$t('Group name'),  sortable: true, value: 'name'},
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                ],   
                tableData: [],
                vShowObsolete:false,
                isEdition: true,
                dialog: false,
                selected: {},
            }
        },
        computed: {
            obsolete_number(){
                let r=0

                this.person.group?.forEach((o)=>{
                    if (o.dt_obsolete!=null){
                        r+=1
                    } 
                })
                return r
            }
        },
        methods:{
            localtime,
            myheaders,
            parseResponseError,
            useStore,
            addItem(){
                this.selected={
                    name: "",
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: `${this.useStore().apiroot}/api/person/${this.person.id}/`,
                };
                this.dialog=true;
                this.isEdition=false;
            },
            acceptAddition(){
                this.selected.dt_update=new Date();
                axios.post(`${this.useStore().apiroot}/api/group/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data; //To get id
                    this.tableData.push(this.selected)
                    this.dialog=false;
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
                this.selected.dt_update=new Date();
                axios.put(this.selected.url, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.selected=response.data;
                    this.dialog=false;
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                
            },
            cancelDialog(){
                this.dialog = false;                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this group?");
                if(r == false) {
                    return;
                }  
                axios.delete(item.url, this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item ); //Remove item
                    this.tableData.splice( i, 1 );
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
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
                this.refreshTableData()
                this.key=this.key+1
            },
            refreshTableData(){
                this.tableData=[]
                this.person.group?.forEach((o) => {
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