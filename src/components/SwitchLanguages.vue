<template>
    <div>
        <v-select
            :items="locales"
            v-model="current"
            v-on:change="switchLocale(`${current}`)"
            item-value="current"
        ></v-select>
    </div>
</template>

<script>
    var languages=[
                    { text: "Español", value: "es" },
                    { text: "English", value: "en" },
                  ]
    
    export default {
        name: 'SwitchLanguages',
        data(){
            return {
                locales: languages,
                current: this.get_current(),
            }
        },
        methods:{
            switchLocale(text){
                let obj=languages.find(x => x.text === text)
                if (this.$i18n.locale!== obj.value){
                    this.$i18n.locale=obj.value;
                }
                localStorage.locale=obj.value;
            },
            get_current(){
                if (!localStorage.locale) {
                    localStorage.locale="en"
                }
                this.$i18n.locale=localStorage.locale
                this.$vuetify.lang.current = localStorage.locale
                return languages.find(x => x.value === localStorage.locale)
            }
        }
    }
</script>

<style scoped>
li {
    text-decoration:underline;
    cursor: pointer;
}
</style>
