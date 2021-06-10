
<template>
    <div>
        <v-data-table :headers="headers" :items="data" :sort-by="orderby" class="elevation-1">
            <template v-slot:[`item.name`]="{ item }">
                <v-icon small class="mr-2" >{{person_icon(item)}}</v-icon>
                {{item.name}}
            </template>
            <template v-slot:[`item.birth`]="{ item }">
                <div class="text-no-wrap">
                    <v-icon small v-if="item.death!=null" >{{mdiChristianity}}</v-icon>
                    {{item.birth}}
                </div>
            </template>
            <template v-slot:[`item.information`]="{ item }">
                    <v-chip v-for="chip in chips(item)" :key="chip" small class="mr-2" @click="chipClicked(chip)">{{ chip }}</v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </div>
</template>
<script>
    import axios from 'axios'  
    import {mdiGenderMale, mdiGenderFemale, mdiChristianity} from '@mdi/js'
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
                mdiChristianity,
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
            editItem (item) {
                this.$router.replace({ name: 'person_edit', params: { "id": item.id }})
            },

            deleteItem (item) {
               var r = confirm(this.$t("Do you want to delete this item?"))
               if(r == false) {
                  return
               } 
               r = confirm(this.$t("The contact and all it's dependent data will be deleted. Do you want to continue?"))
               if(r == false) {
                  return
               } 
                axios.delete(`${this.$store.state.apiroot}/api/persons/${item.id}`, this.myheaders())
                .then((response) => {
                    console.log(response);
                    this.on_search_change()
                }, (error) => {
                    this.parseResponseError(error)
                });
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

