<template>
    <div>
      <v-combobox  v-show="this.canadd"
        v-model="select"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search" 
        :no-data-text="$t('You can select a item')"
        hide-selected
        @blur="search = select"
        background-color="#d8ffdb"
        outlined
        :label="this.$attrs.label"
        :placeholder="this.$attrs.placeholder"
        prepend-icon="mdi-database-search"
      ></v-combobox>
      <v-autocomplete v-show="!this.canadd"
        v-model="select"
        :items="items"
        @keydown="get_data()"
        :loading="isLoading"
        :search-input.sync="select"
        :no-data-text="$t('You must select a item')"
        hide-selected
        background-color="#ffd8db"
        outlined
        :label="this.$attrs.label"
        :placeholder="this.$attrs.placeholder"
        prepend-icon="mdi-database-search"
      ></v-autocomplete>
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        name: 'AutoCompleteApiOneField',
        props: {
            value: { //v-model
                required: true
            },
            apiurl: { //apiurl to query database
                required: true
            },
            field: { //field name of the respone
                required: true
            },
            canadd: {
                type: Boolean,
                default: false
            },
        },
        data: () => ({
            descriptionLimit: 100,
            entries: [],
            isLoading: false,
            search: null,
            lastnewitem: null,
            select: null,
            items:[]
        }),
//         computed: {
//             items () {
//                 let r=[]
//                 const field=this.field
//                 this.entries.forEach(entry => r.push(entry[field]))
//                 console.log(r)
//                 return r
//             },
//         },
        watch: {
            search (val) {
//                 val && val !== this.select 
//                 this.get_data(val)
//                 this.search=val  
//                 console.log(val)
                  this.search=val
//                 return this.search
//                 console.log(this.search)
                this.get_data()
            

                
            },
            select (newValue) {
                this.$emit('input', newValue)
                console.log(`LocalValue changed and emited input to ${newValue}`)
            },
            value (newValue) {
                this.select = newValue
                console.log(`value changed to ${newValue}`)
            }
        },
        methods:{
            get_data(){
                // Items have already been requested
//                 console.log(this)
//                 console.log(this.select)
//                 console.log(this.value)
//                 console.log(this.search)
                if (this.search ==null || this.search=="") return
                
                if (this.isLoading) return
                this.isLoading = true
                axios.get(`${this.apiurl}?search=${this.search}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
//                     this.select=this.value
                    this.entries=response.data 
                    this.items=[]
                    this.entries.forEach(entry => this.items.push(entry[this.field]))
                    console.log(`Loaded ${this.entries.length} data with ${this.search}`)
                    this.items.push(this.search)
                    
                }, (error) => {
                    console.log(error);
                })
                .finally(() => {this.isLoading = false});
            }
        }
    }
</script>
