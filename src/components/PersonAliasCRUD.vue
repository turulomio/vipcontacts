<template>
    <div>       
        <v-card class="pa-3">
            <v-card-title class="headline" >{{ title() }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-text-field :readonly="mode=='D'" data-test="PersonAliasCRUD_Alias" v-model="new_alias.name" type="text" :counter="75"  v-bind:label="$t('Alias')" required v-bind:placeholder="$t('Enter an alias')" :rules="RulesString(75,true)" />
            </v-form>
                        
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="PersonAliasCRUD_Button" color="primary" @click.native="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>

</template>
<script>

import axios from 'axios'
    import { useStore } from '@/store';
    import { RulesString, localtime } from 'vuetify_rules';
    import { myheaders,parseResponseError } from '@/functions';
    export default {
        props: ['alias','mode'],
        data () {
            return {
                new_alias: null,

                form_valid:false,
            }
        },
        methods:{
            useStore,
            myheaders,
            parseResponseError,
            RulesString,
            localtime,
            title(){
                if (this.mode=="C"){
                    return this.$t("Add alias") 
                } else if (this.mode=="U"){
                    return this.$t("Edit alias") 
                
                } else if (this.mode=="D"){
                    return this.$t("Delete alias") 
                }
            },
            button(){
                if (this.mode=="C"){
                    return this.$t("Add") 
                } else if (this.mode=="U"){
                    return this.$t("Edit") 
                
                } else if (this.mode=="D"){
                    return this.$t("Delete") 
                }
            },
            accept(){
                console.log(this.new_alias)
                if (this.$refs.form.validate()==false) return

                if (this.mode=="C"){
                    this.new_alias.dt_update=new Date();
                    axios.post(`${this.useStore().apiroot}/api/alias/`, this.new_alias, this.myheaders())
                    .then((response) => {
                        console.log(response.data);
                        this.new_alias=response.data; //To get id
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="U"){

                    this.new_alias.dt_update=new Date();
                    console.log(this.new_alias)
                    axios.put(this.new_alias.url, this.new_alias, this.myheaders())
                    .then((response) => {
                        console.log(response.data);
                        this.new_alias=response.data;
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="D"){
                    var r = confirm("Do you want to delete this alias?");
                    if(r == false) {
                        return;
                    }  
                    axios.delete(this.new_alias.url, this.myheaders())
                    .then((response) => {
                        console.log(response);
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            this.new_alias=Object.assign({},this.alias)
        }
    }

</script>

