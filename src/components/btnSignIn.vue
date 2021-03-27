<template>
    <div>
    <v-btn @click.native.stop="dialog = true" text >
        <v-icon>mdi-account</v-icon>
        <span class="mr-2">Sign in</span>
    </v-btn>    
    <v-dialog v-model="dialog" max-width="450">
        <v-card>
            <v-card-title class="headline">Login in Vips Contacts</v-card-title>
            <v-text-field type="text" placeholder="Enter user"></v-text-field>
            <v-text-field type="password" placeholder="Enter password"></v-text-field>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.native="login()">Sign in</v-btn>
                <v-btn color="error" text @click.native="dialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>



import axios from 'axios'
const formData = new FormData();
formData.append('username', 'root');
formData.append('password', 'root');

// import Vue from 'vue'
// console.log(Vue.prototype.$mem)
// Vue.prototype.$mem.pass="PASSCHANGED"
    export default {
        name: 'btnSignIn',
        data () {
            return {
                dialog: false,
            }
        },
        methods: {
            login(){
                axios.post('http://192.168.1.100:8001/login/', formData)
                .then((response) => {
                    console.log(response.data);
                    this.$root.$data.token=response.data;
                }, (error) => {
                    console.log(error);
                });
            }
        },
    }
</script>
