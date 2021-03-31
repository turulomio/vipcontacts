<template>
    <v-app>
        <v-app-bar app color="primary" dark fixed  fill-height >   
            <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png" transition="scale-transition" width="40" />
            <h1>Vip Contacts</h1>
            <v-spacer />
            <Menu />
            <v-spacer />
            <SwitchLanguages />
            <btnSignIn v-show="!this.$store.state.logged"></btnSignIn>
            <btnLogOut v-show="this.$store.state.logged"></btnLogOut>

        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

import Menu from './components/Menu';
import btnSignIn from './components/btnSignIn';
import btnLogOut from './components/btnLogOut';
import SwitchLanguages from './components/SwitchLanguages.vue';
export default {
    name: 'App',

    components: {
        btnSignIn,
        btnLogOut,
        Menu,
        SwitchLanguages,
    },

    data () {
        return {
            logged:false,
        }
    },
};

</script>
<style>
h1 {
    text-align:center;
    padding: 10px;
}

SwitchLanguages{
    vertical-align:center;
}
</style>

