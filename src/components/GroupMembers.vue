<template>
    <div>
        <h1>{{ $t("Group members") }}</h1>
        <v-card class="mx-auto padding" max-width="40%">
            <v-card-title>{{ $t("Select your group members")}}</v-card-title>
            <AutoCompleteApiOneField v-model="group" :label="$t('Select a group')" :placeholder="$t('Enter a string to search a group')" :apiurl="`${this.$store.state.apiroot}/api/groups/`" field="name" @input="refresh_members" />
            <v-switch v-model="members_switch" :label="$t('Show group members')" @change="refresh_members"/>
        </v-card> 
        <br>
<v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('Filter')"
        single-line
        hide-details
        :placeholder="$t('Add a string to filter table')"
      ></v-text-field>
    </v-card-title>
        <v-data-table :headers="headers" :items="data" sort-by="name" class="elevation-1 padding" enabled="i" 
      :search="search" :no-data-text="$t('No records found')">
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small @click="deleteItem(item)" v-show="members_switch && loaded" >mdi-minus</v-icon>
                <v-icon small @click="addItem(item)" v-show="!members_switch && loaded" >mdi-plus</v-icon>
            </template>
        </v-data-table>
        </v-card>
        <br>
        <v-row class="padding"> 
            <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn color="primary" @click.native="generateVcardFile()" :disabled="group=='' || !loaded" >{{ $t("Export all members") }}</v-btn>
                <v-btn color="primary" @click.native="generateBirthdayCalendar()" :disabled="group=='' || !loaded">{{ $t("Generate birthday calendar") }}</v-btn>
                <v-btn color="primary" @click.native="generateDeathCalendar()" :disabled="group=='' || !loaded">{{ $t("Generate death day calendar") }}</v-btn>
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
    import AutoCompleteApiOneField from './reusing/AutoCompleteApiOneField.vue'
    import SelectPersons from './SelectPersons.vue'
    import axios from 'axios'
    import {createEvents} from 'ics'
    import {fullName, age_in_a_date, generateVcardObject} from '../functions.js'
    export default {
        name: 'GroupMembers',
        components: {
            AutoCompleteApiOneField,
            SelectPersons
        },
        data(){
            return {
                search:"",
                group: '',
                data: [],
                headers: [
                    { text: this.$t('Name'), align: 'start', sortable: true, value: 'name'},
                    { text: this.$t('Surname'), value: 'surname' },
                    { text: this.$t('Second surname'), value: 'surname2' },
                    { text: this.$t('Birth date'), value: 'birth' },
                    { text: this.$t('Death date'), value: 'death' },
                    { text: this.$t('Actions'), value: 'actions', sortable: false },
                ],
                members_switch: true,
                dlgAddMembers:false,
                newmember: '',
                loaded: false,
            }
        },          
        methods: {
            age_in_a_date,
            fullName,
            generateVcardObject,
            refresh_members: function() {
                if (this.group=="") return
                this.loaded=false
                console.log("refresh_members")
                axios.get(`${this.$store.state.apiroot}/api/groups/members/full/?search=${this.group}&members=${this.members_switch}`, this.myheaders())
                .then((response) => {
                    this.data= response.data
                    this.loaded=true
                }, (error) => {
                    this.parseResponseError(error)
                });
            },  
            deleteItem(item){
                var r = confirm(`Do you want to remove '${this.fullName(item)}' from this group?`);
                if(r == false) {
                    return;
                }  
                console.log(item)
                axios.delete(`${this.$store.state.apiroot}/api/groups/deletebyname/?url=${item.url}&name=${this.group}`, this.myheaders())
                .then((response) => {
                    console.log(response)
                    this.refresh_members()
                }, (error) => {
                    console.log(error)
                });
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
                axios.post(`${this.$store.state.apiroot}/api/group/`, this.selected,  this.myheaders())
                .then((response) => {
                    console.log(response.data);
                    this.dlgAddMembers=false;
                    this.refresh_members()
                    this.newmember=""
                }, (error) => {
                    this.parseResponseError(error)
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
                axios.post(`${this.$store.state.apiroot}/api/group/`, this.selected, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.refresh_members()
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
            generateVcardFile(){
                var s=""
                var this_=this
                this.data.forEach(function(o) {
                    s=s.concat(this_.generateVcardObject(o).getFormattedString())
                })
                console.log(s)
                
                var blob = new Blob([s], { type: 'text/vcard' });
                var link = window.document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${this.group}.vcard`
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            generateBirthdayCalendar(){
                var events=[]
                var this_= this
                
                // ADD BIRTHDAYS FOR 5 YEARS
                this.data.filter(o => o.birth != null).filter(o=> o.death == null).forEach(function(o) {
                    for (let i =0; i < 5; i++) {
                        var year=new Date().getFullYear()+i
                        var birth=new Date(o.birth)
                        var this_year_birth= new Date(year,  birth.getMonth()+1, birth.getDate())
                        var str_this_year_birth= this_year_birth.toISOString()
                        var arr_this_year_birth=new Array(year,  birth.getMonth()+1, birth.getDate())
                        events.push({
                            title:this_.$t(`Birthday of ${fullName(o)} (${age_in_a_date(o.birth, str_this_year_birth)} years)`),
                            start: arr_this_year_birth ,
                            end: arr_this_year_birth ,
                            //duration: {days: 1},
                            //recurrenceRule: `FREQ=YEARLY;BYMONTH=${b.getMonth()+1};BYMONTHDAY=${b.getDate()}`
                        })
                    }
                })
                
                
                // ADD MEMORIES OF BIRTHDAYS FOR 5 YEARS OF DEATH PEOPLE
                this.data.filter(o => o.birth != null).filter(o=> o.death != null).forEach(function(o) {
                    for (let i =0; i < 5; i++) {
                        var year=new Date().getFullYear()+i
                        var birth=new Date(o.birth)
                        var this_year_birth= new Date(year,  birth.getMonth()+1, birth.getDate())
                        var str_this_year_birth= this_year_birth.toISOString()
                        var arr_this_year_birth=new Array(year,  birth.getMonth()+1, birth.getDate())
                        events.push({
                            title:this_.$t(`Memory of ${fullName(o)}, who died at the age of ${age_in_a_date(o.birth, o.death)} and today would be ${age_in_a_date(o.birth, str_this_year_birth)}  years old.`),
                            start: arr_this_year_birth ,
                            end: arr_this_year_birth ,
                            //duration: {days: 1},
                            //recurrenceRule: `FREQ=YEARLY;BYMONTH=${b.getMonth()+1};BYMONTHDAY=${b.getDate()}`
                        })
                    }
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
            generateDeathCalendar(){
                var events=[]
                var this_= this
                
                // ADD DEATH REMEMBER FOR 5 YEARS
                this.data.filter(o => o.death != null).forEach(function(o) {
                    for (let i =0; i < 5; i++) {
                        var year=new Date().getFullYear()+i
                        var death=new Date(o.death)
                        var arr_this_year_death=new Array(year,  death.getMonth()+1, death.getDate())
                        events.push({
                            title:this_.$t(`${fullName(o)} died ${year-death.getFullYear()} years ago.`),
                            start: arr_this_year_death ,
                            end: arr_this_year_death ,
                        })
                    }
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
