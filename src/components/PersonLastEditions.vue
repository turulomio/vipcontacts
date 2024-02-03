<template>
    <div>
        <h1>{{ $t('Last contacts edited') }}</h1>
        <br>
        <div v-show="useStore().logged" class="padding">
            <TablePersons :data="data" :sorting="[{key:'contact_last_update',order:'desc'}]"></TablePersons>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'  
    import TablePersons from './TablePersons.vue'
    import { useStore } from '@/store';
    import { myheaders,parseResponse,parseResponseError } from '@/functions';
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
            myheaders,parseResponse,parseResponseError,
            on_search_change(){

            },
        },
        created(){
            axios.get(`${this.useStore().apiroot}/api/person/?last_editions=30`, this.myheaders())
            .then((response) => {
                this.parseResponse(response)
                this.data= response.data;
            }, (error) => {
                this.parseResponseError(error)
            });
        }
    }
</script>

