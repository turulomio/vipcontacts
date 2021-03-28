<template>
    <div>
        <v-btn text  @click.native="logout()" >
            <v-icon>mdi-logout</v-icon>
            <span class="mr-2">Log out</span>
        </v-btn>   
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: 'btnLogOut',
        methods: {
            logout(){
                const formData = new FormData();
                formData.append('key', this.$store.state.token);
                axios.post('http://192.168.1.100:8001/logout/', formData)
                .then((response) => {
                    console.log(response.data);
                    this.$store.state.token=null;
                    this.$store.state.logged=false;
                }, (error) => {
                    console.log(error);
                });
            }
        },
    }
</script>
