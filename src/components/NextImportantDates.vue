<template>
    <div class="pa-5">
        <h1>{{ $t('Next important dates') }}</h1>
        <v-data-table :headers="headers" :items="dates" :sort-by="['date2']" :sort-desc="[true]" class="elevation-1" @click:row="viewItem">
            <template v-slot:[`item.date2`]="{ item }">{{ changeYear(item) }}</template>    
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
                    { title: this.$t('Date'), align: 'start', sortable: true, value: 'date2', width:"10%"},
                    { title: this.$t('Name'), value: 'person', width:"45%" },
                    { title: this.$t('Reason'), value: 'reason', width:"45%"},
                ],
            }
        },
        methods: {
            viewItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },
            changeYear(item){
                console.log("chasnge")
                var o=new Date(item.date)
                console.log(o)
                var today=new Date()
                console.log(today)
                if (o.getMonth()>=today.getMonth()){
                    return new Date(today.getFullYear(),o.getMonth(),o.getDate()+1).toISOString().slice(0,10)
                } else {
                    return new Date(today.getFullYear()+1,o.getMonth(),o.getDate()+41).toISOString().slice(0,10)
                }
            }
        }
    }
</script>
