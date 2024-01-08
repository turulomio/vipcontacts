<template>
    <div>
        <h1>{{ $t('Last contacts edited') }}</h1>
        <br>
        <div v-show="useStore().logged" class="padding">
            <TablePersons :data="data" orderby=""></TablePersons>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'  
    import TablePersons from './TablePersons.vue'
    import { useStore } from '@/store';
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
            useStore,
            on_search_change(){

            },
        },
        created(){
            axios.get(`${this.useStore().apiroot}/api/person/?last_editions=30`, this.myheaders())
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

