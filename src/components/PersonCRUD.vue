<template>
    <div v-show="useStore().logged">
            <h1>{{ title() }}</h1>
            <v-card class="pa-4 ma-3">
                <v-text-field data-test="PersonCRUD_Name" v-model="newperson.name"  :readonly="mode=='D'" type="text" :counter="75"  :label="$t('Name')" :placeholder="$t('Enter name')" ></v-text-field>
                <v-text-field data-test="PersonCRUD_Surname" v-model="newperson.surname" :readonly="mode=='D'" type="text" :label="$t('Surname')" :counter="75" :placeholder="$t('Enter surname')" ></v-text-field>
                <v-text-field data-test="PersonCRUD_Surname2" v-model="newperson.surname2" :readonly="mode=='D'" type="text" :label="$t('Second surname')" :counter="75" :placeholder="$t('Enter second surname')" ></v-text-field>
                <v-row class="pl-8 my-3" justify="center">
                    <MyDatePicker data-test="PersonCRUD_Birth" v-model="newperson.birth" :readonly="mode=='D'" :label="$t('Birth date')"></MyDatePicker>
                    <v-spacer></v-spacer>
                    <MyDatePicker data-test="PersonCRUD_Death" v-model="newperson.death" :readonly="mode=='D'" :label="$t('Death date')"></MyDatePicker>
                    <v-spacer></v-spacer>           
                </v-row>
                <v-select data-test="PersonCRUD_Gender" :items="useStore().persongender" :readonly="mode=='D'" v-model="newperson.gender" :label="$t('Select a gender')" item-title="display_name" item-value="value" ></v-select>

                <v-card-actions> 
                    <v-spacer></v-spacer>
                    <v-btn data-test="PersonCRUD_Button" color="primary" @click="accept_dialog()" >{{ button() }}</v-btn>
                </v-card-actions>
            </v-card>
    </div>
</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { myheaders,parseResponseError } from '@/functions';
    import MyDatePicker from './reusing/MyDatePicker.vue'
    export default {  
        components: {
            MyDatePicker,
        },
        props:{
            person:{
                required:true,
            },
            deleting:{
                required:false,
                default:false
            },
            
        },
        data () {
            return {
                newperson: null,
                mode:null, //C: Create, R: Read, U: Update, D: Delete
            }
        },
        methods: {
            useStore,
            myheaders,
            parseResponseError,
            title(){
                if (this.mode=="D"){
                    return this.$t("Deleting a contact")
                } else if (this.mode=="U"){
                    return this.$t("Updating a contact")
                } else if (this.mode=="C"){
                    return this.$t("Creating a new contact")
                }
            },
            button(){
                if(this.mode=="U"){
                    return this.$t("Update")
                } else if (this.mode=="C"){
                    return this.$t("Create")
                } else if (this.mode=="D"){
                    return this.$t("Delete")
                }
            },
            accept_dialog(){             
                if (this.mode=="C"){
                    axios.post(`${this.useStore().apiroot}/api/person/`, this.newperson, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
                else if (this.mode=="U"){
                    this.newperson.dt_update=new Date()
                    axios.put(this.newperson.url, this.newperson, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
                else if (this.mode=="D"){
                    var r = confirm(this.$t("Do you want to delete this contact?"))
                    if(r == false) {
                        return
                    } 
                    r = confirm(this.$t("The contact and all it's dependent data will be deleted. Do you want to continue?"))
                    if(r == false) {
                        return
                    } 
                    axios.delete(this.newperson.url, this.myheaders())
                    .then(() => {
                        this.$emit("cruded")
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            if (this.deleting==true){
                this.mode="D"
            } else if ( this.person.url!=null){ 
                this.mode="U"
            } else {
                this.mode="C"
            }
            this.newperson=Object.assign({},this.person)
        }

    }
</script>