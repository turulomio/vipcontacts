<template>
    <div v-show="useStore().logged">
        <h1>{{ $t("Historical register of") + fullNameWithAge }}
                <v-btn data-test="PersonHistoricalRegister_ButtonClose" small style="color:darkgrey" icon="mdi-close" class="elevation-0" @click="on_close"/>
        </h1>
        <div class="tabs login" v-if="historical">
            <v-card>
                <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                    <v-tab data-test="PersonHistoricalRegister_TabAlias" key="Alias"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Aliases")}}<v-badge inline v-show="badge_number('alias')>0" color="error" class="ml-2" :content="badge_number('alias')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabMails" key="Mails"><v-icon small class="mr-2">mdi-mail</v-icon>{{ $t("Mails")}}<v-badge inline v-show="badge_number('mail')>0" color="error" class="ml-2" :content="badge_number('mail')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabPhones" key="Phones"><v-icon small style="margin:6px">mdi-phone</v-icon>{{ $t("Phones")}}<v-badge inline v-show="badge_number('phone')>0" color="error" class="ml-2" :content="badge_number('phone')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabAddresses" key="Addresses"><v-icon small style="margin:6px">mdi-map-marker</v-icon>{{ $t("Addresses")}}<v-badge inline v-show="badge_number('address')>0" color="error" class="ml-2" :content="badge_number('address')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabJobs" key="Jobs"><v-icon small style="margin:6px">mdi-briefcase</v-icon>{{ $t("Jobs")}}<v-badge inline v-show="badge_number('job')>0" color="error" class="ml-2" :content="badge_number('job')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabRelationships" key="Relations"><v-icon small style="margin:6px">mdi-family-tree</v-icon>{{ $t("Relations")}}<v-badge inline v-show="badge_number('relationship')>0" color="error" class="ml-2" :content="badge_number('relationship')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabGroups" key="Groups"><v-icon small style="margin:6px">mdi-group</v-icon>{{ $t("Groups")}}<v-badge inline v-show="badge_number('group')>0" color="error" class="ml-2" :content="badge_number('group')"/></v-tab>
                    <v-tab data-test="PersonHistoricalRegister_TabLogs" key="Logs"><v-icon small style="margin:6px">mdi-calendar-clock</v-icon>{{ $t("Logs")}}<v-badge inline v-show="badge_number('log')>0"  color="error" class="ml-2" :content="badge_number('log')"/></v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item key="Alias">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.alias"/>
                        </v-card>
                    </v-window-item>
                    
                    <v-window-item key="Mails">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.mail"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Phones">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.phone"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Address">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.address"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Jobs">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.job"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Relations">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.relationship"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Groups">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.group"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Logs">
                        <v-card flat>
                            <TableArrayOfObjects :aoo="historical.log"/>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-card>
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import TableArrayOfObjects from '@/components/TableArrayOfObjects.vue'
    import {age_today, age_in_a_date, generateVcardObject,getObjectPropertyByValue,myheaders,parseResponseError} from '../functions.js'
    import { localtime } from 'vuetify_rules'
    import { useStore } from '@/store';
    export default {
        name: 'PersonHistoricalRegister',    
        components: {
            TableArrayOfObjects
        },
        props: {
            person: { // object
                required: true
            },
        },
        data () {
            return {
                historical:null,

                tab: 0,            
                key:0,

            }
        },
        computed: {
            fullNameWithAge: function (){
                var age_string=""
                if (this.person.birth != null && this.person.death == null){
                    age_string=` ( ${this.age_today(this.person.birth)} years )`
                } 
                else if (this.person.birth == null && this.person.death != null){
                    age_string=this.$t(` ( Deceased )`)
                } 
                else if (this.person.birth != null && this.person.death != null){
                    age_string=` ( Lived ${this.age_in_a_date(this.person.birth, this.person.death)} years )`
                } 
                return `${this.person.fullname}${age_string}`
            }
        },        
        methods: {
            useStore,
            localtime,
            myheaders,
            getObjectPropertyByValue,
            age_today,
            age_in_a_date,
            generateVcardObject,
            parseResponseError,
            get_historical(){

                axios.get(this.person.url+"historical_register/", this.myheaders())
                .then((response) => {
                    this.historical=response.data
                    console.log(this.historical)
                    this.key=this.key+1
                    
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            badge_number(s){
                return this.historical[s].length
            },
            on_close(){
                this.$emit("closed")
            }
        },

        created() {
            this.get_historical()
        }
    }
</script>