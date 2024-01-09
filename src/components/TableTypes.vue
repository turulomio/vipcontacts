
<template>
    <div>
        <h1>{{ $t('Auxiliar tables management') }}</h1>
        <br>
        <v-select class="ml-4 mr-4" v-model="combo" :items="tables" :label="$t('Select a database table')" item-title="name"  return-object ></v-select>
        <v-card class="padding">
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Bucar en tabla" single-line></v-text-field>
            <v-data-table dense v-model="items_selected" :headers="headers" :items="items"  :sort-by="[{key:'count',order:'asc'}]" class="elevation-1" show-select :search="search"  item-key="name"></v-data-table>
        </v-card>
        <v-btn color="error"  @click="mergeItems()" :disabled="items_selected.length<1">{{ $t("Merge / Rename types") }}</v-btn>
        <v-dialog v-model="dialog" max-width="550">
            <v-card  class="pa-3">
                <v-card-title class="headline">{{dialog_title}}</v-card-title>
                <v-form ref="form" v-model="form_valid" lazy-validation>
                    <v-text-field v-model="newname" type="text" :counter="255" :label="$t('Add a type')" required :placeholder="$t('Add a type')" autofocus/>
                </v-form>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="acceptDialog()" :disabled="!form_valid">{{ $t("Log in") }}</v-btn>
                    <v-btn color="error" @click="dialog = false">{{ $t("Cancel") }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    export default {
        data(){ 
            return{
                tables:[
                    { name: this.$t("Organizations"), table: "jobs", field:"organization"},
                    { name: this.$t("Professions"), table: "jobs", field:"profession"},
                    { name: this.$t("Titles"), table: "jobs", field:"title"},
                    { name: this.$t("Departments"), table: "jobs", field:"department"},
                    { name: this.$t("Groups"), table: "groups", field:"name"},
                ],
                dialog:false,
                dialog_title:"",
                form_valid:true,
                headers: [
                    { text: this.$t('Name'), value: 'name'},
                    { text: this.$t('Number'), align: 'right', value: 'count', width:"10%"},
                    ],
                combo: null,
                items: [],
                items_selected: [],
                newname: "",
                search:"",
            }
        },
        watch:{
            combo: function(){
                this.update()
            },
        },
        methods: {
            useStore,
            update(){
                axios.get(`${this.useStore().apiroot}/api/merge_text_fields/${this.combo.table}/${this.combo.field}`, this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    this.items=response.data
                }, (error) => {
                    this.parseResponseError(error)
                });
            },        
            acceptDialog(){               
                var find=""
                for (let i = 0; i < this.items_selected.length; i++) {
                    find=find + "find=" + this.items_selected[i].name + "&"
                }
                find=find.slice(0, -1)
                var replace=this.newname

                axios.get(`${this.useStore().apiroot}/api/merge_text_fields/${this.combo.table}/${this.combo.field}?${find}&replace=${replace}`,  this.myheaders())
                .then((response) => {
                        console.log(response.data)
                        this.items_selected=[]
                        this.update()     
                        this.dialog=false
                }, (error) => {
                    this.parseResponseError(error)
                })
            },
            mergeItems(){       
                if (this.items_selected.length>1){
                    var r = confirm(this.$t("Se van a unir los tipos seleccionados:\n'"+ this.arrayobjects_to_stringofstrings(this.items_selected, 'name')+"'\n¿Quieres continuar?"))
                    if(r == false) {
                        return
                    }
                    this.dialog_title=this.$t("Merge types")
                } else {
                    this.dialog_title=this.$t("Rename type")
                }
                this.dialog=true;
                this.newname=this.items_selected[0].name
            }
        },
        mounted(){
        }
    }
</script>

