<template>
    <div>
        <h1>{{ $t("GroupMembers") }}</h1>
        <AutoCompleteApiOneField v-model="group" :label="$t('Select a group')" :placeholder="$t('Enter a string to search a group')" :apiurl="`${this.$store.state.apiroot}/api/groups/`" field="name" @input="refresh_members" />
        
        <v-switch v-model="members" :label="$t('Show group members')" @change="refresh_members"></v-switch>
        <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1" enabled="i">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Search results</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="add_to_group(item)" v-show="!members">mdi-plus</v-icon>
                <v-icon small @click="remove_from_group(item)" v-show="members">mdi-minus</v-icon>
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
                members: true,
            }
        },          
        methods: {
            refresh_members: function() {
                console.log("refresh_members")
                axios.get(`${this.$store.state.apiroot}/api/groups/members/?search=${this.group}&members=${this.members}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.data= response.data;
                }, (error) => {
                    console.log(error);
                });
            },
            editItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },
        }
    }
</script>

