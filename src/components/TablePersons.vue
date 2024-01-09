
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
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon :data-test="`TablePersons_ButtonEdit${item.id}`" small class="mr-2" @click.stop="editPerson(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`TablePersons_ButtonDelete${item.id}`" small class="mr-2" @click.stop="deletePerson(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
        <!-- DIALOG PERSONVIEW -->
        <v-dialog v-model="dialog_person_view" width="100%">
            <v-card class="pa-4">
                <PersonView :person_url="person_url" :key="key"/>
            </v-card>
        </v-dialog>
        <!-- DIALOG PERSONCRUD -->
        <v-dialog v-model="dialog_person_crud" width="50%">
            <v-card class="pa-4">
                <PersonCRUD :person="person" :deleting="person_deleting" :key="key" @cruded="on_PersonCRUD_cruded()"></PersonCRUD>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import PersonCRUD from '@/components/PersonCRUD.vue'
    import PersonView from '@/components/PersonView.vue'
    export default {
        name: 'home',
        components: {
            PersonView,
            PersonCRUD,
        },
        props: {
            data: {         
                required:true,    
            },
            sorting: {
                default: [{key:"name",order:'asc'}]
            }
        },
        data(){ 
            return{
                person_url:null,
                key:0,
   
                //DIALOG PERSONVIEW
                dialog_person_view:false,


                // DIALOG PERSONCRUD
                dialog_person_crud:false,
                person: null,
                person_deleting: false,
                
                headers: [
                    { title: this.$t('Name'), align: 'start', sortable: true, value: 'name', width:"15%"},
                    { title: this.$t('Surname'), value: 'surname', width:"15%" },
                    { title: this.$t('Second surname'), value: 'surname2', width:"15%"},
                    { title: this.$t('Birth date'), value: 'birth' ,width:"10%"},
                    { title: this.$t('Information'), value: 'information', sortable: false,  width: "45%"  },
                    { title: this.$t('Actions'), value: 'actions', sortable: false },
                    ],
            }
        },
        methods: {
            viewItem (event,object) {
                this.person_url=object.item.url
                this.key+=1
                this.dialog_person_view=true
            },
            editPerson(item) {
                this.person=item
                this.person_deleting=false
                this.key+=1
                this.dialog_person_crud=true                    
            },
            deletePerson(item){
                this.person=item
                this.person_deleting=true
                this.key+=1
                this.dialog_person_crud=true
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
            },
            on_PersonView_exited(){
                this.dialog_person_view=false
            },
            on_PersonCRUD_cruded(){
                this.dialog_person_crud=false
                this.$emit("cruded")
            }
        },
    }
</script>

