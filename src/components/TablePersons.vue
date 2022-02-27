
<template>
    <div>
        <v-data-table :headers="headers" :items="data" :sort-by="orderby" class="elevation-1">
            <template v-slot:[`item.name`]="{ item }">
                <v-icon small class="mr-2" >{{person_icon(item)}}</v-icon>
                {{item.name}}
            </template>
            <template v-slot:[`item.birth`]="{ item }">
                <div class="text-no-wrap">
                    <v-icon small v-if="item.death!=null" >mdi-cross</v-icon>
                    {{item.birth}}
                </div>
            </template>
            <template v-slot:[`item.information`]="{ item }">
                    <v-chip v-for="chip in chips(item)" :key="chip" small class="mr-2" @click="chipClicked(chip)">{{ chip }}</v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="viewItem(item)">mdi-eye</v-icon>
            </template>
        </v-data-table>
    </div>
</template>
<script>
    import {mdiGenderMale, mdiGenderFemale } from '@mdi/js'
    export default {
        name: 'home',
        props: {
            data: {
            },
            orderby: {
                default: "name"
            }
        },
        data(){ 
            return{
                mdiGenderMale,
                mdiGenderFemale,
                dialog:false,
                headers: [
                    { text: this.$t('Name'), align: 'start', sortable: true, value: 'name'},
                    { text: this.$t('Surname'), value: 'surname' },
                    { text: this.$t('Second surname'), value: 'surname2' },
                    { text: this.$t('Birth date'), value: 'birth' ,width:"10%"},
                    { text: this.$t('Information'), value: 'information', sortable: false,  width: "30%"  },
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "7%"},
                    ],
            }
        },
        methods: {
            viewItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },

            person_icon(item){
                if (item.gender==0){
                    return mdiGenderMale
                } else {
                    return mdiGenderFemale
                }
            },
            chips(item){
                return eval(item.search[0].chips)
            },
            chipClicked(chip){
                this.$emit('chipClicked', chip)
            }
        },
    }
</script>

