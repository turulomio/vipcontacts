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
                <v-btn color="primary" text @click.native="increment()">Sign in</v-btn>
                <v-btn color="error" text @click.native="dialog = false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script>



// import Vue from 'vue'
// console.log(Vue.prototype.$mem)
// Vue.prototype.$mem.pass="PASSCHANGED"
    export default {
        name: 'btnSignIn',
        data () {
            return {
                dialog: false,
                count: 0,
            }
        },
        methods: {
            increment () {  
                this.count++
                console.log(this.count)
                console.log(this.$store.state.pass)
                console.dir(this.$root.$data.passmem)
                this.$store.state.pass="HOLA"
                console.log(this.$store.state.pass)
            }
        },
    }
</script>
