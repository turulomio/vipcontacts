<template>
    <div>
        <h1>{{ $t("GroupMembers") }}</h1>
        <AutoCompleteApiOneField v-model="group" :label="$t('Select a group')" :placeholder="$t('Enter a string to search a group')" :apiurl="`${this.$store.state.apiroot}/api/groups/`" field="name" @input="refresh_members" />
        <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1" enabled="i">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Search results</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </div>
    
    
</template>

<script>
    import AutoCompleteApiOneField from './AutoCompleteApiOneField.vue'
    import axios from 'axios'
    export default {
        name: 'GroupMembers',
        components: {
            AutoCompleteApiOneField,
        },
        data(){
            return {
                group: '',
                data: [],
                headers: [
                    { text: this.$t('Name'), align: 'start', sortable: true, value: 'name'},
                    { text: this.$t('Surname'), value: 'surname' },
                    { text: this.$t('Second surname'), value: 'surname2' },
                    { text: this.$t('Birth date'), value: 'birth' },
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],
            }
        },          
        methods: {
            refresh_members: function() {
                console.log("refresh_members")
                axios.get(`${this.$store.state.apiroot}/api/groups/members/?search=${this.group}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.data= response.data;
                    //this.PersonEdit_refreshKey();
                    
                }, (error) => {
                    console.log(error);
                });
            },
        }
    }
</script>

