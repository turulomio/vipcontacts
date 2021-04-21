<template>
    <div>
        <h1>{{ $t("GroupMembers") }}</h1>
        <v-row class="padding">
            <AutoCompleteApiOneField v-model="group" :label="$t('Select a group')" :placeholder="$t('Enter a string to search a group')" :apiurl="`${this.$store.state.apiroot}/api/groups/`" field="name" @input="refresh_members" />
            <v-switch v-model="members_switch" :label="$t('Show group members')" @change="refresh_members"/>
        </v-row>

        <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1 padding" enabled="i">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small @click="deleteItem(item)" v-show="members_switch && loaded" >mdi-minus</v-icon>
                <v-icon small @click="addItem(item)" v-show="!members_switch && loaded" >mdi-plus</v-icon>
            </template>
        </v-data-table>
        <br>
        <v-row class="padding"> 
            <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="generateVcardFile()" :disabled="group=='' || !loaded" >{{ $t("Export all members ") }}</v-btn>
                <v-btn color="primary" @click.native="generateBirthdayCalendar()" :disabled="group=='' || !loaded">{{ $t("Generate birthday calendar") }}</v-btn>
                <v-btn color="primary" @click.native="dlgAddMembers = true" :disabled="group=='' || !loaded">{{ $t("Add members to group") }}</v-btn>
            </v-card-actions>            
        </v-row>    
        <v-dialog v-model="dlgAddMembers" max-width="450">
            <v-card  class="padding">
                <v-card-title class="headline">{{ $t("Add members to group") }}</v-card-title>
                <SelectPersons v-model="newmember"></SelectPersons>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click.native="add_member()" :disabled="newmember == ''">{{ $t("Add member") }}</v-btn>
                    <v-btn color="error" @click.native="dlgAddMembers = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
    
    
</template>

<script>
    import AutoCompleteApiOneField from './AutoCompleteApiOneField.vue'
    import SelectPersons from './SelectPersons.vue'
    import axios from 'axios'
    import {createEvents} from 'ics'
    import {fullName, age} from '../functions.js'
    export default {
        name: 'GroupMembers',
        components: {
            AutoCompleteApiOneField,
            SelectPersons
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
                members_switch: true,
                dlgAddMembers:false,
                newmember: '',
                loaded: false,
            }
        },          
        methods: {
            age,
            refresh_members: function() {
                this.loaded=false
                console.log("refresh_members")
                axios.get(`${this.$store.state.apiroot}/api/groups/members/?search=${this.group}&members=${this.members_switch}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.data= response.data;
                    this.loaded=true
                }, (error) => {
                    console.log(error);
                });
            },  
            deleteItem(item){
                var r = confirm("Do you want to delete this group?");
                if(r == false) {
                    return;
                }  
                console.log(item)
                axios.delete(`${this.$store.state.apiroot}/api/groups/deletebyname/?url=${item.url}&name=${this.group}` ,{headers: {"Authorization": `Token ${this.$store.state.token}`}})
                .then((response) => {
                    console.log(response)
                    this.refresh_members()
                }, (error) => {
                    console.log(error)
                });
                return item;
            },
            add_member(){
                if (this.group == "" || this.newmember == ""){
                    alert(this.$t("You must select a group and a person first"))
                    this.dlgAddMembers=false
                    return
                }
                this.selected={
                    name: this.group,
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: this.newmember,
                }
                axios.post(`${this.$store.state.apiroot}/api/group/`, this.selected, { headers: {'Authorization': `Token ${this.$store.state.token}`,"Content-Type": "application/json"}})
                .then((response) => {
                    console.log(response.data);
                    this.dlgAddMembers=false;
                    this.refresh_members()
                    this.newmember=""
                }, (error) => {
                    console.log(error);
                });
            },     
            //Adds a member to group using + accion
            addItem(item){
                this.selected={
                    name: this.group,
                    dt_obsolete: null,
                    dt_update: new Date(),
                    person: item.url,
                }
                axios.post(`${this.$store.state.apiroot}/api/group/`, this.selected, { headers: {'Authorization': `Token ${this.$store.state.token}`,"Content-Type": "application/json"}})
                .then((response) => {
                    console.log(response.data);
                    this.refresh_members()
                }, (error) => {
                    console.log(error);
                });
            },
            generateVcardFile(){
                alert("Missing");
            },
            generateBirthdayCalendar(){
                var events=[
                ]
                var this_= this
                this.data.filter(o => o.birth != null).filter(o=> o.death == null).forEach(function(o) {
                    var b=new Date(o.birth)
                    
                    var start =new Array (b.getFullYear(), b.getMonth()+1, b.getDate())
                    events.push({
                        title:this_.$t(`Birthday of ${fullName(o)} (${age(o.birth)} years)`),
                        start: start ,
                        end: start ,
                        //duration: {days: 1},
                        recurrenceRule: `FREQ=YEARLY;BYMONTH=${b.getMonth()+1};BYMONTHDAY=${b.getDate()}`
                    })
                })
                console.log(events)
                const { error, value } = createEvents(events)

                if (error) {
                console.log(error)
                console.log(value)
                return
                }

                console.log(value)
                
                var blob = new Blob([value], { type: 'text/calendar' });
                var link = window.document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `birthdays.ics`
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
        }
    }
</script>
<style scoped>
.padding{
    padding-left:30px;
    padding-right:30px;
}
</style>
