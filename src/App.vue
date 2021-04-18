<template>
    <v-app>
        <v-app-bar app color="primary" dark fixed  fill-height >   
            <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="./assets/vip.svg" transition="scale-transition" width="50" height="50" />
            <h1>Vip Contacts</h1>
            <v-spacer />
            <Menu/>
            <v-spacer />
            <SwitchLanguages />
            <btnLogIn v-show="!this.$store.state.logged"/>
            <btnLogOut v-show="this.$store.state.logged"/>

        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

import Menu from './components/Menu';
import btnLogIn from './components/btnLogIn';
import btnLogOut from './components/btnLogOut';
import SwitchLanguages from './components/SwitchLanguages.vue';
export default {
    name: 'App',

    components: {
        btnLogIn,
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

