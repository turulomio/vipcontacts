<template>
    <div>       
        <v-card class="pa-3">
            <v-card-title class="headline" >{{ title() }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-select :readonly="mode=='D'" :items="useStore().mailtype" v-model="new_mail.retypes" :label="$t('Select a type')"  item-title="display_name" item-value="value"  ></v-select>  
                <v-text-field :readonly="mode=='D'" data-test="PersonMailCRUD_Mail" v-model="new_mail.mail" type="text" :counter="75"  :label="$t('Mail')" required :placeholder="$t('Enter a mail')" :rules="RulesEmail(true)" />
            </v-form>
                        
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn data-test="PersonMailCRUD_Button" color="primary" @click="accept()" :disabled="!form_valid">{{ button() }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>

</template>

<script>
    import axios from 'axios'
    import { useStore } from '@/store';
    import { RulesEmail, localtime } from 'vuetify_rules';
    import { getObjectPropertyByValue, myheaders,parseResponseError } from '@/functions';
    export default {
        props: ['mail','mode'],
        data () {
            return {
                new_mail: null,

                form_valid:false,
            }
        },
        methods:{
            useStore,
            getObjectPropertyByValue,myheaders,parseResponseError,
            RulesEmail,
            localtime,
            title(){
                if (this.mode=="C"){
                    return this.$t("Add mail") 
                } else if (this.mode=="U"){
                    return this.$t("Edit mail") 
                
                } else if (this.mode=="D"){
                    return this.$t("Delete mail") 
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
                if (this.$refs.form.validate()==false) return

                if (this.mode=="C"){
                    this.new_mail.dt_update=new Date();
                    axios.post(`${this.useStore().apiroot}/api/mail/`, this.new_mail, this.myheaders())
                    .then((response) => {
                        this.new_mail=response.data; //To get id
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="U"){

                    this.new_mail.dt_update=new Date();
                    axios.put(this.new_mail.url, this.new_mail, this.myheaders())
                    .then((response) => {
                        this.new_mail=response.data;
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="D"){
                    var r = confirm("Do you want to delete this mail?");
                    if(r == false) {
                        return;
                    }  
                    axios.delete(this.new_mail.url, this.myheaders())
                    .then(() => {
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            this.new_mail=Object.assign({},this.mail)
        }
    }
</script>