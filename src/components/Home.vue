<template>
    <div class="pa-5">
        <h1>{{ $t('Wellcome to Vip Contacts') }}
            <MyMenuInline :items="menuinline_items" v-if="useStore().logged"></MyMenuInline>
        </h1>
        <div v-show="this.useStore().logged">
             <v-alert density="compact" class="ma-3 px-10" outlined type="error" v-if="next_important_dates.length>0" @click="on_click_alert_next_important_dates">{{$t("You have next important dates")}}</v-alert>
            <v-row class="pa-5">
                <v-text-field 
                    data-test="Home_Search"
                    v-model="search" 
                    type="text"
                    :counter="100"
                    :label="$t('String to search in contacts')" 
                    required 
                    autofocus
                    :placeholder="$t('Enter search')" 
                    v-on:keyup.enter="on_search_change()"
                    :disabled="loading"
                    clearable
                ></v-text-field>
                <v-btn data-test="Home_Button" ref="cmdSearch" class="ml-5" @click="on_search_change()" :disabled="loading" color="primary">
                    <v-icon>mdi-search</v-icon>
                    <span class="mr-2">{{ $t("Search") }}</span>
                </v-btn>    
            </v-row>
            <br>
            <TablePersons :data="data" :sorting="sortBy" @chipClicked="on_chip_clicked" @cruded="on_PersonCRUD_cruded"></TablePersons>
        </div>
        <!-- DIALOG PERSONCRUD -->
        <v-dialog v-model="dialog_person_crud" width="50%">
            <v-card class="pa-4">
                <PersonCRUD :person="person" :deleting="person_deleting" :key="key" @cruded="on_PersonCRUD_cruded()"></PersonCRUD>
            </v-card>
        </v-dialog>
        <!-- DIALOG NEST IMPORTANT DATES -->
        <v-dialog v-model="dialog_next_important_dates" width="70%">
            <v-card class="pa-4">
                <NextImportantDates :dates="next_important_dates" :key="key_important_dates"></NextImportantDates>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store'
    import { myheaders,parseResponseError,parseResponse } from '@/functions'
    import {empty_person} from '../empty_objects.js'
    import NextImportantDates from './NextImportantDates.vue'
    import TablePersons from './TablePersons.vue'
    import PersonCRUD from './PersonCRUD.vue'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    export default {
        components: {
            NextImportantDates,
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
                                code: function(){
                                    this.person=this.empty_person()
                                    this.key=this.key+1
                                    this.dialog_person_crud=true
                                }.bind(this),
                            },
                        ]
                    },
                    {
                        subheader: this.$t("Search options"),
                        children: [
                            {
                                name: this.$t("Last editions"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.search=":LAST 40"
                                    this.sortBy=[{key:"contact_last_update", order:"desc"}]
                                    this.on_search_change()
                                }.bind(this),
                            },
                            {
                                name: this.$t("Merge contacts"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.$router.push({name: "persons_merge"})
                                }.bind(this),
                            },
                        ]
                    },
                ],
                data: [],
                loading:false,
                search: useStore().lastsearch ?? ":LAST 40",
                sortBy: [{key:"dt_update", order:"desc"}],


                //IMPORTANT DAYS
                next_important_dates:[],
                dialog_next_important_dates:false,
                key_important_dates:0,

                // DIALOG PERSONCRUD
                dialog_person_crud:false,
                person: null,
                person_deleting: false,
                key:0,
            }
        },
        methods: {
            useStore,
            myheaders,
            empty_person,
            parseResponse,
            parseResponseError,
            on_click_alert_next_important_dates(){
                this.key_important_dates=this.key_important_dates+1
                this.dialog_next_important_dates=true
            },
            on_search_change(){
                if (this.search==null || this.search=="") return
                this.loading=true
                this.useStore().lastsearch=this.search
                var parsedsearch=this.search;
                if (this.search == '*'){
                    parsedsearch="__all__";
                } else if (this.search == ''){
                    parsedsearch="__none__";
                }
                
                axios.get(`${this.useStore().apiroot}/api/person/?search=${parsedsearch}`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.data= response.data
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            query_next_important_dates(){
                axios.get(`${this.useStore().apiroot}/next_important_dates/`, this.myheaders())
                .then((response) => {
                    this.parseResponse(response)
                    this.next_important_dates= response.data
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
            this.query_next_important_dates()
            this.on_search_change()
        }
    }
</script>
