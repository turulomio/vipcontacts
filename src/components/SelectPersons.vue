<template>
      <v-autocomplete
        v-model="new_value"
        :items="entries"
        :loading="isLoading"
        :search="search"
        :no-data-text="$t('You must select a item')"
        hide-selected
        outlined
        persistent-hint
        :label="($attrs.label) ? $attrs.label : $t('Select a contact')"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
        :rules="($attrs.rules) ? $attrs.rules : []"
      ></v-autocomplete>
</template>
<script>
  import axios from 'axios'
  import { useStore } from '@/store';
  import { myheaders,parseResponseError } from '@/functions';
  export default {
    name:"SelectPersons",
    props: {
        modelValue: {
            required: true
        }
    },
    data(){ 
        return{
          descriptionLimit: 60,
          entries: [],
          isLoading: false,
          search: "",
          new_value: null
        }
    },

    watch: {
      search (val) {
        console.log("search",val)
        if (this.search.length==0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        axios.get(`${this.useStore().apiroot}/api/person/?search=${val}`, this.myheaders())
        .then((response) => {
            this.entries=[]
            response.data.forEach(o => this.entries.push({"value": o.url, "title":o.fullname}))
            this.canclick=true;
        }, (error) => {
            this.parseResponseError(error)
            this.canclick=true;
        })
          .finally(() => (this.isLoading = false));
      },
      new_value (newValue) {
        this.$emit('update:modelValue', newValue)
        console.log(`LocalValue changed and emited input to ${newValue}`)
      },
    },
    methods:{
      useStore,
      myheaders,
      parseResponseError,
    },
    created(){
      if (this.modelValue!=null){
        axios.get(this.modelValue, this.myheaders())
        .then((response) => {
            this.entries.push({"value": response.data.url, "title":response.data.fullname})
        }, (error) => {
            this.parseResponseError(error)
        })
      }
      this.new_value=this.modelValue

    }
  }
</script>
