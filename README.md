# vipcontacts

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

> vipcontacts@0.1.0 i18n:report
> vue-cli-service i18n:report --src "./src/**/*.?(js|vue)" --locales "./src/locales/**/*.json"

[37m┌────[39m[37m┬────────────[39m[37m┬────────────────────────────────────────[39m[37m┬────────[39m[37m┬──────────────────────────────┐[39m
[37m│[39m[32m #  [39m[37m│[39m[32m Language   [39m[37m│[39m[32m File                                   [39m[37m│[39m[32m Line   [39m[37m│[39m[32m Missing i18n Entry           [39m[37m│[39m
[37m├────[39m[37m┼────────────[39m[37m┼────────────────────────────────────────[39m[37m┼────────[39m[37m┼──────────────────────────────┤[39m
[37m│[39m 0  [37m│[39m es         [37m│[39m /src/components/about.vue              [37m│[39m 7      [37m│[39m Language flags are from cou… [37m│[39m
[37m│[39m 1  [37m│[39m es         [37m│[39m /src/components/about.vue              [37m│[39m 10     [37m│[39m hola inside                  [37m│[39m
[37m│[39m 2  [37m│[39m es         [37m│[39m /src/components/about.vue              [37m│[39m 11     [37m│[39m This is a text               [37m│[39m
[37m│[39m 3  [37m│[39m es         [37m│[39m /src/components/Home.vue               [37m│[39m 20     [37m│[39m Search                       [37m│[39m
[37m│[39m 4  [37m│[39m es         [37m│[39m /src/components/Menu.vue               [37m│[39m 32     [37m│[39m Vip Contacts Github          [37m│[39m
[37m│[39m 5  [37m│[39m es         [37m│[39m /src/components/Menu.vue               [37m│[39m 33     [37m│[39m Django Vip Contacts Github   [37m│[39m
[37m│[39m 6  [37m│[39m es         [37m│[39m /src/components/PersonEdit.vue         [37m│[39m 56     [37m│[39m Logs                         [37m│[39m
[37m│[39m 7  [37m│[39m es         [37m│[39m /src/components/PersonEdit.vue         [37m│[39m 110    [37m│[39m Export to vcs                [37m│[39m
[37m│[39m 8  [37m│[39m es         [37m│[39m /src/components/PersonEdit.vue         [37m│[39m 111    [37m│[39m Show QR                      [37m│[39m
[37m│[39m 9  [37m│[39m es         [37m│[39m /src/components/PersonEdit.vue         [37m│[39m 169    [37m│[39m Something is wrong           [37m│[39m
[37m│[39m 10 [37m│[39m es         [37m│[39m /src/components/SelectPersons.vue      [37m│[39m 12     [37m│[39m Select a contact             [37m│[39m
[37m│[39m 11 [37m│[39m es         [37m│[39m /src/components/TableCrudAddress.vue   [37m│[39m 19     [37m│[39m Add address                  [37m│[39m
[37m│[39m 12 [37m│[39m es         [37m│[39m /src/components/TableCrudAddress.vue   [37m│[39m 26     [37m│[39m Edit address                 [37m│[39m
[37m│[39m 13 [37m│[39m es         [37m│[39m /src/components/TableCrudAddress.vue   [37m│[39m 27     [37m│[39m Add address                  [37m│[39m
[37m│[39m 14 [37m│[39m es         [37m│[39m /src/components/TableCrudAddress.vue   [37m│[39m 30     [37m│[39m Enter a address              [37m│[39m
[37m│[39m 15 [37m│[39m es         [37m│[39m /src/components/TableCrudAddress.vue   [37m│[39m 34     [37m│[39m Select a country             [37m│[39m
[37m│[39m 16 [37m│[39m es         [37m│[39m /src/components/TableCrudAlias.vue     [37m│[39m 13     [37m│[39m Add alias                    [37m│[39m
[37m│[39m 17 [37m│[39m es         [37m│[39m /src/components/TableCrudAlias.vue     [37m│[39m 55     [37m│[39m Add a alias                  [37m│[39m
[37m│[39m 18 [37m│[39m es         [37m│[39m /src/components/TableCrudAlias.vue     [37m│[39m 69     [37m│[39m Edit this alias              [37m│[39m
[37m│[39m 19 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 15     [37m│[39m Add log                      [37m│[39m
[37m│[39m 20 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 16     [37m│[39m Show automatic logs          [37m│[39m
[37m│[39m 21 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 17     [37m│[39m Hide automatic logs          [37m│[39m
[37m│[39m 22 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 22     [37m│[39m Edit log                     [37m│[39m
[37m│[39m 23 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 23     [37m│[39m Add log                      [37m│[39m
[37m│[39m 24 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 26     [37m│[39m Log                          [37m│[39m
[37m│[39m 25 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 26     [37m│[39m Enter a log                  [37m│[39m
[37m│[39m 26 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 52     [37m│[39m Datetime                     [37m│[39m
[37m│[39m 27 [37m│[39m es         [37m│[39m /src/components/TableCrudLog.vue       [37m│[39m 66     [37m│[39m Text                         [37m│[39m
[37m│[39m 28 [37m│[39m es         [37m│[39m /src/components/TableCrudMail.vue      [37m│[39m 16     [37m│[39m Add mail                     [37m│[39m
[37m│[39m 29 [37m│[39m es         [37m│[39m /src/components/TableCrudMail.vue      [37m│[39m 23     [37m│[39m Edit mail                    [37m│[39m
[37m│[39m 30 [37m│[39m es         [37m│[39m /src/components/TableCrudMail.vue      [37m│[39m 24     [37m│[39m Add mail                     [37m│[39m
[37m│[39m 31 [37m│[39m es         [37m│[39m /src/components/TableCrudMail.vue      [37m│[39m 27     [37m│[39m Enter a mail                 [37m│[39m
[37m│[39m 32 [37m│[39m es         [37m│[39m /src/components/TableCrudPhone.vue     [37m│[39m 16     [37m│[39m Add phone                    [37m│[39m
[37m│[39m 33 [37m│[39m es         [37m│[39m /src/components/TableCrudPhone.vue     [37m│[39m 23     [37m│[39m Edit phone                   [37m│[39m
[37m│[39m 34 [37m│[39m es         [37m│[39m /src/components/TableCrudPhone.vue     [37m│[39m 24     [37m│[39m Add phone                    [37m│[39m
[37m│[39m 35 [37m│[39m es         [37m│[39m /src/components/TableCrudPhone.vue     [37m│[39m 27     [37m│[39m Enter a phone                [37m│[39m
[37m│[39m 36 [37m│[39m es         [37m│[39m …components/TableCrudRelationship.vue  [37m│[39m 16     [37m│[39m Add relationship             [37m│[39m
[37m│[39m 37 [37m│[39m es         [37m│[39m …components/TableCrudRelationship.vue  [37m│[39m 23     [37m│[39m Edit relationship            [37m│[39m
[37m│[39m 38 [37m│[39m es         [37m│[39m …components/TableCrudRelationship.vue  [37m│[39m 24     [37m│[39m Add relationship             [37m│[39m
[37m│[39m 39 [37m│[39m es         [37m│[39m …components/TableCrudRelationship.vue  [37m│[39m 59     [37m│[39m Destiny                      [37m│[39m
[37m└────[39m[37m┴────────────[39m[37m┴────────────────────────────────────────[39m[37m┴────────[39m[37m┴──────────────────────────────┘[39m
[37m┌────[39m[37m┬────────────[39m[37m┬────────────────────────────────────────[39m[37m┬──────[39m[37m┬───────────────────┐[39m
[37m│[39m[33m #  [39m[37m│[39m[33m Language   [39m[37m│[39m[33m File                                   [39m[37m│[39m[33m Line [39m[37m│[39m[33m Unused i18n Entry [39m[37m│[39m
[37m├────[39m[37m┼────────────[39m[37m┼────────────────────────────────────────[39m[37m┼──────[39m[37m┼───────────────────┤[39m
[37m│[39m 0  [37m│[39m es         [37m│[39m /src/locales/es.json                   [37m│[39m 36   [37m│[39m No contacts found [37m│[39m
[37m└────[39m[37m┴────────────[39m[37m┴────────────────────────────────────────[39m[37m┴──────[39m[37m┴───────────────────┘[39m
npm run i18n:report
