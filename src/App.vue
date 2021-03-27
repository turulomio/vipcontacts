<template>
  <v-app>
    <v-app-bar app color="primary" dark fixed >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <h1>Vip Contacts</h1>
      </div>
      <v-spacer></v-spacer>
        <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            >
            Person
            </v-btn>
        </template>
        <v-list>
            <v-list-item
            v-for="(item, index) in items"
            :key="index"
            router :to="item.route"
            >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        </v-menu>
      <v-spacer></v-spacer>
    
      <v-btn @click.native.stop="dialog = true" text >
        <v-icon>mdi-account</v-icon>
        <span class="mr-2">Sign in</span>
      </v-btn>    
        <v-dialog v-model="dialog" max-width="290">
        <v-card>
            <v-card-title class="headline">Use Google's location service?</v-card-title>
            <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
            <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Agree</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </v-app-bar>

    <v-main>   
    <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
    name: 'App',

    components: {
    },

    data () {
        return {
        dialog: false,
            items: [
                { title: 'Person', icon: 'mdi-view-dashboard', route:"/"},
                { title: 'HelloWorld', icon: 'mdi-image', route:"/helloworld"},
                { title: 'About', icon: 'mdi-help-box', route:"/about" },
            ],
            right: null,
        }
    },
};
</script>
<style>
h1 {
    text-align:center;
}
</style>

