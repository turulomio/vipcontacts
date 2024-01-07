<template>
    <v-app>    
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-card class="mx-auto" width="300">
                <v-list>
                
                    <v-list-item>
                            <v-list-item-title class="title">Vip Contacts</v-list-item-title>
                            <v-list-item-subtitle>{{ useStore().version }}</v-list-item-subtitle>
                    </v-list-item>

                    <v-divider></v-divider>
                
<!--                     HOME -->
                    <v-list-item link router :to="{ name: 'home'}" prepend-icon="mdi-home" :title="$t('Home')">
                    </v-list-item>

<!--                     CONTACTS -->
                    <v-list-group value="Contacts" prepend-icon="mdi-account-circle" v-if="useStore().logged">
                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" :title="$t('Contacts')" />
                        </template>

                        <v-list-item link  router :to="{ name: 'person_last_edited'}">
                            <v-list-item-title>{{ $t("Last edited") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link  router :to="{ name: 'persons_merge'}">
                            <v-list-item-title>{{ $t("Merge contacts") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>

<!--                     GROUP -->
                    <v-list-group value="Group" v-if="useStore().logged">
                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-account-supervisor-circle" :title="$t('Groups')" />
                        </template>

                        <v-list-item link  router :to="{ name: 'group_members'}">
                            <v-list-item-title class="mr-7">{{ $t("Members") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                    
<!--                     SETTINGS -->
<!--                     ADMINISTRACION -->
                    <v-list-group value="Settings" v-if="useStore().logged">
                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-cog" :title="$t('Settings')" />
                        </template>

                        <v-list-item link router :to="{ name: 'settings'}" v-if="useStore().logged">
                            <v-list-item-title>{{ $t("Your settings") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link  router :to="{ name: 'administration_types'}">
                            <v-list-item-title>{{ $t("Types") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
<!--                     HELP -->
                    <v-list-group value="Help">

                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-lifebuoy" :title="$t('Help')" />
                        </template>
                        <v-list-item link  router :to="{ name: 'about'}">
                            <v-list-item-title class="mr-7">{{ $t("About") }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item link  router :to="{ name: 'statistics'}" v-if="useStore().logged">
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
            <BtnSwitchLanguages />
            <BtnLogIn v-show="!useStore().logged"/>
            <BtnLogOut v-show="useStore().logged"/>

        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

import BtnLogIn from './components/reusing/BtnLogIn';
import BtnLogOut from './components/reusing/BtnLogOut';
import BtnSwitchLanguages from './components/reusing/BtnSwitchLanguages.vue';
import { useStore } from './store';
export default {
    name: 'App',

    components: {
        BtnLogIn,
        BtnLogOut,
        BtnSwitchLanguages,
    },

    data () {
        return {
            logged:false,
            drawer: false,
        }
    },
    methods:{
        useStore,
    }
};

</script>
<style>
h1 {
    text-align:center;
    padding: 10px;
}


.last_update{
    text-align:right;
    color: gray;
}
</style>

