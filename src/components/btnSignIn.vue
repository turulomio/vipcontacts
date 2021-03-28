<template>
    <div>
    <v-btn @click.native.stop="dialog = true" text >
        <v-icon>mdi-account</v-icon>
        <span class="mr-2">Sign in</span>
    </v-btn>    
    <v-dialog v-model="dialog" max-width="450">
        <v-card>
            <v-card-title class="headline">Login in Vips Contacts</v-card-title>
            <v-text-field v-model="user" type="text" :counter="75"  v-bind:label="$t('User')" required v-bind:placeholder="$t('Enter user')" ></v-text-field>
            <v-text-field v-model="password" type="password" v-bind:label="$t('Password')" :counter="75" v-bind:placeholder="$t('Enter password')" ></v-text-field>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="login()" >{{ $t("Sign in") }}</v-btn>
                <v-btn color="error" @click.native="dialog = false">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>



import axios from 'axios'
    export default {
        name: 'btnSignIn',
        data () {
            return {
                user: null,
                password: null,
                dialog: false,
                valid: false,
//                 required(propertyType: any){
//                     return (v: string) => 
//                         (v && v.length > 0) || `You must input a ${propertyType}`
//                 }
            }
        },
        methods: {
            login(){
                const formData = new FormData();
                formData.append('username', this.user);
                formData.append('password', this.password);
              
                axios.post('http://192.168.1.100:8001/login/', formData)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.includes(" ")){
                        alert(response.data)
                    } else {
                        this.$store.state.token=response.data;
                        this.$store.state.logged=true;
                        this.dialog=false;
                        this.user=null;
                        this.password=null;
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
    margin:40px;
    padding:10px;
    
}
</style>
