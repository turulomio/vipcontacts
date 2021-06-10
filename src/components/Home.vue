<template>
    <div>
        <h1>{{ $t('Wellcome to Vip Contacts') }}</h1>
        <br>
        <div v-show="this.$store.state.logged" class="padding">
            
            <v-row class="padding">
                <v-text-field 
                    v-model="search" 
                    type="text" 
                    :counter="100"  
                    v-bind:label="$t('String to search in contacts')" 
                    required 
                    autofocus
                    v-bind:placeholder="$t('Enter search')" 
                    v-on:keyup.enter="on_search_change()"
                ></v-text-field>
                <v-btn ref="cmdSearch" @click="on_search_change()" :disabled="!canclick" color="primary">
                    <v-icon>mdi-search</v-icon>
                    <span class="mr-2">{{ $t("Search") }}</span>
                </v-btn>    
            </v-row>
            <br>
            <TablePersons :data="data" @chipClicked="on_chip_clicked"></TablePersons>
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
                canclick:true,
                search:this.$store.state.lastsearch,
            }
        },
        methods: {
            forceCmdSearchClick(){
                this.$refs.cmdSearch.click();
            },
            on_search_change(){
                this.$store.state.lastsearch=this.search
                console.log(this.$store.state.lastsearch)
                this.canclick=false;
                var parsedsearch=this.search;
                if (this.search == '*'){
                    parsedsearch="__all__";
                } else if (this.search == ''){
                    parsedsearch="__none__";
                }
                
                axios.get(`${this.$store.state.apiroot}/api/find/?search=${parsedsearch}`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    console.log(response.data)
                    this.data= response.data;
                    this.canclick=true;
                }, (error) => {
                    this.parseResponseError(error)
                    this.canclick=true;
                });
            },
            on_chip_clicked(chip){
                this.search=chip
                this.on_search_change()
            }
        },
        created(){
            if (this.search!="" ){
                this.on_search_change()
            }
        }
    }
</script>

