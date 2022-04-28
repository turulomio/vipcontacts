<template>
    <div>
        <h1>{{ $t('Wellcome to Vip Contacts') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
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
                    :disabled="loading"
                ></v-text-field>
                <v-btn ref="cmdSearch" @click="on_search_change()" :disabled="loading" color="primary">
                    <v-icon>mdi-search</v-icon>
                    <span class="mr-2">{{ $t("Search") }}</span>
                </v-btn>    
            </v-row>
            <br>
            <TablePersons :data="data" @chipClicked="on_chip_clicked"></TablePersons>
        </div>
        <!-- DIALOG PERSONCRUD -->
        <v-dialog v-model="dialog_person_crud" width="35%">
            <v-card class="pa-4">
                <PersonCRUD :person="person" :deleting="person_deleting" :key="key_person_crud" @cruded="on_PersonCRUD_cruded()"></PersonCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'  
    import {empty_person} from '../empty_objects.js'
    import TablePersons from './TablePersons.vue'
    import PersonCRUD from './PersonCRUD.vue'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    export default {
        components: {
            TablePersons,
            MyMenuInline,
            PersonCRUD,
        },
        data(){ 
            return{
                menuinline_items: [
                    {
                        subheader: this.$t("Person options"),
                        children: [
                            {
                                name: this.$t("Add a new person"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.person=this_.empty_person()
                                    this_.key_person_crud=this_.key_person_crud+1
                                    this_.dialog_person_crud=true
                                },
                            },
                        ]
                    },
                ],
                data: [],
                loading:false,
                search:this.$store.state.lastsearch,


                // DIALOG PERSONCRUD
                dialog_person_crud:false,
                person: null,
                person_deleting: false,
                key_person_crud:0,
            }
        },
        methods: {
            empty_person,
            on_search_change(){
                if (this.search==null || this.search=="") return
                this.loading=true
                this.$store.state.lastsearch=this.search
                var parsedsearch=this.search;
                if (this.search == '*'){
                    parsedsearch="__all__";
                } else if (this.search == ''){
                    parsedsearch="__none__";
                }
                
                axios.get(`${this.$store.state.apiroot}/api/persons/?search=${parsedsearch}`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.data= response.data;
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            on_chip_clicked(chip){
                this.search=chip
                this.on_search_change()
            },
            on_PersonCRUD_cruded(){
                this.dialog_person_crud=false
                this.on_search_change()
            }
        },
        mounted(){
            this.on_search_change()
        }
    }
</script>
