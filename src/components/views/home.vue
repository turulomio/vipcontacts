<template>
    <div v-show="this.$store.state.logged">
            <v-text-field 
                v-model="search" 
                type="text" 
                :counter="100"  
                v-bind:label="$t('String to search in contacts')" 
                required 
                v-bind:placeholder="$t('Enter search')" 
                @keyup="on_search_change()"
            ></v-text-field>
            
  <v-data-table
    dense
    :headers="headers"
    :items="data"
    item-key="name"
    class="elevation-1"
  ></v-data-table>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        name: 'home',
        data(){ 
            return{
                search:"",  
                data: this.get_persons(),
                headers: [
                    { text: 'Name', align: 'start', sortable: false, value: 'name',},
                    { text: 'Surname', value: 'surname' },
                    { text: 'Second surname', value: 'surname2' },
                    { text: 'Birth', value: 'birth' },
                    { text: 'Death', value: 'death' },
                ],
            }
        },
        methods: {
            on_search_change(){
                this.get_persons()
            },            
            get_persons(){
                const formData = new FormData();
                formData.append('search', this.search);
                axios.get('http://192.168.1.100:8001/api/persons/', { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    console.log(response.data);
                    return response.data;
                }, (error) => {
                    console.log(error);
                });
            }
        },
        components: {
        }
    }
</script>
<style>
</style>

