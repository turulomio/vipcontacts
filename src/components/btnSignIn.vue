<template>
    <div>
    <v-btn @click.native.stop="dialog = true" color="primary">
        <v-icon>mdi-account</v-icon>
        <span class="mr-2">{{ $t("Log in") }}</span>
    </v-btn>    
    <v-dialog v-model="dialog" max-width="450">
        <v-card  class="login">
            <v-card-title class="headline">{{ $t("Login in Vip Contacts") }}</v-card-title>
            <v-text-field v-model="user" type="text" :counter="75"  v-bind:label="$t('User')" required v-bind:placeholder="$t('Enter user')" autofocus ></v-text-field>
            <v-text-field v-model="password" type="password" v-bind:label="$t('Password')" :counter="75" v-bind:placeholder="$t('Enter password')" ></v-text-field>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="login()" >{{ $t("Log in") }}</v-btn>
                <v-btn color="error" @click.native="dialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>
    import {myheaders,vuex_update_catalogs} from '../functions.js'
    import axios from 'axios'
    export default {
        name: 'btnSignIn',
        data () {
            return {
                user: null,
                password: null,
                dialog: false,
                valid: false,
            }
        },
        methods: {
            login(){            
                const formData = new FormData();
                formData.append('username', this.user);
                formData.append('password', this.password);
              
                axios.post(`${this.$store.state.apiroot}/login/`, formData)
                .then((response) => {
                    if (response.data.includes(" ")){
                        console.log("Error authenticating")
                        alert(response.data)
                    } else {
                        console.log("Authenticated");
                        this.$store.state.token=response.data;
                        this.$store.state.logged=true;
                        this.vuex_update_catalogs();
                        this.dialog=false;
                        this.user=null;
                        this.password=null;
                    }
                }, (error) => {
                    console.log(error);
                })
            },

            myheaders,
            vuex_update_catalogs,
        },
    }
</script>
<style>
.login{
    padding:30px;
    
}
</style>
