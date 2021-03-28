<template>
    <div>
        <h1>About</h1>
        <p class="text-justify">This project is in <a href="https://github.com/turulomio/vipcontacts">Github</a></p>
        <p>{{ $t('message') }}</p>
        <p>{{ $t('hola') }}</p>
        <p>{{ $t('This is a text') }}</p>
        <p>{{ $t('company', {company: "Google"}) }}</p>
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
    "hola": "Hello i18n in SFC!"
  }
}
</i18n>
