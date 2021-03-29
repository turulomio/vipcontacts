<template>
    <div>          
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
                <v-list-item key="0" router to="/"><v-list-item-title>{{ $t('Home') }}</v-list-item-title></v-list-item>
                <v-list-item key="1" router to="/helloworld/"><v-list-item-title>{{ $t('HelloWorld') }}</v-list-item-title></v-list-item>
                <v-list-item key="2" router to="/about/"><v-list-item-title>{{ $t('About') }}</v-list-item-title></v-list-item>
            </v-list>
        </v-menu>        
        <v-menu offset-y>
        <template v-slot:activator>
            <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
            :close-on-content-click="false" 
            >
            {{ $t('About') }}
            </v-btn>
        </template>
            <v-list>
                <v-list-item>
                    <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>

                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item>

                <v-list-group
                    :value="true"
                    prepend-icon="mdi-account-circle"
                >
                    <template v-slot:activator>
                    <v-list-item-title>Users</v-list-item-title>
                    </template>

                    <v-list-group
                    no-action
                    sub-group
                    >
                    <template v-slot:activator>
                        <v-list-item-content>
                        <v-list-item-title>Actions</v-list-item-title>
                        </v-list-item-content>
                    </template>

                    <v-list-item key="0" router to="/"><v-list-item-title>{{ $t('Home') }}</v-list-item-title></v-list-item>
                    <v-list-item key="1" router to="/"><v-list-item-title>{{ $t('Home') }}</v-list-item-title></v-list-item>
                    </v-list-group>
                </v-list-group>
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
