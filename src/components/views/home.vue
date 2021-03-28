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
            :locale="this.$i18n.locale"
        ></v-data-table>
        
        <v-btn 
            color="primary" 
            to="/person/add"
        >{{ $t("Add a contact") }}</v-btn>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        name: 'home',
        data(){ 
            return{
                search:"",  
                data: [],
                headers: [
                    { text: this.$t('Name'), align: 'start', sortable: false, value: 'name'},
                    { text: this.$t('Surname'), value: 'surname' },
                    { text: this.$t('Second surname'), value: 'surname2' },
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
                axios.get(`http://192.168.1.100:8001/api/persons/?search=${this.search}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.data= response.data;
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

