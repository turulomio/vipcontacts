<template>
    <div v-show="this.$store.state.logged">
        <v-card  class="login">
            <v-card-title class="headline">{{ $t("Edit a contact") }}  {{prueba}}</v-card-title>
            <v-text-field v-model="name" type="text" :counter="75"  v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter name')" ></v-text-field>
            <v-text-field v-model="surname" type="text" v-bind:label="$t('Surname')" :counter="75" v-bind:placeholder="$t('Enter surname')" ></v-text-field>
            <v-text-field v-model="surname2" type="text" v-bind:label="$t('Second surname')" :counter="75" v-bind:placeholder="$t('Enter second surname')" ></v-text-field>
            <v-row>
            <v-menu v-model="menu_birth" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="birth" :label="$t('Birth date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="birth" @input="menu_birth = false" ></v-date-picker>
            </v-menu>            
            <v-menu v-model="menu_death" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="death" :label="$t('Death date')" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="death" @input="menu_death = false" ></v-date-picker>
            </v-menu></v-row>
            
        <v-select
            :items="genders"
            v-model="gender"
            :label="$t('Select a gender')"
        ></v-select>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="person_edit()" >{{ $t("Add") }}</v-btn>
                <v-btn color="error" to="/">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'PersonEdit',
        props: [ 'prueba'],
        data () {
            return {
                name: null,
                surname: null,
                surname2: null,      
                birth: new Date().toISOString().substr(0, 10),
                menu_birth: false,
                death: "",
                menu_death: false,
                gender: 0,    
                genders:[
                    { text: this.$t("Man"), value: 0 },
                    { text: this.$t("Woman"), value: 1 },
                ]
            }
        },
        methods: {
            person_edit(){
                const formData = new FormData();
                formData.append('name', this.name);
                formData.append('surname', this.surname);
                formData.append('surname2', this.surname2);
                formData.append('birth', this.birth);
                formData.append('death', this.death);
                formData.append('gender', this.gender);
              
                axios.post(`${this.$store.state.apiroot}/api/persons/`, formData,{ headers: {'Authorization': `Token ${this.$store.state.token}`   }})
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

        mounted: function() {
            console.dir(this.$route);

        }
    }
</script>
<style>
.login{
    padding:30px;
}
</style>
