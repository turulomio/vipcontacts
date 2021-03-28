<template>
    <div>
        <h1>About</h1>
        <p class="text-justify">This project is in <a href="https://github.com/turulomio/vipcontacts">Github</a></p>
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
