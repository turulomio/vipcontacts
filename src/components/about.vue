<template>
    <div>
        <h1>{{ $t("About") }}</h1>
        <h2>{{ this.$store.state.version }}</h2>
        <p class="text-justify">{{ $t("This project is in _link_", link="<a href="https://github.com/turulomio/vipcontacts">Github</a>") }}</p>
        
        <p class="text-justify">{{ $t("Language flags are from country-flags project (https://github.com/hampusborgos/country-flags)")}}
        <p>{{ $t('message') }}</p>
        <p>{{ $t('hola') }}</p>
        <p>{{ $t('hola inside') }}</p>
        <p>{{ $t('This is a text') }}</p>
        <p>{{ $t('company', {company: "Google"}) }}</p>
        <p>{{ $tc('number messages', 0) }}</p>
        <p>{{ $tc('number messages', 1) }}</p>
        <p>{{ $tc('number messages', 22) }}</p>
    </div>
</template>

<script>
    export default {
        name: 'About',
/*        data(){
            return {
                version: this.$store.state.version,
            }
        },  */
//         created(){
//             this.version=
//         }
    }
</script>
<i18n>
{
  "en": {
    "hola inside": "Hello i18n in SFC!"
  },
  "es": {
    "hola inside": "Hola i18n desde dentro SFC!"
  }
}
</i18n>
