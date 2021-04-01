<template>
    <div>
        <h1>{{ $t('Wellcome to Vip Contacts') }}</h1>
        <div v-show="this.$store.state.logged">
            <v-container>
                <v-text-field 
                    class="w-50"
                    v-model="search" 
                    type="text" 
                    :counter="100"  
                    v-bind:label="$t('String to search in contacts')" 
                    required 
                    v-bind:placeholder="$t('Enter search')" 
                    @keyup="on_search_change()"
                ></v-text-field>
                        
            <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1" v-show="data.length>0">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Search results</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
            <br>
            <v-alert type="info" 
      border="left" dense v-show="data.length==0 && search!=''">{{ this.$t('No contacts found') }}</v-alert>
            </v-container>
        </div>
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
                dialog:false,
                headers: [
                    { text: this.$t('Name'), align: 'start', sortable: true, value: 'name'},
                    { text: this.$t('Surname'), value: 'surname' },
                    { text: this.$t('Second surname'), value: 'surname2' },
                    { text: this.$t('Birth date'), value: 'birth' },
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                    ],      
            }
        },
        methods: {
            on_search_change(){
                this.get_persons()
            },            
            get_persons(){
                var parsedsearch=this.search;
                if (this.search == '*'){
                    parsedsearch="__all__";
                } else if (this.search == ''){
                    parsedsearch="__none__";
                }
                
            
                axios.get(`${this.$store.state.apiroot}/api/persons/search/${parsedsearch}/`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.data= response.data;
                    console.log(this.data)
                }, (error) => {
                    console.log(error);
                });
            },
            editItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },

            deleteItem (item) {
               var r = confirm("Do you want to delete this item?");
               if(r == false) {
                  return
               } 
                axios.delete(`${this.$store.state.apiroot}/api/persons/${item.id}`,{headers: {"Authorization": `Token ${this.$store.state.token}`}})
                .then((response) => {
                    console.log(response);
                    this.on_search_change()
                }, (error) => {
                    console.log(error);
                });
            },

        },
        components: {
        }
    }
</script>

