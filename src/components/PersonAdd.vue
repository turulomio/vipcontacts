<template>
    <div>
        <v-card  class="login">
            <v-card-title class="headline">{{ $t("Add a contact") }}</v-card-title>
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
            <v-text-field v-model="gender" type="text" v-bind:label="$t('Gender')" :counter="75" v-bind:placeholder="$t('Enter gender')" ></v-text-field>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="person_add()" >{{ $t("Log in") }}</v-btn>
                <v-btn color="error" to="/">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'PersonAdd',
        data () {
            return {
                name: null,
                surname: null,
                surname2: null,      
                birth: new Date().toISOString().substr(0, 10),
                menu_birth: false,
                death: "",
                menu_death: false,
                gender: 1,
            }
        },
        methods: {
            person_add(){
                const formData = new FormData();
                formData.append('name', this.name);
                formData.append('surname', this.surname);
                formData.append('surname2', this.surname2);
                formData.append('birth', this.birth);
                formData.append('death', this.death);
                formData.append('gender', this.gender);
                
//                 data={
//                     "name": this.name,
//                     "surname"
//                 }
              
                axios.post('http://192.168.1.100:8001/api/persons/', formData,{ headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    console.log(response.data);
                    if (response.data.includes(" ")){
                        alert(response.data)
                    } else {
                        this.name=null;
                        this.surname=null;
                    }
                }, (error) => {
                    console.log(error);
                });
            }
        },
    }
</script>
<style>
.login{
    padding:30px;
}
</style>
