<template>
    <div>
        <h1>{{ $t('Last contacts edited') }}</h1>
        <br>
        <div v-show="this.$store.state.logged" class="padding">
            <TablePersons :data="data" orderby=""></TablePersons>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'  
    import TablePersons from './TablePersons.vue'
    export default {
        name: 'home',
        components: {
            TablePersons
        },
        data(){ 
            return{
                data: [],
            }
        },
        methods: {
            on_search_change(){

            },
        },
        created(){
            axios.get(`${this.$store.state.apiroot}/api/person/?last_editions=30`, this.myheaders())
            .then((response) => {
                this.parseResponse(response)
                console.log(response.data)
                this.data= response.data;
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }
</script>

