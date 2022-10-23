<template>
    <div class="pa-5">
        <h1>{{ $t('Next important dates') }}</h1>
        <v-data-table :headers="headers" :items="dates" sort-by="date" class="elevation-1" @click:row="viewItem">
        </v-data-table>
    </div>
</template>
<script>
    export default {
        props:{
            dates:{
                required:true,
            },            
        },
        data(){ 
            return{
                loading:false,
                headers: [
                    { text: this.$t('Date'), align: 'start', sortable: true, value: 'date', width:"15%"},
                    { text: this.$t('Name'), value: 'person', width:"15%" },
                    { text: this.$t('Reason'), value: 'reason', width:"15%"},
                ],
            }
        },
        methods: {
            viewItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },
        }
    }
</script>
