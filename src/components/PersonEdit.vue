<template>
    <div v-show="this.$store.state.logged">
            <h1>{{ this.fullName }}</h1>
        <div class="login    ">
            <v-row>
            <v-text-field v-model="person.name" type="text" :counter="75"  v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter name')" ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field v-model="person.surname" type="text" v-bind:label="$t('Surname')" :counter="75" v-bind:placeholder="$t('Enter surname')" ></v-text-field>
            <v-spacer></v-spacer>
            <v-text-field v-model="person.surname2" type="text" v-bind:label="$t('Second surname')" :counter="75" v-bind:placeholder="$t('Enter second surname')" ></v-text-field>
            </v-row>
            <v-row>
                <v-menu v-model="menu_birth" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="person.birth" :label="$t('Birth date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="person.birth" @input="menu_birth = false" ></v-date-picker>
                </v-menu>         
                <v-icon x-small  @click="person.birth=null">mdi-backspace</v-icon>  
                <v-spacer></v-spacer>
                <v-menu v-model="menu_death" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="person.death" :label="$t('Death date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="person.death" @input="menu_death = false" ></v-date-picker>
                </v-menu>
                <v-icon x-small @click="person.death=null">mdi-backspace</v-icon>
                <v-spacer></v-spacer>
                
                <v-select :items="this.$store.state.catalogs.persongender" v-model="person.gender" :label="$t('Select a gender')" item-text="display_name" item-value="value"  ></v-select>  

            
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="person_edit()" >{{ $t("Update") }}</v-btn>
                    <v-btn color="error" to="/">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>            
            </v-row>
        </div>
        
            
            
        <div class="tabs login">
            <v-card>
                <v-tabs  background-color="primary" dark v-model="tab"      next-icon="mdi-arrow-right-bold-box-outline"
      prev-icon="mdi-arrow-left-bold-box-outline"
      show-arrows
    >
                    <v-tab key="Alias"><v-icon small style="margin:6px">mdi-rename-box</v-icon>{{ $t("Aliases")}}</v-tab>
                    <v-tab key="Mails"><v-icon small style="margin:6px">mdi-mail</v-icon>{{ $t("Mails")}}</v-tab>
                    <v-tab key="Phones"><v-icon small style="margin:6px">mdi-phone</v-icon>{{ $t("Phones")}}</v-tab>
                    <v-tab key="Addresses"><v-icon small style="margin:6px">mdi-map-marker</v-icon>{{ $t("Addresses")}}</v-tab>
                    <v-tab key="Jobs"><v-icon small style="margin:6px">mdi-briefcase</v-icon>{{ $t("Jobs")}}</v-tab>
                    <v-tab key="Relations"><v-icon small style="margin:6px">mdi-family-tree</v-icon>{{ $t("Relations")}}</v-tab>
                    <v-tab key="Groups"><v-icon small style="margin:6px">mdi-group</v-icon>{{ $t("Groups")}}</v-tab>
                    <v-tab key="Events"><v-icon small style="margin:6px">mdi-calendar-clock</v-icon>{{ $t("Events")}}</v-tab>


      <v-tabs-slider color="yellow"></v-tabs-slider>
      </v-tabs>

                <v-tabs-items v-model="tab">
                    <v-tab-item key="Alias">
                        <v-card flat>
                            <TableCrudAlias :person="this.person" :key="refreshKey"></TableCrudAlias>
                        </v-card>
                    </v-tab-item>
                    
                    <v-tab-item key="Mails">
                        <v-card flat>
                            <TableCrudMail :person="this.person" :key="refreshKey" />
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Phones">
                        <v-card flat>
                            <TableCrudPhone :person="this.person" :key="refreshKey" />
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Address">
                        <v-card flat>
                            <TableCrudAddress :person="this.person" :key="refreshKey"></TableCrudAddress>
                        </v-card>
                    </v-tab-item>
                    <v-tab-item key="Events">
                        <v-card flat>
                            <v-card-text>Mis events</v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-card>
        </div>
            <v-row> 
                <v-card-actions style="text-align:right">
                    <v-spacer></v-spacer>
                    <v-btn color="debug" @click.native="person_edit()" >{{ $t("Export to vcs") }}</v-btn>
                    <v-btn color="debug" to="/">{{ $t("Show QR") }}</v-btn>
                </v-card-actions>            
            </v-row>
        
    </div>
</template>

<script>
    import axios from 'axios'
    import TableCrudAlias from './TableCrudAlias';
    import TableCrudAddress from './TableCrudAddress';
    import TableCrudMail from './TableCrudMail';
    import TableCrudPhone from './TableCrudPhone';
    import {logout} from '../functions.js'
    export default {
        name: 'PersonEdit',    
        components: {
            TableCrudAlias,
            TableCrudAddress,
            TableCrudMail,
            TableCrudPhone,
        },
        data () {
            return {
                tab: null,
                person: {}, //Created in created method works not in mounted                     
                menu_birth: false,
                menu_death: false,
                refreshKey:0,
            }
        },
        computed: {
            fullName: function (){
                return `${this.person.name} ${this.person.surname} ${this.person.surname2}`
            }
        },
        methods: {
            logout,
            person_edit(){             
                axios.put(`${this.$store.state.apiroot}/api/persons/${this.person.id}/`, this.person ,{ headers: {'Authorization': `Token ${this.$store.state.token}`, 'Content-Type': 'application/json'}})
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
                    return response.data;//To make syncronous
                    
                }, (error) => {
                    console.log(error);
                });
            },
            PersonEdit_refreshKey(){
                this.refreshKey=this.refreshKey+1;
                console.log(`Updating PersonEdit RefreshKey to ${this.refreshKey}`)
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
