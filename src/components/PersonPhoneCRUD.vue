<template>
    <div>       
        <v-card  class="pa-3">
            <v-card-title class="headline" >{{ title() }}</v-card-title>
            
            <v-form ref="form" v-model="form_valid" lazy-validation>
                <v-select data-test="PersonPhoneCRUD_Phonetype" :readonly="mode=='D'" :items="useStore().phonetype" v-model="new_phone.retypes" :label="$t('Select a type')"  item-title="display_name" item-value="value"/>
                <v-text-field data-test="PersonPhoneCRUD_Phone" :readonly="mode=='D'" v-if="[7,8].includes(new_phone.retypes)" v-model="phone_text" type="text" :counter="50" :label="$t('Phone')" required :placeholder="$t('Enter a phone')" :rules="RulesString(50,true)"/>
                <vue-tel-input data-test="PersonPhoneCRUD_Phone" :readonly="mode=='D'" defaultCountry="es" @validate="on_phone_validate" v-if="![7,8].includes(new_phone.retypes)" v-model="phone_text" showDialCode mode="international"></vue-tel-input>
            </v-form>
                        
            <v-card-actions>
                <v-spacer></v-spacer>                
                <v-btn data-test="PersonPhoneCRUD_Button" color="primary" @click.native="accept()" :disabled="!form_valid">{{ button() }}</v-btn>

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
        props: {
            phone: { 
                required: true
            },
            mode: {
                type: String, 
                required: true
            },
        },
        data () {
            return {
                new_phone: null,
                form_valid:false,
                phone_object: null, //vue-tel-input
                phone_text: null, //Not vue-tel-input
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
                    return this.$t("Add phone") 
                } else if (this.mode=="U"){
                    return this.$t("Edit phone") 
                
                } else if (this.mode=="D"){
                    return this.$t("Delete phone") 
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
                console.log(this.new_phone)
                if (this.$refs.form.validate()==false) return




                if (this.mode=="C"){
                    if (this.on_phone_assignation()==false) return
                    this.new_phone.dt_update=new Date();
                    axios.post(`${this.useStore().apiroot}/api/phone/`, this.new_phone, this.myheaders())
                    .then((response) => {
                        console.log(response.data);
                        this.new_phone=response.data; //To get id
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="U"){
                    if (this.on_phone_assignation()==false) return
                    this.new_phone.dt_update=new Date();
                    console.log(this.new_phone)
                    axios.put(this.new_phone.url, this.new_phone, this.myheaders())
                    .then((response) => {
                        console.log(response.data);
                        this.new_phone=response.data;
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                } else if (this.mode=="D"){
                    var r = confirm("Do you want to delete this phone?");
                    if(r == false) {
                        return;
                    }  
                    axios.delete(this.new_phone.url, this.myheaders())
                    .then((response) => {
                        console.log(response);
                        this.$emit('cruded')
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
            on_phone_validate(phone){
                console.log(phone)
                this.phone_object=phone
                if (phone.valid==true){
                    this.new_phone.phone=phone.formatted
                }
            },

            on_phone_assignation(){
                if ([7,8].includes(this.new_phone.retypes)) { //Phone text
                    this.new_phone.phone=this.phone_text
                    return true
                } else {
                    console.log(this.phone_object)
                    if (this.phone_object.valid) {
                        this.new_phone.phone=this.phone_object.formatted
                        return true
                    } else {
                        alert(this.$t("Phone is not valid"))
                        return false
                    }
                }
            },
        },
        created(){
            this.new_phone=Object.assign({},this.phone)
        }
    }

</script>

