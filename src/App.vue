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
                    <v-list-item data-test="LateralHome" link router :to="{ name: 'home'}" prepend-icon="mdi-home" :title="$t('Home')"></v-list-item>

<!--                     CONTACTS -->
                    <v-list-group data-test="LateralContacts" value="Contacts" prepend-icon="mdi-account-circle" v-if="useStore().logged">
                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" :title="$t('Contacts')" />
                        </template>

                        <v-list-item data-test="LateralLastEdited" link  router :to="{ name: 'person_last_edited'}">
                            <v-list-item-title>{{ $t("Last edited") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralContactsMerge" link  router :to="{ name: 'persons_merge'}">
                            <v-list-item-title>{{ $t("Merge contacts") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>

<!--                     GROUP -->
                    <v-list-group data-test="LateralGroup" value="Group" v-if="useStore().logged">
                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-account-supervisor-circle" :title="$t('Groups')" />
                        </template>

                        <v-list-item data-test="LateralMembers" link  router :to="{ name: 'group_members'}">
                            <v-list-item-title class="mr-7">{{ $t("Members") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                    
<!--                     SETTINGS -->
                    <v-list-group data-test="LateralSettingsGroup" value="Settings" v-if="useStore().logged">
                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-cog" :title="$t('Settings')" />
                        </template>

                        <v-list-item data-test="LateralSettings" link router :to="{ name: 'settings'}" v-if="useStore().logged">
                            <v-list-item-title>{{ $t("Your settings") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralTypes" link  router :to="{ name: 'administration_types'}">
                            <v-list-item-title>{{ $t("Types") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
<!--                     HELP -->
                    <v-list-group data-test="LateralHelpGroup" value="Help">

                        <template v-slot:activator="{props}">
                            <v-list-item v-bind="props" prepend-icon="mdi-lifebuoy" :title="$t('Help')" />
                        </template>
                        <v-list-item link  router :to="{ name: 'about'}">
                            <v-list-item-title class="mr-7">{{ $t("About") }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item data-test="LateralStatistics" link  router :to="{ name: 'statistics'}" v-if="useStore().logged">
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
            <v-app-bar-nav-icon data-test="LateralIcon" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn :to="{ name: 'home'}" icon="mdi-home"></v-btn>
            <v-spacer />
            <h1 class="font-weight-black text-no-wrap text-truncate" >{{ $t("Vip Contacts. Another way to manage your contacts") }}</h1>
            <v-spacer />
            <BtnSwitchLanguages data-test="AppBar_SwitchLanguages" />
            <BtnLogIn data-test="AppBar_Login" v-show="!useStore().logged" />
            <BtnLogOut data-test="AppBar_Logout" v-show="useStore().logged"/>
        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>

import BtnLogIn from '@/components/reusing/BtnLogIn';
import BtnLogOut from '@/components/reusing/BtnLogOut';
import BtnSwitchLanguages from '@/components/reusing/BtnSwitchLanguages';
import { useStore } from '@/store';
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

