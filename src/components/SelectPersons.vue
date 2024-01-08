<template>
      <v-autocomplete
        v-model="localValue"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        item-text="name"
        item-value="url"
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
  export default {
    name:"SelectPersons",
    props: {
        value: {
            required: true
        }
    },
    data(){ 
        return{
          descriptionLimit: 60,
          entries: [],
          isLoading: false,
          search: null,
          localValue: null
        }
    },

    computed: {
      items () {
        let r=[]
        this.entries.forEach(entry => r.push({"url": entry.url, "name":entry.fullname}))
        return r
      },
    },
    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        axios.get(`${this.$store.state.apiroot}/api/person/?search=${val}`, this.myheaders())
        .then((response) => {
            this.entries=response.data 
            this.canclick=true;
        }, (error) => {
            this.parseResponseError(error)
            this.canclick=true;
        })
          .finally(() => (this.isLoading = false));
      },
      localValue (newValue) {
        this.$emit('input', newValue)
        console.log(`LocalValue changed and emited input to ${newValue}`)
      },
      value (newValue) {
        this.localValue = newValue
        //console.log(`value changed to ${newValue}`)
      }
    },
    mounted(){
      //console.log(this.$attrs)
    }
  }
</script>
