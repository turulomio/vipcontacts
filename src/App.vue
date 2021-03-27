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

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
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

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>    
    </v-app-bar>

    <v-main>   

    <router-view/>
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
            items: [
                { title: 'Person', icon: 'mdi-view-dashboard', route:"/"},
                { title: 'HelloWorld', icon: 'mdi-image', route:"/helloworld"},
                { title: 'About', icon: 'mdi-help-box', route:"about" },
            ],
            right: null,
        }
    },
};
</script>
