<template>
    <div v-show="this.$store.state.logged">
        <div  class="login">
            <h1>{{ $t("Add a contact") }}</h1>
            <v-text-field v-model="person.name" type="text" :counter="75"  v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter name')" ></v-text-field>
            <v-text-field v-model="person.surname" type="text" v-bind:label="$t('Surname')" :counter="75" v-bind:placeholder="$t('Enter surname')" ></v-text-field>
            <v-text-field v-model="person.surname2" type="text" v-bind:label="$t('Second surname')" :counter="75" v-bind:placeholder="$t('Enter second surname')" ></v-text-field>
            <v-row>
                <MyDatePicker v-model="person.birth" :label="$t('Birth date')"></MyDatePicker>
                <v-spacer></v-spacer>
                <MyDatePicker v-model="person.death" :label="$t('Death date')"></MyDatePicker>
                <v-spacer></v-spacer>           
                <v-select :items="this.$store.state.catalogs.persongender" v-model="person.gender" :label="$t('Select a gender')" item-text="display_name" item-value="value" ></v-select>
            </v-row>
            <v-card-actions> 
                <v-btn color="primary" @click.native="person_add()" >{{ $t("Add") }}</v-btn>
                <v-btn color="error" :to="{name: 'home'}">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import MyDatePicker from './reusing/MyDatePicker.vue'
    export default {
        name: 'PersonAdd',        
        components: {
            MyDatePicker,
        },
        data () {
            return {
                person: {
                    name: "",
                    surname: "",
                    surname2: "",      
                    birth: null,
                    death: null,
                    gender: 0,
                },
                menu_birth: false,
                menu_death: false,
            }
        },
        methods: {
            person_add(){             
                axios.post(`${this.$store.state.apiroot}/api/persons/`, this.person, this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.name=null;
                    this.surname=null;
                    this.$router.push({ name: 'home'})
                }, (error) => {
                    this.parseResponseError(error)
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
