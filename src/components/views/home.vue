<template>
    <div>
        <h1>{{ $t('Wellcome to Vip Contacts') }}</h1>
        <div v-show="this.$store.state.logged">
            <v-text-field 
                v-model="search" 
                type="text" 
                :counter="100"  
                v-bind:label="$t('String to search in contacts')" 
                required 
                v-bind:placeholder="$t('Enter search')" 
                @keyup="on_search_change()"
            ></v-text-field>
                  
                  
                  
                  
        <v-data-table
            :headers="headers"
            :items="data"
            sort-by="name"
            class="elevation-1"
        >
  
  
  
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Search results</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New contact
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Dessert name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.calories"
                      label="Calories"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.fat"
                      label="Fat (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.carbs"
                      label="Carbs (g)"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.protein"
                      label="Protein (g)"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        name: 'home',
        data(){ 
            return{
                search:"",  
                data: [],
                dialog:false,
                dialogDelete: false,
                headers: [
                    { text: this.$t('Name'), align: 'start', sortable: true, value: 'name'},
                    { text: this.$t('Surname'), value: 'surname' },
                    { text: this.$t('Second surname'), value: 'surname2' },
                    { text: 'Birth', value: 'birth' },
                    { text: 'Actions', value: 'actions', sortable: false },
                    ],      editedIndex: -1,
                editedItem: {
                    name: '',
                    surname: '',
                    surname2: '',
                    birth: new Date().toISOString().substr(0, 10),
                    death: '',
                    gender: 0,
                },
                defaultItem: {
                    name: '',
                    surname: '',
                    surname2: '',
                    birth: new Date().toISOString().substr(0, 10),
                    death: '',
                    gender: 0,
                },
            }
        },    
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
            },
            },
        methods: {
            on_search_change(){
                this.get_persons()
            },            
            get_persons(){
                axios.get(`http://192.168.1.100:8001/api/persons/?search=${this.search}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.data= response.data;
                }, (error) => {
                    console.log(error);
                });
            },
            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteItemConfirm () {
                this.desserts.splice(this.editedIndex, 1)
                this.closeDelete()
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },

            closeDelete () {
                this.dialogDelete = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },

            save () {
                if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {
                this.desserts.push(this.editedItem)
                }
                this.close()
            },
                },
                components: {
                }
            }
</script>
<style>
</style>

