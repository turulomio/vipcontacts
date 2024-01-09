
<template>
    <div>
        <v-data-table :headers="headers" :items="data" :sort-by="sorting" class="elevation-1" @click:row="viewItem">
            <template v-slot:[`item.name`]="{ item }">
                <v-icon small class="mr-2" >{{person_icon(item)}}</v-icon>
                <div :data-test="`TablePersons_Item${item.id}`">{{item.name}}</div>
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
        </v-data-table>
        <!-- DIALOG PERSONVIEW -->
        <v-dialog v-model="dialog_person_view" width="100%">
            <v-card class="pa-4">
                <PersonView :person_url="person_url" :key="key" />
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import PersonView from '@/components/PersonView.vue'
    export default {
        name: 'home',
        components: {
            PersonView,
        },
        props: {
            data: {
            },
            sorting: {
                default: [{key:"name",order:'asc'}]
            }
        },
        data(){ 
            return{
                dialog_person_view:false,
                person_url:null,
                key:0,

                headers: [
                    { title: this.$t('Name'), align: 'start', sortable: true, value: 'name', width:"15%"},
                    { title: this.$t('Surname'), value: 'surname', width:"15%" },
                    { title: this.$t('Second surname'), value: 'surname2', width:"15%"},
                    { title: this.$t('Birth date'), value: 'birth' ,width:"10%"},
                    { title: this.$t('Information'), value: 'information', sortable: false,  width: "45%"  },
                    ],
            }
        },
        methods: {
            viewItem (item) {
                this.person_url=item.url
                this.key=this.key+1
                this.dialog_person_view=true
            },

            person_icon(item){
                if (item.gender==0){
                    return "mdi-gender-male"
                } else {
                    return "mdi-gender-female"
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

