<template>
    <div v-show="this.$store.state.logged">
        <h1>{{ this.fullNameWithAge }}
                <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>

        <DisplayValues :items="displayvalues()" :key="key"></DisplayValues>
        <div class="tabs login">
            <v-card>
                <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                    <v-tab key="Alias"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Aliases")}}<v-badge v-show="badge_number('alias')>0" color="error" class="ml-2" :content="badge_number('alias')"/></v-tab>
                    <v-tab key="Mails"><v-icon small class="mr-2">mdi-mail</v-icon>{{ $t("Mails")}}<v-badge v-show="badge_number('mail')>0" color="error" class="ml-2" :content="badge_number('mail')"/></v-tab>
                    <v-tab key="Phones"><v-icon small style="margin:6px">mdi-phone</v-icon>{{ $t("Phones")}}<v-badge v-show="badge_number('phone')>0" color="error" class="ml-2" :content="badge_number('phone')"/></v-tab>
                    <v-tab key="Addresses"><v-icon small style="margin:6px">mdi-map-marker</v-icon>{{ $t("Addresses")}}<v-badge v-show="badge_number('address')>0" color="error" class="ml-2" :content="badge_number('address')"/></v-tab>
                    <v-tab key="Jobs"><v-icon small style="margin:6px">mdi-briefcase</v-icon>{{ $t("Jobs")}}<v-badge v-show="badge_number('job')>0" color="error" class="ml-2" :content="badge_number('job')"/></v-tab>
                    <v-tab key="Relations"><v-icon small style="margin:6px">mdi-family-tree</v-icon>{{ $t("Relations")}}<v-badge v-show="badge_number('relationship')>0" color="error" class="ml-2" :content="badge_number('relationship')"/></v-tab>
                    <v-tab key="Groups"><v-icon small style="margin:6px">mdi-group</v-icon>{{ $t("Groups")}}<v-badge v-show="badge_number('group')>0" color="error" class="ml-2" :content="badge_number('group')"/></v-tab>
                    <v-tab key="Media"><v-icon small style="margin:6px">mdi-folder-multiple-image</v-icon>{{ $t("Media")}}<v-badge v-show="badge_number('blob')>0"  color="error" class="ml-2" :content="badge_number('blob')"/></v-tab>
                    <v-tab key="Logs"><v-icon small style="margin:6px">mdi-calendar-clock</v-icon>{{ $t("Logs")}}<v-badge v-show="badge_number('log')>0"  color="error" class="ml-2" :content="badge_number('log')"/></v-tab>
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="Alias">
                        <v-card flat>
                            <TableCrudAlias :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('alias')"/>
                        </v-card>
                    </v-tab-item>
                    
                    <v-tab-item key="Mails">
                        <v-card flat>
                            <TableCrudMail :person="this.person" :key="key"  @cruded="after_crud" :obsolete="obsolete_number('mail')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Phones">
                        <v-card flat>
                            <TableCrudPhone :person="this.person" :key="key"  @cruded="after_crud" :obsolete="obsolete_number('phone')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Address">
                        <v-card flat>
                            <TableCrudAddress :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('address')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Jobs">
                        <v-card flat>
                            <TableCrudJob :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('job')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Relations">
                        <v-card flat>
                            <TableCrudRelationship :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('relationship')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Groups">
                        <v-card flat>
                            <TableCrudGroup :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('group')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Media">
                        <v-card flat>
                            <TableCrudBlob :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('blob')"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Logs">
                        <v-card flat>
                            <TableCrudLog :person="this.person" :key="key" @cruded="after_crud" :obsolete="obsolete_number('log')"/>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </div>
        
        <!-- DIALOG QR -->
        <v-dialog v-model="dialog_qr" max-width="800">
             <QrcodeVue :value="qr" :size="800" ></QrcodeVue>
        </v-dialog>

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
    import TableCrudAlias from './TableCrudAlias';
    import TableCrudAddress from './TableCrudAddress';
    import TableCrudBlob from './TableCrudBlob';
    import TableCrudGroup from './TableCrudGroup';
    import TableCrudJob from './TableCrudJob';
    import TableCrudLog from './TableCrudLog';
    import TableCrudMail from './TableCrudMail';
    import TableCrudPhone from './TableCrudPhone';
    import TableCrudRelationship from './TableCrudRelationship';
    import PersonCRUD from './PersonCRUD.vue';
    import MyMenuInline from './reusing/MyMenuInline.vue'
    import DisplayValues from './reusing/DisplayValues.vue'
    import {age_today, age_in_a_date, generateVcardObject} from '../functions.js'
    import QrcodeVue from 'qrcode.vue'
    export default {
        name: 'PersonView',    
        components: {
            TableCrudAlias,
            TableCrudAddress,
            TableCrudBlob,
            TableCrudMail,
            TableCrudPhone,
            TableCrudJob,
            TableCrudLog,
            TableCrudRelationship,
            TableCrudGroup,
            QrcodeVue,
            MyMenuInline,
            DisplayValues,
            PersonCRUD,
        },
        data () {
            return {
                menuinline_items: [
                    {
                        subheader: this.$t("Contact options"),
                        children: [
                            {
                                name: this.$t("Edit contact"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.person_deleting=false
                                    this_.key_person_crud=this_.key_person_crud+1
                                    this_.dialog_person_crud=true
                                },
                            },
                            {
                                name: this.$t("Delete contact"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.person_deleting=true
                                    this_.key_person_crud=this_.key_person_crud+1
                                    this_.dialog_person_crud=true
                                },
                            },
                            {
                                name: this.$t("Generate QR"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    const vCard=this_.generateVcardObject(this_.person)
                                    console.log(vCard.getFormattedString())
                                    this_.qr=vCard.getFormattedString()
                                    this_.dialog_qr=true
                                },
                            },
                            {
                                name: this.$t("Generate VCard"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    var blob = new Blob([this_.generateVcardObject(this_.person).getFormattedString()], { type: 'text/vcard' });
                                    var link = window.document.createElement('a');
                                    link.href = window.URL.createObjectURL(blob);
                                    link.download = `${this_.person.fullname}.vcf`
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                },
                            },
                            {
                                name: this.$t("Show search string"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    let searchString=this_.$t("Problems with search string")
                                    if (this_.person.search.length==1){
                                        searchString=this_.person.search[0].string;
                                    }
                                    alert(searchString)
                                },
                            },
                        ]
                    },
                ],
                tab: null,
                person: {}, //Created in created method works not in mounted                     
                qr:"",
                qrsize: 800,
                dialog_qr: false,
                original: {},
                person_changed: false,
                key:0,


                // DIALOG PERSONCRUD
                dialog_person_crud:false,
                person_deleting: false,
                key_person_crud:0,
            }
        },
        computed: {
            fullNameWithAge: function (){
                var age_string="";
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
            displayvalues(){
                var r=[
                    {title:this.$t('Gender'), value: this.person.gender},
                    {title:this.$t('Birth date'), value: this.person.birth},
                ]
                if (this.person.death!=null){
                    r.push({title:this.$t('Death date'), value: this.person.death})
                }
                return r
            },
            age_today,
            age_in_a_date,
            generateVcardObject,
            after_crud: function() {
                console.log("after_crud")
                this.get_person()
            },
            get_person(){
                if (!this.$route.params.id){
                    alert(this.$t("Something is wrong"))
                    this.$router.push({ name: 'home'})
                    return
                }
                axios.get(`${this.$store.state.apiroot}/api/persons/${this.$route.params.id}/`, this.myheaders())
                .then((response) => {
                    this.person= response.data;
                    console.log(this.person);
                    this.PersonView_key();
                    this.set_original()
                    this.person_fields_have_changed()
                    return response.data;//To make syncronous
                    
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            // Used to manually clear the form
            //
            // @arg The first parameter is a Boolean value that represents...
            //
            set_original(){
                this.original={
                    name: this.person.name,
                    surname: this.person.surname,
                    surname2: this.person.surname2,
                    gender: this.person.gender,
                    birth: this.person.birth,
                    death: this.person.death,
                }
            },
            PersonView_key(){
                this.key=this.key+1;
                console.log(`Updating PersonView key to ${this.key}`)
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

            person_fields_have_changed(){
                console.log("AHORA CHANGED")
                if (this.person.name!=this.original.name ||
                    this.person.surname!=this.original.surname ||
                    this.person.surname2!=this.original.surname2 ||
                    this.person.birth!=this.original.birth ||
                    this.person.death!=this.original.death ||
                    this.person.gender!=this.original.gender 
                ) {
                    this.person_changed= true
                } else {
                    this.person_changed=false
                }
            },
            on_PersonCRUD_cruded(){
                this.dialog_person_crud=false
                this.get_person()
            },
        },

        mounted: function() {
            this.get_person()

            

        }
    }
</script>