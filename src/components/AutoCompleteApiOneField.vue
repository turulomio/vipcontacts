<template>
    <div>
      <v-combobox  v-show="this.canadd"
        v-model="localValue"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        :no-data-text="$t('You can select a item')"
        hide-selected
        background-color="#d8ffdb"
        outlined
        :label="this.$attrs.label"
        :placeholder="this.$attrs.placeholder"
        prepend-icon="mdi-database-search"
      ></v-combobox>
      <v-autocomplete v-show="!this.canadd"
        v-model="localValue"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
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
            oneload:{//If true only ask for data once
                type: Boolean,
                default: false
            }
        },
        data: () => ({
            descriptionLimit: 100,
            entries: [],
            isLoading: false,
            search: null,
            localValue: null
        }),
        computed: {
            items () {
                let r=[]
                const field=this.field
                this.entries.forEach(entry => r.push(entry[field]))
                return r
            },
        },
        watch: {
            search (val) {
                if (this.oneload == true && this.entries.length > 0) return val
                // Items have already been requested
                if (this.isLoading) return val
                this.isLoading = true
                axios.get(this.apiurl, { headers: {'Authorization': `Token ${this.$store.state.token}`   }})
                .then((response) => {
                    this.entries=response.data 
                    console.log("Loaded data")
                }, (error) => {
                    console.log(error);
                })
                .finally(() => {this.isLoading = false; return val});
            },
            localValue (newValue) {
                this.$emit('input', newValue)
                //console.log(`LocalValue changed and emited input to ${newValue}`)
            },
            value (newValue) {
                this.localValue = newValue
                //console.log(`value changed to ${newValue}`)
            }
        },
    }
</script>
