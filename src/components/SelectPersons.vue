<template>
      <v-autocomplete
        v-model="localValue"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        color="white"
        hide-no-data
        hide-selected
        item-text="name"
        item-value="url"
        :label="$t('Select a contact')"
        placeholder="Start typing to Search"
        prepend-icon="mdi-database-search"
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
    data: () => ({
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      search: null,
      localValue: null
    }),

    computed: {
//       fields () {
//         if (!this.model) return []
// 
//         return Object.keys(this.model).map(key => {
//           return {
//             key,
//             value: this.model[key] || 'n/a',
//           }
//         })
//       },
      items () {
        return this.entries.map(entry => {
          const Description = entry.name.length > this.descriptionLimit
            ? entry.name.slice(0, this.descriptionLimit) + '...'
            : entry.name
        console.log("Entry")
          console.log(entry)
        console.log("Description")
          console.log(Description)
          return Object.assign({}, entry, { Description })
        })
      },
    },

    watch: {
      search (val) {
        // Items have already been loaded
        if (this.items.length > 0) return

        // Items have already been requested
        if (this.isLoading) return

        this.isLoading = true

        
        axios.get(`${this.$store.state.apiroot}/api/find/?search=${val}`, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
        .then((response) => {
            
            this.entries=response.data 
            console.log("ENTRIES")
            console.log(this.entries)
            
            //this.data= response.data;
            this.canclick=true;
        }, (error) => {
            console.log(error);
            this.canclick=true;
        })
          .finally(() => (this.isLoading = false));
        
      },
     localValue (newValue) {
       console.log(newValue);
       this.$emit('input', newValue)
       console.log(`LocalValue changed and emited input to ${newValue}`)
       console.log(newValue);
     },
     value (newValue) {
       this.localValue = newValue
       console.log(`value changed to ${newValue}`)
     }
    },
  }
</script>
