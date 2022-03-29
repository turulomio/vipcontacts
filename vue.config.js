const fs = require('fs');

module.exports = {
    configureWebpack: {
      // It will be merged into the final Webpack config
      plugins: [
        // Your plugins here...
      ],
      resolve: {
        fallback: {
            path: false,
            fs:false,
        },
      },
    },

    transpileDependencies: [
        'vuetify'
    ],

    pluginOptions: {
        i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: true
        }
    },  
    publicPath: process.env.VUE_APP_PUBLIC_PATH

}

