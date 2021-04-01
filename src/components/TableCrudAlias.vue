<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="tableData" sort-by="name" class="elevation-1">
              <template v-slot:item.dt_update="{ item }">
                <span>{{ localtime(item.dt_update) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon small class="mr-2" @click="obsoleteItem(item)">mdi-timer-off</v-icon>
            </template>
        </v-data-table>
    </div>

</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    export default {
        name: 'TableCrudAlias',
        props: ['alias'],
        data () {
            return {
                tableData: this.alias,
                tableHeaders: [
                    { text: this.$t('Last update'), align: 'start', value: 'dt_update',sortable: true },
                    { text: this.$t('Name'),  sortable: true, value: 'name'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],                      
            }
        },
        methods:{
            editItem(item){
                item.name=prompt(this.$t("Edit this alias"),item.name)
                item.dt_update=new Date()                
                axios.put(item.url, item,{ headers: {'Authorization': `Token ${this.$store.state.token}`, 'Content-Type': 'application/json'}})
                .then((response) => {
                    console.log(response.data);
                }, (error) => {
                    console.log(error);
                });
                
            },
            deleteItem(item){
                item
            },
            obsoleteItem(item){
                item
            },
            localtime(value){
                if (value){
                    var dateFormat = 'YYYY-MM-DD HH:mm:ss';
                    var testDateUtc = moment.utc(value);
                    var localDate = testDateUtc.local();
                    return (localDate.format(dateFormat)); // 2015-30-01 02:00:00
                }
                return null
            },
        },

    }
</script>
<style scoped>
</style>
