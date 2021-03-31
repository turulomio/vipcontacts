<template>
    <div>                      
        <v-btn color="primary" to="/"><v-icon dark>mdi-home</v-icon></v-btn>
        <v-menu offset-y >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                >
                {{ $t('Contact') }}
                </v-btn>
            </template>
            <v-list>
                <v-list-item router to="/person/add/" v-show="this.$store.state.logged"><v-list-item-title>{{ $t('Add contact') }}</v-list-item-title></v-list-item>
            </v-list>
        </v-menu>        
        <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
            :close-on-content-click="false" 
            >
            {{ $t('Help') }}
            </v-btn>
        </template>
            <v-list>
                <v-list-item key="0" router to="/about/"><v-list-item-title>{{ $t('About') }}</v-list-item-title></v-list-item>
                <v-list-item key="1" href="https://github.com/turulomio/vipcontacts/" target="_blank"><v-list-item-title>{{ $t('Vip Contacts Github') }}</v-list-item-title></v-list-item>
                <v-list-item key="2" href="https://github.com/turulomio/django_vipcontacts/" target="_blank"><v-list-item-title>{{ $t('Django Vip Contacts Github') }}</v-list-item-title></v-list-item>
            </v-list>
        </v-menu>    
        
    </div>
</template>

<script>
    export default {
        name: 'Menu',
        data () {
            return {
            }
        },
        methods: {
        },
    }
</script>
<style>
</style>
