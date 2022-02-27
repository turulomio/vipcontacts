<template>
    <div v-show="this.$store.state.logged">
        <div  class="login">
            <h1>{{ $t("Add a contact") }}
                <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
            </h1>
            <v-text-field v-model="newperson.name" type="text" :counter="75"  v-bind:label="$t('Name')" v-bind:placeholder="$t('Enter name')" ></v-text-field>
            <v-text-field v-model="newperson.surname" type="text" v-bind:label="$t('Surname')" :counter="75" v-bind:placeholder="$t('Enter surname')" ></v-text-field>
            <v-text-field v-model="newperson.surname2" type="text" v-bind:label="$t('Second surname')" :counter="75" v-bind:placeholder="$t('Enter second surname')" ></v-text-field>
            <v-row>
                <MyDatePicker v-model="newperson.birth" :label="$t('Birth date')"></MyDatePicker>
                <v-spacer></v-spacer>
                <MyDatePicker v-model="newperson.death" :label="$t('Death date')"></MyDatePicker>
                <v-spacer></v-spacer>           
                <v-select :items="this.$store.state.catalogs.persongender" v-model="newperson.gender" :label="$t('Select a gender')" item-text="display_name" item-value="value" ></v-select>
            </v-row>
            <v-card-actions> 
                <v-btn color="primary" @click.native="accept_dialog()" >{{ button() }}</v-btn>
                <v-btn color="error" :to="{name: 'home'}">{{ $t("Cancel") }}</v-btn>
            </v-card-actions>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import MyDatePicker from './reusing/MyDatePicker.vue'
    import MyMenuInline from './reusing/MyMenuInline.vue'
    export default {  
        components: {
            MyDatePicker,
            MyMenuInline,
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
                menuinline_items: [
                    {
                        subheader: this.$t("Contact options"),
                        children: [
                            {
                                name: this.$t("Add a new contact"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.get_quotes_in_future()
                                    this_.key=this_.key+1
                                },
                            },
                        ]
                    },
                ],
                newperson: null,
                mode:null, //C: Create, R: Read, U: Update, D: Delete
            }
        },
        methods: {
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
                    axios.post(`${this.$store.state.apiroot}/api/persons/`, this.newperson, this.myheaders())
                    .then((response) => {
                        this.$emit("cruded")
                        console.log(response.data)
                    }, (error) => {
                        this.parseResponseError(error)
                    });
                }
            },
        },
        created(){
            if (this.deleting==true) this.mode="D"
            if ( this.person.url!=null){ 
                this.mode="U"
            } else {
                this.mode="C"
            }
            this.newperson=Object.assign({},this.person)
        }

    }
</script>