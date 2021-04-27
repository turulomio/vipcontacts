<template>
    <v-app>    
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-card class="mx-auto" width="300">
                <v-list>
                
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">Vip Contacts</v-list-item-title>
                            <v-list-item-subtitle>{{ $store.state.version }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>
                
<!--                     HOME -->
                    <v-list-item link router :to="{ name: 'home'}">
                        <v-list-item-icon><v-icon color="#757575;">mdi-home</v-icon></v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>
                    <v-list-group :value="false" prepend-icon="mdi-account-circle" v-if="this.$store.state.logged">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Contacts") }}</v-list-item-title>
                        </template>

                        <v-list-item link  router :to="{ name: 'person_add'}">
                            <v-list-item-title>{{ $t("Add contact") }}</v-list-item-title>
                            <v-list-item-icon><v-icon>mdi-add</v-icon></v-list-item-icon>
                        </v-list-item>
                    </v-list-group>

<!--                     GROUP -->
                    <v-list-group :value="false" prepend-icon="mdi-account-supervisor-circle" v-if="this.$store.state.logged">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Groups") }}</v-list-item-title>
                        </template>

                        <v-list-item link  router :to="{ name: 'group_members'}">
                            <v-list-item-title class="mr-7">{{ $t("Members") }}</v-list-item-title>
                            <v-list-item-icon><v-icon></v-icon></v-list-item-icon>
                        </v-list-item>
                    </v-list-group>
                    
<!--                     SETTINGS -->
                    <v-list-item link router :to="{ name: 'settings'}" v-if="this.$store.state.logged">
                        <v-list-item-icon><v-icon color="#757575;">mdi-cog</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Settings") }}</v-list-item-title>
                    </v-list-item>
                    
<!--                     HELP -->
                    <v-list-group :value="false" prepend-icon="mdi-lifebuoy">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Help") }}</v-list-item-title>
                        </template>

                        <v-list-item link  router :to="{ name: 'about'}">
                            <v-list-item-title class="mr-7">{{ $t("About") }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item link  router :to="{ name: 'statistics'}" v-if="this.$store.state.logged">
                            <v-list-item-title class="mr-7">{{ $t("Statistics") }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item key="1" href="https://github.com/turulomio/vipcontacts/" target="_blank">
                            <v-list-item-title>{{ $t('Vip Contacts Github') }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item key="2" href="https://github.com/turulomio/django_vipcontacts/" target="_blank">
                            <v-list-item-title>{{ $t('Django Vip Contacts Github') }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </v-card>
        </v-navigation-drawer>
        
        <v-app-bar color="primary" dark  fixed fill-height app >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn color="primary" :to="{ name: 'home'}"><v-icon dark>mdi-home</v-icon></v-btn>
            <v-spacer />
            <h1 class="font-weight-black text-no-wrap text-truncate" >{{ $t("Vip Contacts. Another way to manage your contacts") }}</h1>
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

