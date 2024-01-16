<template>
    <div v-show="useStore().logged">
        <h1>{{ fullNameWithAge }}
                <MyMenuInline :items="menuinline_items"></MyMenuInline>
                <v-btn data-test="PersonView_ButtonClose" small style="color:darkgrey" icon="mdi-close" class="elevation-0" @click="on_close"/>
        </h1>

        <DisplayValues :items="displayvalues()" :key="key+1"></DisplayValues>

        <div class="last_update mr-8" v-html="$t('Last modification: {0}').format(localtime(this.person.contact_last_update))"></div>
        <div class="tabs login">
            <v-card>
                <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                    <v-tab data-test="PersonView_TabAlias" key="Alias"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Aliases")}}<v-badge inline v-show="badge_number('alias')>0" color="error" class="ml-2" :content="badge_number('alias')"/></v-tab>
                    <v-tab data-test="PersonView_TabMails" key="Mails"><v-icon small class="mr-2">mdi-mail</v-icon>{{ $t("Mails")}}<v-badge inline v-show="badge_number('mail')>0" color="error" class="ml-2" :content="badge_number('mail')"/></v-tab>
                    <v-tab data-test="PersonView_TabPhones" key="Phones"><v-icon small style="margin:6px">mdi-phone</v-icon>{{ $t("Phones")}}<v-badge inline v-show="badge_number('phone')>0" color="error" class="ml-2" :content="badge_number('phone')"/></v-tab>
                    <v-tab data-test="PersonView_TabAddresses" key="Addresses"><v-icon small style="margin:6px">mdi-map-marker</v-icon>{{ $t("Addresses")}}<v-badge inline v-show="badge_number('address')>0" color="error" class="ml-2" :content="badge_number('address')"/></v-tab>
                    <v-tab data-test="PersonView_TabJobs" key="Jobs"><v-icon small style="margin:6px">mdi-briefcase</v-icon>{{ $t("Jobs")}}<v-badge inline v-show="badge_number('job')>0" color="error" class="ml-2" :content="badge_number('job')"/></v-tab>
                    <v-tab data-test="PersonView_TabRelationships" key="Relations"><v-icon small style="margin:6px">mdi-family-tree</v-icon>{{ $t("Relations")}}<v-badge inline v-show="badge_number('relationship')>0" color="error" class="ml-2" :content="badge_number('relationship')"/></v-tab>
                    <v-tab data-test="PersonView_TabGroups" key="Groups"><v-icon small style="margin:6px">mdi-group</v-icon>{{ $t("Groups")}}<v-badge inline v-show="badge_number('group')>0" color="error" class="ml-2" :content="badge_number('group')"/></v-tab>
                    <v-tab data-test="PersonView_TabMedia" key="Media"><v-icon small style="margin:6px">mdi-folder-multiple-image</v-icon>{{ $t("Media")}}<v-badge inline v-show="badge_number('blob')>0"  color="error" class="ml-2" :content="badge_number('blob')"/></v-tab>
                    <v-tab data-test="PersonView_TabLogs" key="Logs"><v-icon small style="margin:6px">mdi-calendar-clock</v-icon>{{ $t("Logs")}}<v-badge inline v-show="badge_number('log')>0"  color="error" class="ml-2" :content="badge_number('log')"/></v-tab>
                </v-tabs>
                <v-window v-model="tab">
                    <v-window-item key="Alias">
                        <v-card flat>
                            <TableAlias :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('alias')"/>
                        </v-card>
                    </v-window-item>
                    
                    <v-window-item key="Mails">
                        <v-card flat>
                            <TableMail :person="this.person" :key="key+1"  @cruded="after_crud" :obsolete="obsolete_number('mail')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Phones">
                        <v-card flat>
                            <TablePhone :person="this.person" :key="key+1"  @cruded="after_crud" :obsolete="obsolete_number('phone')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Address">
                        <v-card flat>
                            <TableAddress :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('address')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Jobs">
                        <v-card flat>
                            <TableJob :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('job')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Relations">
                        <v-card flat>
                            <TableRelationship :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('relationship')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Groups">
                        <v-card flat>
                            <TableGroup :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('group')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Media">
                        <v-card flat>
                            <TableBlob :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('blob')"/>
                        </v-card>
                    </v-window-item>
                    <v-window-item key="Logs">
                        <v-card flat>
                            <TableLog :person="this.person" :key="key+1" @cruded="after_crud" :obsolete="obsolete_number('log')"/>
                        </v-card>
                    </v-window-item>
                </v-window>
            </v-card>
        </div>
        
        <!-- DIALOG QR -->
        <v-dialog v-model="dialog_qr" max-width="800">
             <QrcodeVue :value="qr" :size="800" ></QrcodeVue>
        </v-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import TableAlias from './TableAlias'
    import TableAddress from './TableAddress'
    import TableBlob from './TableBlob'
    import TableGroup from './TableGroup'
    import TableJob from './TableJob'
    import TableLog from './TableLog'
    import TableMail from './TableMail'
    import TablePhone from './TablePhone'
    import TableRelationship from './TableRelationship'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import DisplayValues from './reusing/DisplayValues.vue'
    import {age_today, age_in_a_date, generateVcardObject,getObjectPropertyByValue,myheaders,parseResponseError} from '../functions.js'
    import { localtime } from 'vuetify_rules'
    import { useStore } from '@/store';
    import QrcodeVue from 'qrcode.vue'
    export default {
        name: 'PersonView',    
        components: {
            TableAlias,
            TableAddress,
            TableBlob,
            TableMail,
            TablePhone,
            TableJob,
            TableLog,
            TableRelationship,
            TableGroup,
            QrcodeVue,
            MyMenuInline,
            DisplayValues,
        },
        props: {
            person_url: { //url
                required: true
            },
        },
        data () {
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Contact options"),
                        children: [

                            {
                                name: this.$t("Generate QR"),
                                icon: "mdi-plus",
                                code: function(){
                                    const vCard=this.generateVcardObject(this.person)
                                    console.log(vCard.getFormattedString())
                                    this.qr=vCard.getFormattedString()
                                    this.dialog_qr=true
                                }.bind(this),
                            },
                            {
                                name: this.$t("Generate VCard"),
                                icon: "mdi-plus",
                                code: function(){
                                    var blob = new Blob([this.generateVcardObject(this.person).getFormattedString()], { type: 'text/vcard' })
                                    var link = window.document.createElement('a')
                                    link.href = window.URL.createObjectURL(blob)
                                    link.download = `${this.person.fullname}.vcf`
                                    document.body.appendChild(link)
                                    link.click()
                                    document.body.removeChild(link)
                                }.bind(this),
                            },
                            {
                                name: this.$t("Show search string"),
                                icon: "mdi-plus",
                                code: function(){
                                    let searchString=this.$t("Problems with search string")
                                    if (this.person.search.length==1){
                                        searchString=this.person.search[0].string
                                    }
                                    alert(searchString)
                                }.bind(this),
                            },

                        ]
                    },
                ],
                tab: null,
                person: {}, //Created in created method works not in mounted                     
                qr:"",
                qrsize: 800,
                dialog_qr: false,
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
            displayvalues(){
                var r=[
                    {title:this.$t('Gender'), value: getObjectPropertyByValue("persongender",this.person.gender,"display_name")},
                    {title:this.$t('Birth date'), value: this.person.birth},
                ]
                if (this.person.death!=null){
                    r.push({title:this.$t('Death date'), value: this.person.death})
                }
                return r
            },
            after_crud: function() {
                this.get_person()
            },
            get_person(){

                axios.get(this.person_url, this.myheaders())
                .then((response) => {
                    this.person= response.data
                    console.log(this.person)
                    this.key=this.key+1
                    return response.data//To make syncronous
                    
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            badge_number(s){
                try{
                    if (s=='log'){
                        return this.person[s].filter(p => p.retypes>=100).reduce((accum) => accum + 1, 0)
                    } else {
                        return this.person[s].filter(p => p.dt_obsolete==null).reduce((accum) => accum + 1, 0)
                    }
                } catch (error) {
                    return 0
                }
            },
            obsolete_number(s){
                try{
                    if (s=='log'){
                        return this.person[s].filter(p => p.retypes<100).reduce((accum) => accum + 1, 0)
                    } else {
                        return this.person[s].filter(p => p.dt_obsolete!=null).reduce((accum) => accum + 1, 0)
                    }
                } catch (error) {
                    return 0
                }
            },
            on_close(){
                this.$emit("closed")
            }
        },

        created() {
            this.get_person()
        }
    }
</script>