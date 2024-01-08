<template>
    <div>    
        <h1>{{ $t("Merge contacts") }}</h1>           
        <v-card class="pa-6 ma-4" >
            <v-form ref="form" v-model="form_valid" lazy-validation >
                <SelectPersons v-model="new_pm.from" :label="$t('Select a contact to merge from')" :rules="RulesSelection(true)"></SelectPersons>
                <SelectPersons v-model="new_pm.to" :label="$t('Select a contact to merge to')" :rules="RulesSelection(true)"></SelectPersons>
            </v-form>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="merge()" >{{ $t("Merge contacts") }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import {empty_persons_merge} from '../empty_objects.js'
    import { useStore } from '@/store';
    import SelectPersons from './SelectPersons.vue'
    export default {
        components: {
            SelectPersons,
        },
        props: {
            pm: { // Persons merge
                required: false,
                default: null,
            },
        },
        data(){ 
            return{
                form_valid:false,
                new_pm: null,
                key:0,
            }
        },
        methods: {
            empty_persons_merge,
            useStore,
            merge(){    
                if( this.$refs.form.validate()==false) return
                if (this.new_pm.from==this.new_pm.to){
                    alert(this.$t("You can merge the same contact"))
                    return
                }      
                axios.post(`${this.useStore().apiroot}/persons/merge/`, this.new_pm,  this.myheaders())
                .then((response) => {
                    console.log(response.data)
                    if (response.data==true){
                        this.$router.push({ name: 'home'})
                    } else {
                        alert(this.$t("There was a problem merging contacts"))
                    }
                   
                }, (error) => {
                    this.parseResponseError(error)
                })

            },
        },
        created(){
            if (this.pm==null){
                this.new_pm=this.empty_persons_merge()
            } else {
                this.new_pm=Object.assign({},this.pm)
            }
        }
    }
</script>

