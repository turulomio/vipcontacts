const fs = require('fs');

module.exports = {
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
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080, 
    hotOnly: false,    
// //     https: {
// //       key: fs.readFileSync("./certs/192.168.1.100_8080.pem"),
// //       cert: fs.readFileSync("./certs/192.168.1.100_8080.pem")
// //     }
  },
}
