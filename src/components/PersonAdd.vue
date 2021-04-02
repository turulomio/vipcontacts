<template>
    <div v-show="this.$store.state.logged">
        <div  class="login">
            <h1>{{ $t("Add a contact") }}</h1>
            <v-text-field v-model="person.name" type="text" :counter="75"  v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter name')" ></v-text-field>
            <v-text-field v-model="person.surname" type="text" v-bind:label="$t('Surname')" :counter="75" v-bind:placeholder="$t('Enter surname')" ></v-text-field>
            <v-text-field v-model="person.surname2" type="text" v-bind:label="$t('Second surname')" :counter="75" v-bind:placeholder="$t('Enter second surname')" ></v-text-field>
            <v-row>
                <v-menu v-model="menu_birth" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="person.birth" :label="$t('Birth date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                    </template>
                    <v-date-picker v-model="person.birth" @input="menu_birth = false" ></v-date-picker>
                </v-menu>            
                <v-icon x-small @click="person.birth=null">mdi-backspace</v-icon>
                <v-spacer></v-spacer>
                <v-menu v-model="menu_death" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="person.death" :label="$t('Death date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>                    
                    </template>
                    <v-date-picker v-model="person.death" @input="menu_death = false" ></v-date-picker>
                </v-menu>
                <v-icon x-small @click="person.death=null">mdi-backspace</v-icon>
                <v-spacer></v-spacer>
            
                <v-select :items="this.$store.state.catalogs.persongender" v-model="person.gender" :label="$t('Select a gender')" item-text="display_name" item-value="value" ></v-select>
            </v-row>
            <v-card-actions> 
                <v-btn color="primary" @click.native="person_add()" >{{ $t("Add") }}</v-btn>
                <v-btn color="error" to="/">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'PersonAdd',
        data () {
            return {
                person: {
                    name: null,
                    surname: null,
                    surname2: null,      
                    birth: new Date().toISOString().substr(0, 10),
                    death: null,
                    gender: 0,
                },
                menu_birth: false,
                menu_death: false,
                genders:[
                    { text: this.$t("Man"), value: 0 },
                    { text: this.$t("Woman"), value: 1 },
                ]
            }
        },
        methods: {
            person_add(){             
                axios.post(`${this.$store.state.apiroot}/api/persons/`, this.person,{ headers: {'Authorization': `Token ${this.$store.state.token}`,"Content-Type": "application/json"}})
                .then((response) => {
                    console.log(response.data);
                    this.name=null;
                    this.surname=null;
                    this.$router.push('/');
                }, (error) => {
                    console.log(error);
                });
            },
        },
    }
</script>
<style>
.login{
    padding:30px;
}
</style>
