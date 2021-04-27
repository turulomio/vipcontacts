<template>
    <div class="paragraph">
        <h1>{{ $t(`About Vip Contacts`) }}</h1>
        <h2>{{ `${$store.state.version} (${$store.state.versiondate.toISOString().slice(0,10)})` }}</h2>
        
        <v-container  class="paragraph">
            <p>{{ $t("Vip Contacts is a contact management application") }}<p>
            
            <p class="paragraph" ref="github"></p>
            <p class="paragraph">{{ $t("Main features:") }}</p>
            
            <ul class="paragraph">
                <li>{{ $t("Address suport where you can print your envelopes.") }}</li>
                <li>{{ $t("Address links to Google Maps position.") }}</li>
        </ul>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: 'About',
        data(){
            return {
            }
        },
        mounted(){
            console.log(this.$refs)
            console.log(this.$refs.github)
            console.log(this.$refs.github.innerHTML)
            this.$refs.github.innerHTML=this.$t("Project main page is located in Github , where you can help me coding or translating to different languages.").replace("Github",'<a href="https://github.com/turulomio/vipcontacts">Github</a>')
        }
    }
</script>
<style>
h2 {
    text-align: center;
    font-weight: normal;
}

paragraph{
    text-align:justify;
    padding: 30px;
}
</style>
