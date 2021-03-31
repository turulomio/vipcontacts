<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" :close-on-content-click="false" >
                <img :src="current.icon" />
            </v-btn>
        </template>
        <v-list>
            <v-list-item v-for="(item,index) in locales" :key="index" @click="switchLocale(item)">
                <v-list-item-icon><img :src="item.icon" width="36px" height="36px"/></v-list-item-icon>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>    
</template>

<script>
    var languages=[
                    { text: "Español", value: "es", icon: require("../assets/es.svg")}, //Got from https://github.com/hampusborgos/country-flags
                    { text: "English", value: "en", icon: require("../assets/us.svg")},
                  ]
    
    export default {
        name: 'SwitchLanguages',
        data(){
            return {
                locales: languages,
                current: this.get_current(),
            }
        },
        methods:{
            switchLocale(item){
                if (this.$i18n.locale!== item.value){
                    this.$i18n.locale=item.value;
                }
                localStorage.locale=item.value;
                this.current=item;
            },
            get_current(){
                if (!localStorage.locale) {
                    localStorage.locale="en"
                }
                this.$i18n.locale=localStorage.locale
                this.$vuetify.lang.current = localStorage.locale
                return languages.find(x => x.value === localStorage.locale)
            }
        }
    }
</script>
