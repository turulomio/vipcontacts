<template>
      <v-autocomplete
        v-model="localValue"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        item-text="name"
        item-value="name"
        :no-data-text="$t('You must select a item')"
        hide-selected
        outlined
        persistent-hint
        chips
        :label="$t('Select a contact')"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
      ></v-autocomplete>
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
    },
    data: () => ({
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      search: null,
      localValue: null
    }),

    computed: {
      items () {
        let r=[]
        const field=this.field
        this.entries.forEach(entry => r.push({"name": entry[field]}))
        console.log(r)
        return r
      },
    },
    watch: {
      search () {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        
        axios.get(this.apiurl, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
        .then((response) => {
            this.entries=response.data 
            this.canclick=true;
        }, (error) => {
            console.log(error);
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
       console.log(`value changed to ${newValue}`)
     }
    },
  }
</script>
