<template>
    <v-app>    
<!--        <v-app-bar app color="primary" dark fixed  fill-height >   

        </v-app-bar>-->
        <v-app-bar color="primary" dark fill-height app  >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-img alt="Vuetify Logo" class="shrink mr-2" contain src="./assets/vip.svg" transition="scale-transition" width="50" height="50" />
            <h1>Vip Contacts</h1>
            <v-spacer />
            <v-btn color="primary" to="/"><v-icon dark>mdi-home</v-icon></v-btn>
            <SwitchLanguages />
            <btnLogIn v-show="!this.$store.state.logged"/>
            <btnLogOut v-show="this.$store.state.logged"/>

        </v-app-bar>
        <v-navigation-drawer class="primary" v-model="drawer" absolute clipped>
            <v-card class="mx-auto" width="300">
                <v-list>
                    <v-list-item link router to="/">
                        <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
                    <v-list-item link router to="/">
                        <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>

                    <v-list-group :value="false" prepend-icon="mdi-account-circle">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Contacts") }}</v-list-item-title>
                        </template>

                        <v-list-item link  router to="/person/add">
                            <v-list-item-title>{{ $t("Add contact") }}</v-list-item-title>
                            <v-list-item-icon><v-icon>mdi-add</v-icon></v-list-item-icon>
                        </v-list-item>
                    </v-list-group>

                    <v-list-group :value="false" prepend-icon="mdi-account-supervisor-circle">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Groups") }}</v-list-item-title>
                        </template>

                        <v-list-item link  router to="/group/members">
                            <v-list-item-title class="mr-7">{{ $t("Members") }}</v-list-item-title>
                            <v-list-item-icon><v-icon></v-icon></v-list-item-icon>
                        </v-list-item>
                    </v-list-group>
                    
                    <v-list-group :value="false" prepend-icon="mdi-lifebuoy">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Help") }}</v-list-item-title>
                        </template>

                        <v-list-item link  router to="/about">
                            <v-list-item-title class="mr-7">{{ $t("About") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item key="1" href="https://github.com/turulomio/vipcontacts/" target="_blank"><v-list-item-title>{{ $t('Vip Contacts Github') }}</v-list-item-title></v-list-item>
                        <v-list-item key="2" href="https://github.com/turulomio/django_vipcontacts/" target="_blank"><v-list-item-title>{{ $t('Django Vip Contacts Github') }}</v-list-item-title></v-list-item>
                    </v-list-group>
                </v-list>
            </v-card>
        </v-navigation-drawer>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

import btnLogIn from './components/btnLogIn';
import btnLogOut from './components/btnLogOut';
import SwitchLanguages from './components/SwitchLanguages.vue';
export default {
    name: 'App',

    components: {
        btnLogIn,
        btnLogOut,
        SwitchLanguages,
    },

    data () {
        return {
            logged:false,
            drawer: false,
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

