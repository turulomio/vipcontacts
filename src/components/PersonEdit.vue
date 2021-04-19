<template>
    <div v-show="this.$store.state.logged">
            <h1>{{ this.fullNameWithAge }}</h1>
        <div class="login    ">
            <v-row>
            <v-text-field v-model="person.name" type="text" :counter="75"  v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter name')" @input="person_fields_have_changed()"></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field v-model="person.surname" type="text" v-bind:label="$t('Surname')" :counter="75" v-bind:placeholder="$t('Enter surname')" @input="person_fields_have_changed()"></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field v-model="person.surname2" type="text" v-bind:label="$t('Second surname')" :counter="75" v-bind:placeholder="$t('Enter second surname')" @input="person_fields_have_changed()"></v-text-field>
            </v-row>
            <v-row>
                <v-menu v-model="menu_birth" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="person.birth" :label="$t('Birth date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="person.birth" @input="menu_birth = false ;person_fields_have_changed()" ></v-date-picker>
                </v-menu>         
                <v-icon x-small  @click="person.birth=null">mdi-backspace</v-icon>  
                <v-spacer></v-spacer>
                <v-menu v-model="menu_death" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="person.death" :label="$t('Death date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="person.death" @input="menu_death = false;person_fields_have_changed()"></v-date-picker>
                </v-menu>
                <v-icon x-small @click="person.death=null">mdi-backspace</v-icon>
                <v-spacer></v-spacer>
                
                <v-select :items="this.$store.state.catalogs.persongender" v-model="person.gender" :label="$t('Select a gender')" item-text="display_name" item-value="value" @input="person_fields_have_changed()"></v-select>  

            
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="person_edit()" :disabled="!person_changed" >{{ $t("Update") }}</v-btn>
                    <v-btn color="error" to="/">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>            
            </v-row>
        </div>
        <div class="tabs login">
            <v-card>
                <v-tabs  background-color="primary" dark v-model="tab" next-icon="mdi-arrow-right-bold-box-outline" prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                    <v-tab key="Alias"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Aliases")}}<v-badge v-show="badge_number('alias')>0" color="grey" class="ml-2" :content="badge_number('alias')"/></v-tab>
                    <v-tab key="Mails"><v-icon small class="mr-2">mdi-mail</v-icon>{{ $t("Mails")}}<v-badge v-show="badge_number('mail')>0" color="grey" class="ml-2" :content="badge_number('mail')"/></v-tab>
                    <v-tab key="Phones"><v-icon small style="margin:6px">mdi-phone</v-icon>{{ $t("Phones")}}<v-badge v-show="badge_number('phone')>0" color="grey" class="ml-2" :content="badge_number('phone')"/></v-tab>
                    <v-tab key="Addresses"><v-icon small style="margin:6px">mdi-map-marker</v-icon>{{ $t("Addresses")}}<v-badge v-show="badge_number('address')>0" color="grey" class="ml-2" :content="badge_number('address')"/></v-tab>
                    <v-tab key="Jobs"><v-icon small style="margin:6px">mdi-briefcase</v-icon>{{ $t("Jobs")}}<v-badge v-show="badge_number('job')>0" color="grey" class="ml-2" :content="badge_number('job')"/></v-tab>
                    <v-tab key="Relations"><v-icon small style="margin:6px">mdi-family-tree</v-icon>{{ $t("Relations")}}<v-badge v-show="badge_number('relationship')>0" color="grey" class="ml-2" :content="badge_number('relationship')"/></v-tab>
                    <v-tab key="Groups"><v-icon small style="margin:6px">mdi-group</v-icon>{{ $t("Groups")}}<v-badge v-show="badge_number('group')>0" color="grey" class="ml-2" :content="badge_number('group')"/></v-tab>
                    <v-tab key="Logs"><v-icon small style="margin:6px">mdi-calendar-clock</v-icon>{{ $t("Logs")}}<v-badge v-show="badge_number('log')>0"  color="grey" class="ml-2" :content="badge_number('log')"/></v-tab>
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                </v-tabs>
                <v-tabs-items v-model="tab">
                    <v-tab-item key="Alias">
                        <v-card flat>
                            <TableCrudAlias :person="this.person" :key="refreshKey" @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    
                    <v-tab-item key="Mails">
                        <v-card flat>
                            <TableCrudMail :person="this.person" :key="refreshKey"  @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Phones">
                        <v-card flat>
                            <TableCrudPhone :person="this.person" :key="refreshKey"  @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Address">
                        <v-card flat>
                            <TableCrudAddress :person="this.person" :key="refreshKey" @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Jobs">
                        <v-card flat>
                            <TableCrudJob :person="this.person" :key="refreshKey" @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Relations">
                        <v-card flat>
                            <TableCrudRelationship :person="this.person" :key="refreshKey" @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Groups">
                        <v-card flat>
                            <TableCrudGroup :person="this.person" :key="refreshKey" @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Logs">
                        <v-card flat>
                            <TableCrudLog :person="this.person" :key="refreshKey" @cruded="after_crud"/>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </div>
        <v-row> 
            <v-card-actions style="text-align:right">
                <v-spacer></v-spacer>
                <v-btn color="debug" @click.native="generateVcardFile()" >{{ $t("Export vCard") }}</v-btn>
                <v-btn color="debug" @click.native="generateQR()" >{{ $t("Show QR") }}</v-btn>
                <v-btn color="debug" @click.native="showSearchString" >{{ $t("Show search string") }}</v-btn>
            </v-card-actions>            
        </v-row>
        
        <v-dialog v-model="dialog_qr" max-width="800">
            <VueQRCodeComponent :text="qr" :size="qrsize"/>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import TableCrudAlias from './TableCrudAlias';
    import TableCrudAddress from './TableCrudAddress';
    import TableCrudGroup from './TableCrudGroup';
    import TableCrudJob from './TableCrudJob';
    import TableCrudLog from './TableCrudLog';
    import TableCrudMail from './TableCrudMail';
    import TableCrudPhone from './TableCrudPhone';
    import TableCrudRelationship from './TableCrudRelationship';
    import {logout, fullName} from '../functions.js'
    import VueQRCodeComponent from 'vue-qrcode-component'
    import vCardsJS from 'vcards-js'
    export default {
        name: 'PersonEdit',    
        components: {
            TableCrudAlias,
            TableCrudAddress,
            TableCrudMail,
            TableCrudPhone,
            TableCrudJob,
            TableCrudLog,
            TableCrudRelationship,
            TableCrudGroup,
            VueQRCodeComponent,
        },
        data () {
            return {
                tab: null,
                person: {}, //Created in created method works not in mounted                     
                menu_birth: false,
                menu_death: false,
                refreshKey:0,
                qr:"",
                qrsize: 800,
                dialog_qr: false,
                original: {},
                person_changed: false,
            }
        },
        computed: {
            fullNameWithAge: function (){
                var age_string="";
                if (this.person.birth != null && this.person.death == null){
                    age_string=` ( ${this.age(this.person.birth)} years )`
                } 
                else if (this.person.birth != null && this.person.death != null){
                    age_string=` ( Lived ${this.years_lived(this.person.birth, this.person.death)} years )`
                } 
                return `${this.fullName(this.person)}${age_string}`
            }
        },        
        methods: {
            logout,
            fullName,
            after_crud: function() {
                console.log("after_crud")
                this.get_person()
            },
            age(birth_iso_string) {
                //The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000 
                // ~~ Math.floor
                var birth = +new Date(birth_iso_string);
                return ~~((new Date() - birth ) / (31557600000));
            },
            years_lived(birth_iso_string,death_iso_string) {
                var birth = +new Date(birth_iso_string);
                var death = +new Date(death_iso_string);
                //The magic number: 31557600000 is 24 * 3600 * 365.25 * 1000 
                return ~~((death- birth) / (31557600000));
            },
            person_edit(){             

                axios.put(`${this.$store.state.apiroot}/api/persons/${this.person.id}/`, this.person,{ headers: {'Authorization': `Token ${this.$store.state.token}`, 'Content-Type': 'application/json'}})
                .then((response) => {
                    console.log(response.data);
                    this.name=null;
                    this.surname=null;
                    this.$router.push('/');
                }, (error) => {
                    console.log(error);
                });
            },
            get_person(){
                if (!this.$route.params.id){
                    alert(this.$t("Something is wrong"))
                    this.$router.push({ name: 'home'})
                    return
                }
                axios.get(`${this.$store.state.apiroot}/api/persons/${this.$route.params.id}/`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.person= response.data;
                    console.log("FULL PERSON");
                    console.log(this.person);
                    this.PersonEdit_refreshKey();
                    this.original={
                        name: this.person.name,
                        surname: this.person.surname,
                        surname2: this.person.surname2,
                        gender: this.person.gender,
                        birth: this.person.birth,
                        death: this.person.death,
                    }
                    console.log(this.original)
                    return response.data;//To make syncronous
                    
                }, (error) => {
                    console.log(error);
                });
            },
            PersonEdit_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating PersonEdit RefreshKey to ${this.refreshKey}`)
            },
            badge_number(s){
                try {
                    return this.person[s].length
                } catch (error) {
                    return 0
                }
            },
            generateVcardObject(){
                var vCard = vCardsJS();
                vCard.firstName = this.person.name;
                vCard.middleName = this.person.surname;
                vCard.lastName = this.person.surname2;
                if (this.person.birth) vCard.birthday = new Date(this.person.birth)
                vCard.cellPhone=this.person.phone.filter(function(o) {
                    if (o.dt_obsolete==null) {
                        return true; // skip
                    }
                    return false;  
                }).map(function(o) {
                    return o.phone
                });
                vCard.email=this.person.mail.filter(function(o) {
                    if (o.dt_obsolete==null) {
                        return true; // skip
                    }
                    return false;  
                }).map(function(o) {
                    return o.mail
                });
                return vCard
            },
            generateVcardFile(){
                var blob = new Blob([this.generateVcardObject().getFormattedString()], { type: 'text/vcard' });
                var link = window.document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${this.fullName(this.person)}.vcf`
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            generateQR(){
                const vCard=this.generateVcardObject()
                console.log(vCard.getFormattedString())
                this.qr=vCard.getFormattedString()
                this.dialog_qr=true
            },
            showSearchString(){
                let searchString=this.$t("Problems with search string")
                if (this.person.search.length==1){
                    searchString=this.person.search[0].string;
                }
                alert(searchString)
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
            }
        },

        mounted: function() {
            this.get_person()

            

        }
    }
</script>
<style scoped>
.tabicon{
    margin: 40px;
}
.login{
    padding:30px;
}
</style>
