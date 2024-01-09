<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" :sort-by="[{key:'dt_update',order:'asc'}]" class="elevation-1" :key="refreshKey" >
              <template v-slot:[`item.dt_update`]="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>            
        <v-btn data-test="TableCrudAlias_Add" color="primary" @click="addAlias()" >{{ $t('Add alias') }}</v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==false">{{ $t('Show obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
        <v-btn color="primary" @click="showObsolete()" v-if="vShowObsolete==true">{{ $t('Hide obsolete') }}<v-badge color="error" v-if="obsolete>0" class="ml-2" :content="obsolete"/></v-btn>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { myheaders, parseResponseError } from '@/functions';
    export default {
        props: ['person','obsolete'],
        data () {
            return {
                refreshKey:0,
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
            }
        },
        methods:{
            useStore,
            myheaders,
            parseResponseError,
            addAlias(){
                var alias={
                    name:null,
                    dt_update:new Date(),
                    dt_obsolete:null,
                    person:`${this.useStore().apiroot}/api/person/${this.person.id}/`,                    
                }
                alias.name=prompt(this.$t("Add a alias"), "")
                axios.post(`${this.useStore().apiroot}/api/alias/`, alias, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.tableData.push(response.data);
                    this.TableCrudAlias_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return alias;
            },
            
            editItem(item){
                console.log(item)
                item.name=prompt(this.$t("Edit this alias"),item.name)
                item.dt_update=new Date()                
                axios.put(item.url, item, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.TableCrudAlias_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
                
            },
            deleteItem(item){
                var r = confirm("Do you want to delete this item?");
                if(r == false) {
                    return;
                }              
                console.log(item)
                axios.delete(item.url , this.myheaders())
                .then((response) => {
                    console.log(response);
                    var i = this.tableData.indexOf( item );
                    this.tableData.splice( i, 1 );
                    this.TableCrudAlias_refreshKey();
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
                    this.TableCrudAlias_refreshKey();
                    this.$emit('cruded')
                }, (error) => {
                    this.parseResponseError(error)
                });
                return item;
            },
            showObsolete(){
                this.vShowObsolete=!this.vShowObsolete;
            },
            TableCrudAlias_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating TableCrudAlias RefreshKey to ${this.refreshKey}`)
            }
        },
    }
</script>
<style scoped>
</style>
