<template>
    <div>
        <v-btn @click.native="logout()" color="primary" >
            <v-icon>mdi-logout</v-icon>
            <span class="mr-2">{{ $t("Log out") }}</span>
        </v-btn>   
    </div>
</template>

<script>
    import {logout} from '../functions.js'
    export default {
        name: 'btnLogOut',
        methods: {
            logout,
        },
    }
</script>
