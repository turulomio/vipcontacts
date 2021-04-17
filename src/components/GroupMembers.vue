<template>
    <div>
        <h1>{{ $t("GroupMembers") }}</h1>
            <AutoCompleteApiOneField v-model="group" :label="$t('Select a group')" :placeholder="$t('Enter a string to search a group')" canadd :apiurl="`${this.$store.state.apiroot}/api/groups/`" field="name" />
    </div>
</template>

<script>
    import AutoCompleteApiOneField from './AutoCompleteApiOneField.vue'
    export default {
        name: 'GroupMembers',
        components: {
            AutoCompleteApiOneField,
        },
        data(){
            return {
                group: '',
            }
        },  
    }
</script>

