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
//     console.log(languages.find(x => x.value === this.$i18n.locale))
    
    export default {
        name: 'SwitchLanguages',
        data(){
            return {
                locales: languages,
                current: languages.find(x => x.value === this.$i18n.locale),
            }
        },
        methods:{
            switchLocale(text){
                let obj=languages.find(x => x.text === text)
                if (this.$i18n.locale!== obj.value){
                    this.$i18n.locale=obj.value;
                }
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
